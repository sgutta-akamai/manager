import { capitalize } from '@linode/utilities';
import * as React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { Link } from 'src/components/Link';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';

import type { WAF } from '@linode/api-v4/lib/wafs/types';

interface Props {
  waf: WAF;
}

export const WafRow = ({ waf }: Props) => {
  const { config_id, label, resources, status, update_dt } = waf;
  return (
    <TableRow>
      <TableCell>
        <Link to={`/waf/${config_id}`}>{label}</Link>
      </TableCell>
      <TableCell statusCell>
        <StatusIcon status={status === 'active' ? 'active' : 'inactive'} />
        {capitalize(status)}
      </TableCell>
      <TableCell>
        {resources.map((resource, index) => (
          <React.Fragment key={index}>
            {resource}
            {index !== resources.length - 1 && ' | '}
          </React.Fragment>
        ))}
      </TableCell>
      <TableCell>
        <DateTimeDisplay value={update_dt} />
      </TableCell>
    </TableRow>
  );
};
