import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableSortCell } from 'src/components/TableSortCell';
import { DeleteWafDialog } from 'src/features/Waf/Dialogs/DeleteWafDialog';
import { WafStatusDialog } from 'src/features/Waf/Dialogs/WafStatusDialog';
import { WafRow } from 'src/features/Waf/WafLanding/WafRow';
import { usePaginationV2 } from 'src/hooks/usePaginationV2';

import type { WAF } from '@linode/api-v4';
import type { Order } from '@linode/utilities';
import type { WafAction } from 'src/routes/waf';

interface Props {
  data: WAF[];
  handleOrderChange: (newOrderBy: string, newOrder: Order) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  results: number;
}

export const WafLandingTable = ({
  data,
  handleOrderChange,
  order,
  orderBy,
  results,
}: Props) => {
  const navigate = useNavigate();

  const pagination = usePaginationV2({
    currentRoute: '/waf',
    preferenceKey: 'waf-table',
  });

  // Track selected WAF for delete dialog
  const [selectedWafForDelete, setSelectedWafForDelete] = React.useState<WAF>();

  const closeDeleteDialog = () => {
    setSelectedWafForDelete(undefined);
  };

  // Track selected WAF for status dialog
  const [selectedWafStatus, setSelectedWafStatus] = React.useState<WAF>();

  const closeStatusDialog = () => {
    setSelectedWafStatus(undefined);
  };

  const handleWafAction = React.useCallback(
    (action: WafAction, waf: WAF) => {
      if (action === 'delete') {
        setSelectedWafForDelete(waf);
        return;
      }

      // Navigate to other actions (analytics, logs, overview, settings)
      navigate({
        params: { action, wafId: waf.id },
        search: (prev) => prev,
        to: `/waf/$wafId/$action`,
      });
    },
    [navigate, setSelectedWafForDelete]
  );

  const handleWafStatusChange = React.useCallback(
    (waf: WAF) => {
      setSelectedWafStatus(waf);
    },
    [setSelectedWafStatus]
  );

  return (
    <>
      <Table aria-label="List of WAF Configurations">
        <TableHead>
          <TableRow>
            <TableSortCell
              active={orderBy === 'label'}
              direction={order}
              handleClick={handleOrderChange}
              label="label"
              sx={{ width: '40%' }}
            >
              Configuration Name
            </TableSortCell>
            <TableCell sx={{ width: '15%' }}>Status</TableCell>
            <TableCell sx={{ width: '25%' }}>NodeBalancers</TableCell>
            <TableCell sx={{ width: '20%' }}>Last Updated</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRowEmpty colSpan={5} message="No WAF configurations found" />
          ) : (
            data.map((waf) => (
              <WafRow
                handlers={{
                  handleAnalytics: () => handleWafAction('analytics', waf),
                  handleDelete: () => handleWafAction('delete', waf),
                  handleLogs: () => handleWafAction('logs', waf),
                  handleOverview: () => handleWafAction('overview', waf),
                  handleSettings: () => handleWafAction('settings', waf),
                  handleStatusChange: () => handleWafStatusChange(waf),
                }}
                key={waf.id}
                waf={waf}
              />
            ))
          )}
        </TableBody>
      </Table>

      <PaginationFooter
        count={results || 0}
        eventCategory="WAF Configuration Table"
        handlePageChange={pagination.handlePageChange}
        handleSizeChange={pagination.handlePageSizeChange}
        page={pagination.page}
        pageSize={pagination.pageSize}
      />

      <DeleteWafDialog
        onClose={closeDeleteDialog}
        open={!!selectedWafForDelete}
        waf={selectedWafForDelete}
      />

      <WafStatusDialog
        onClose={closeStatusDialog}
        open={!!selectedWafStatus}
        waf={selectedWafStatus}
      />
    </>
  );
};
