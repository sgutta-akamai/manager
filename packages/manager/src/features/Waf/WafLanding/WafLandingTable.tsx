// TODO: import { useWafQuery } from '@linode/queries';
import { useNavigate, useParams } from '@tanstack/react-router';
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
import { WafRow } from 'src/features/Waf/WafLanding/WafRow';
import { usePagination } from 'src/hooks/usePagination';

import type { WAF } from '@linode/api-v4/lib/wafs/types';
import type { Order } from '@linode/utilities';
import type { WafAction } from 'src/routes/waf/index';

const preferenceKey = 'wafs';

interface Props {
  data: WAF[];
  handleOrderChange: (newOrderBy: string, newOrder: Order) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  results: number | undefined;
}

export const WafLandingTable = ({
  data,
  handleOrderChange,
  order,
  orderBy,
  results,
}: Props) => {
  const navigate = useNavigate();
  const pagination = usePagination(1, preferenceKey);
  const params = useParams({ strict: false });

  // --- Mocked useWafQuery hook ---
  const useWafQuery = (wafId: number, enabled: boolean) => {
    // You can simulate loading or error conditions by toggling these values
    const isFetching = false;
    const error = null;

    const wafList = [
      {
        config_id: 101,
        label: 'Production WAF',
        status: 'active',
        resources: ['NodeBalancer-01', 'NodeBalancer-02'],
        update_dt: '2025-06-10T12:00:00Z',
      },
      {
        config_id: 102,
        label: 'Staging WAF',
        status: 'active',
        resources: ['NodeBalancer-03'],
        update_dt: '2025-06-11T08:30:00Z',
      },
      {
        config_id: 103,
        label: 'Develop WAF',
        status: 'inactive',
        resources: ['NodeBalancer-04'],
        update_dt: '2025-02-18T08:30:00Z',
      },
      {
        config_id: 104,
        label: 'UAT WAF',
        status: 'inactive',
        resources: ['NodeBalancer-05', 'NodeBalancer-06'],
        update_dt: '2025-04-22T08:30:00Z',
      },
    ];

    // Simulate fetching the WAF with the given ID
    const selectedWaf = wafList.find((waf) => waf.config_id === wafId);

    return {
      data: selectedWaf,
      isFetching,
      error,
    };
  };

  const {
    data: selectedWaf,
    isFetching: isFetchingWaf,
    error: selectedWafError,
  } = useWafQuery(Number(params.wafId), !!params.wafId);

  const navigateToWaf = () => {
    navigate({
      search: (prev) => prev,
      to: '/waf',
    });
  };

  const handleWafAction = (action: WafAction, waf: WAF) => {
    navigate({
      params: { action, wafId: waf.config_id },
      search: (prev) => prev,
      to: `/waf/$wafId/$action`,
    });
  };

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
          {data?.length === 0 && (
            <TableRowEmpty colSpan={6} message="No WAF found" />
          )}
          {data?.map((waf: WAF) => (
            <WafRow
              handlers={{
                handleAnalytics: () => handleWafAction('analytics', waf),
                handleDelete: () => handleWafAction('delete', waf),
                handleLogs: () => handleWafAction('logs', waf),
                handleOverview: () => handleWafAction('overview', waf),
                handleSettings: () => handleWafAction('settings', waf),
              }}
              key={waf.config_id}
              waf={waf}
            />
          ))}
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
        isFetching={isFetchingWaf}
        onClose={navigateToWaf}
        open={params.action === 'delete'}
        waf={selectedWaf}
        wafError={selectedWafError}
      />
    </>
  );
};
