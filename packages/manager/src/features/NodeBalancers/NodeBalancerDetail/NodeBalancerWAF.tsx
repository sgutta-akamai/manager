import { useWafAssociatedWithDevice } from '@linode/queries';
import { Stack, Typography } from '@linode/ui';
import { capitalize } from '@linode/utilities';
import React from 'react';

import { Link } from 'src/components/Link';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableRowError } from 'src/components/TableRowError/TableRowError';
import { TableRowLoading } from 'src/components/TableRowLoading/TableRowLoading';

interface NodeBalancerWAFProps {
  nodeBalancerId: number;
}

export const NodeBalancerWAF = (props: NodeBalancerWAFProps) => {
  const { nodeBalancerId } = props;
  const { data, error, isLoading } = useWafAssociatedWithDevice(nodeBalancerId);

  const renderTableContent = () => {
    if (isLoading) {
      return <TableRowLoading columns={2} rows={1} />;
    }

    if (error) {
      return (
        <TableRowError
          colSpan={2}
          message="Error loading WAF configurations."
        />
      );
    }

    if (!data?.id) {
      return (
        <TableRowEmpty
          colSpan={2}
          message="No WAF configurations are assigned."
        />
      );
    }

    return (
      <TableRow>
        <TableCell>
          <Link to={`/waf/${data?.id}`}>{data?.label}</Link>
        </TableCell>
        <TableCell>{capitalize(data?.status)}</TableCell>
      </TableRow>
    );
  };

  return (
    <Stack spacing={3}>
      <Typography>
        Create a WAF Configuration to protect your app against common threat
        categories.
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Configuration Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </Stack>
  );
};
