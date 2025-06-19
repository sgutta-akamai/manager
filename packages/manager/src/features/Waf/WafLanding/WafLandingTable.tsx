import * as React from 'react';

import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableSortCell } from 'src/components/TableSortCell';
import { WafRow } from 'src/features/Waf/WafLanding/WafRow';
import { usePagination } from 'src/hooks/usePagination';

import type { WAF } from '@linode/api-v4/lib/wafs/types';
import type { Order } from '@linode/utilities';

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
  const pagination = usePagination(1, preferenceKey);

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
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length === 0 && (
            <TableRowEmpty colSpan={6} message="No WAF found" />
          )}
          {data?.map((waf: WAF) => <WafRow key={waf.config_id} waf={waf} />)}
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
    </>
  );
};
