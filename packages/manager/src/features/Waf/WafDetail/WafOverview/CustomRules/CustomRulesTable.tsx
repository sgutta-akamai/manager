import { WAFAction, type WAFCustomRule } from '@linode/api-v4';
import { useWafCustomRulesQuery } from '@linode/queries';
import { Box, Paper, Select } from '@linode/ui';
import { styled } from '@mui/material/styles';
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

  const handleActionChange = (index: number, newAction: WAFAction) => {
    // TODO: Implement action update functionality
  };

  const handleRuleDelete = (ruleId: number, ruleLabel: string) => {
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
                customRules.map((rule, index) => (
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
                          rule.action
                            ? {
                                label: ACTION_LABELS[rule.action],
                                value: rule.action,
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
                ))
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
