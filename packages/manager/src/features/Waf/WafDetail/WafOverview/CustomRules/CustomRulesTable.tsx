import { type WAFCustomRule } from '@linode/api-v4';
import {
  useDeleteCustomRuleMutation,
  useUpdateCustomRuleMutation,
  useWafCustomRulesQuery,
} from '@linode/queries';
import { Box, Paper, Select } from '@linode/ui';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableRowLoading } from 'src/components/TableRowLoading/TableRowLoading';
import { TableSortCell } from 'src/components/TableSortCell';
import { WAF_ACTION_LABELS, WAF_ACTION_OPTIONS } from 'src/features/Waf/utils';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

import { CustomRuleDrawer } from './CustomRuleDrawer';

import type { WAFAction } from '@linode/api-v4';

const StyledCustomRuleLabel = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

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
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [selectedRule, setSelectedRule] = React.useState<null | WAFCustomRule>(
    null
  );
  const [optimisticUpdates, setOptimisticUpdates] = React.useState<
    Record<number, WAFAction>
  >({});
  const [deletingRuleId, setDeletingRuleId] = React.useState<null | number>(
    null
  );

  // Hooks
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: customRulesData,
    isLoading,
    refetch,
  } = useWafCustomRulesQuery(wafId);
  const updateCustomRuleMutation = useUpdateCustomRuleMutation(wafId);
  const deleteCustomRuleMutation = useDeleteCustomRuleMutation(wafId);

  // Computed values
  const customRules = React.useMemo(() => {
    const rules = customRulesData?.data || [];
    return [...rules].sort((a, b) =>
      sortOrder === 'asc'
        ? a.label.localeCompare(b.label)
        : b.label.localeCompare(a.label)
    );
  }, [customRulesData?.data, sortOrder]);

  // Event handlers
  const handleSort = () =>
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const handleCloseDrawer = () => {
    setSelectedRule(null);
    onCloseCreateDrawer?.();
    refetch();
  };

  const handleActionChange = (index: number, newAction: WAFAction) => {
    const rule = customRules[index];
    if (!rule?.id) {
      enqueueSnackbar('Unable to update rule: Rule ID not found', {
        variant: 'error',
      });
      return;
    }

    // Update local state for immediate UI feedback
    setOptimisticUpdates((prev) => ({ ...prev, [index]: newAction }));

    updateCustomRuleMutation.mutate(
      { ruleId: rule.id, data: { ...rule, action: newAction } },
      {
        onSuccess: () => {
          enqueueSnackbar(`Rule "${rule.label}" action updated successfully`, {
            variant: 'success',
          });
        },
        onError: (error) => {
          const errorMessage = getErrorStringOrDefault(
            error,
            'Failed to update rule action'
          );
          enqueueSnackbar(errorMessage, { variant: 'error' });
          setOptimisticUpdates((prev) => ({
            ...prev,
            [index]: rule.action,
          }));
        },
      }
    );
  };

  const handleRuleDelete = (ruleId: number, ruleLabel: string) => {
    setDeletingRuleId(ruleId);
    deleteCustomRuleMutation.mutate(
      { ruleId },
      {
        onSuccess: () => {
          enqueueSnackbar(`Rule "${ruleLabel}" deleted successfully`, {
            variant: 'success',
          });
          setDeletingRuleId(null);
          refetch();
        },
        onError: (error) => {
          const errorMessage = getErrorStringOrDefault(
            error,
            'Failed to delete rule'
          );
          enqueueSnackbar(errorMessage, { variant: 'error' });
          setDeletingRuleId(null);
        },
      }
    );
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
                  const currentAction = optimisticUpdates[index] ?? rule.action;
                  const isDeleting = deletingRuleId === rule.id;

                  return (
                    <TableRow
                      key={rule.id || `${rule.label}-${index}`}
                      sx={{ opacity: isDeleting ? 0.5 : 1 }}
                    >
                      <TableCell>
                        <StyledCustomRuleLabel
                          onClick={() => !isDeleting && setSelectedRule(rule)}
                          style={{
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {rule.label}
                        </StyledCustomRuleLabel>
                      </TableCell>
                      <TableCell>
                        <Select
                          disabled={isDeleting}
                          hideLabel={true}
                          label="action"
                          onChange={(e, selected) => {
                            if (selected && !isDeleting) {
                              handleActionChange(
                                index,
                                selected.value as WAFAction
                              );
                            }
                          }}
                          options={WAF_ACTION_OPTIONS}
                          value={
                            currentAction
                              ? {
                                  label: WAF_ACTION_LABELS[currentAction],
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
                                !isDeleting &&
                                handleRuleDelete(rule.id!, rule.label),
                              disabled: isDeleting,
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
