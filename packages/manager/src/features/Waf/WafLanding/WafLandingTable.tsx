import {
  CircleProgress,
  CloseIcon,
  IconButton,
  InputAdornment,
  TextField,
} from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { debounce } from 'throttle-debounce';

import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import { WafRow } from 'src/features/Waf/WafLanding/WafRow';
import { useOrder } from 'src/hooks/useOrder';

import type { WAF } from '@linode/api-v4/lib/wafs/types';

interface Props {
  wafData: WAF[];
}

export const WafLandingTable = ({ wafData }: Props) => {
  const navigate = useNavigate();
  const query = '';
  const isFetching = false;
  const { handleOrderChange, order, orderBy } = useOrder({
    order: 'asc',
    orderBy: 'label',
  });

  const resetSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        query: undefined,
      }),
      to: '/waf',
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        query: e.target.value || undefined,
      }),
      to: '/waf',
    });
  };

  return (
    <>
      <TextField
        hideLabel
        InputProps={{
          endAdornment: query && (
            <InputAdornment position="end">
              {isFetching && <CircleProgress size="sm" />}
              <IconButton aria-label="Clear" onClick={resetSearch} size="small">
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { my: 2 },
        }}
        label="Search"
        onChange={debounce(400, (e) => {
          onSearch(e);
        })}
        placeholder="Search by Configuration Name"
        value={query ?? ''}
      />

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
          {wafData?.map((waf: WAF) => <WafRow key={waf.config_id} waf={waf} />)}
        </TableBody>
      </Table>
    </>
  );
};
