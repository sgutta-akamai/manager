import { WAFAction, type WAFCustomRule } from '@linode/api-v4';
import {
  useUpdateCustomRuleMutation,
  useWafCustomRulesQuery,
} from '@linode/queries';
import { Box, Paper, Select } from '@linode/ui';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableRowLoading } from 'src/components/TableRowLoading/TableRowLoading';
import { TableSortCell } from 'src/components/TableSortCell';

import { CustomRuleDrawer } from './CustomRuleDrawer';

const StyledCustomRuleLabel = styled('span')({
  color: '#0174BC',
  cursor: 'pointer',
});

const ACTION_OPTIONS = [
  { label: 'Alert', value: WAFAction.ALERT },
  { label: 'Deny', value: WAFAction.DENY },
  { label: 'Not used', value: WAFAction.NOT_USED },
];

const ACTION_LABELS = {
  [WAFAction.ALERT]: 'Alert',
  [WAFAction.DENY]: 'Deny',
  [WAFAction.NOT_USED]: 'Not used',
};

interface CustomRulesTableProps {
  isCreateDrawerOpen?: boolean;
  onCloseCreateDrawer?: () => void;
  wafId: number;
}

export const CustomRulesTable: React.FC<CustomRulesTableProps> = ({
  wafId,
  isCreateDrawerOpen = false,
  onCloseCreateDrawer,
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [selectedRule, setSelectedRule] = React.useState<null | WAFCustomRule>(
    null
  );
  // Track local action changes to update UI immediately
  const [localActionChanges, setLocalActionChanges] = React.useState<
    Record<number, WAFAction>
  >({});

  const {
    data: customRulesData,
    isLoading,
    refetch,
  } = useWafCustomRulesQuery(wafId, {
    page,
    page_size: pageSize,
  });

  const customRules = React.useMemo(() => {
    const rules = customRulesData?.data || [];
    return [...rules].sort((a, b) =>
      sortOrder === 'asc'
        ? a.label.localeCompare(b.label)
        : b.label.localeCompare(a.label)
    );
  }, [customRulesData?.data, sortOrder]);

  const totalResults = customRulesData?.results || 0;

  const handleSort = () =>
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleRuleClick = (rule: WAFCustomRule) => setSelectedRule(rule);

  const handleCloseDrawer = () => {
    setSelectedRule(null);
    if (onCloseCreateDrawer) {
      onCloseCreateDrawer();
    }
    // Only refetch data when a backend operation was successful
    refetch();
  };

  const { enqueueSnackbar } = useSnackbar();
  const updateCustomRuleMutation = useUpdateCustomRuleMutation(wafId);

  const handleActionChange = (index: number, newAction: WAFAction) => {
    const rule = customRules[index];
    if (!rule?.id) {
      enqueueSnackbar('Unable to update rule: Rule ID not found', {
        variant: 'error',
      });
      return;
    }

    // Update local state for immediate UI feedback
    setLocalActionChanges((prev) => ({ ...prev, [index]: newAction }));

    // Create updated rule data
    const updatedRuleData: WAFCustomRule = {
      ...rule,
      action: newAction,
    };

    updateCustomRuleMutation.mutate(
      {
        ruleId: rule.id,
        data: updatedRuleData,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(`Rule "${rule.label}" action updated successfully`, {
            variant: 'success',
          });
        },
        onError: (error) => {
          // Extract error message from API response - error is APIError[]
          const errorMessage =
            Array.isArray(error) && error.length > 0
              ? error[0].reason
              : 'Failed to update rule action';
          enqueueSnackbar(errorMessage, {
            variant: 'error',
          });
          // Revert local state change on error
          setLocalActionChanges((prev) => ({ ...prev, [index]: rule.action }));
        },
      }
    );
  };

  const handleRuleDelete = (_ruleId: number, _ruleLabel: string) => {
    // TODO: Implement delete functionality
  };

  return (
    <div style={{ width: '100%' }}>
      <Paper sx={{ width: '100%', padding: '0' }}>
        <Box>
          <Table noOverflow={true} striped={false}>
            <TableHead>
              <TableRow>
                <TableSortCell
                  active
                  direction={sortOrder}
                  handleClick={handleSort}
                  label="label"
                  sx={{ width: '70%' }}
                >
                  Rule Name
                </TableSortCell>
                <TableCell sx={{ width: '25%' }}>Action</TableCell>
                <TableCell sx={{ width: '5%' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRowLoading columns={3} />
              ) : customRules.length === 0 ? (
                <TableRowEmpty colSpan={3} message="No data to display." />
              ) : (
                customRules.map((rule, index) => {
                  // Use local action change if it exists, otherwise use the rule's action
                  const currentAction =
                    localActionChanges[index] ?? rule.action;

                  return (
                    <TableRow key={rule.id || `${rule.label}-${index}`}>
                      <TableCell>
                        <StyledCustomRuleLabel
                          onClick={() => handleRuleClick(rule)}
                        >
                          {rule.label}
                        </StyledCustomRuleLabel>
                      </TableCell>
                      <TableCell>
                        <Select
                          hideLabel={true}
                          label="action"
                          onChange={(e, selected) => {
                            if (selected) {
                              handleActionChange(
                                index,
                                selected.value as WAFAction
                              );
                            }
                          }}
                          options={ACTION_OPTIONS}
                          value={
                            currentAction
                              ? {
                                  label: ACTION_LABELS[currentAction],
                                  value: currentAction,
                                }
                              : null
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <ActionMenu
                          actionsList={[
                            {
                              title: 'Delete',
                              onClick: () =>
                                handleRuleDelete(rule.id!, rule.label),
                            },
                          ]}
                          ariaLabel={`Action menu for custom rule ${rule.label}`}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      <PaginationFooter
        count={totalResults}
        handlePageChange={handlePageChange}
        handleSizeChange={handlePageSizeChange}
        page={page}
        pageSize={pageSize}
      />
      {/* Single drawer for both create and edit modes */}
      {(selectedRule || isCreateDrawerOpen) && (
        <CustomRuleDrawer
          onClose={handleCloseDrawer}
          open={Boolean(selectedRule) || isCreateDrawerOpen}
          rule={selectedRule}
          wafId={wafId}
        />
      )}
    </div>
  );
};
