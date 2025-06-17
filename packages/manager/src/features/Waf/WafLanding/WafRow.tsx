import { capitalize } from '@linode/utilities';
import * as React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';

interface WafRowProps {
  label: string;
  resources: string[];
  status: string;
  updated: string;
}

export const WafRow = (props: WafRowProps) => {
  const { label, resources, status, updated } = props;
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
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
        <DateTimeDisplay value={updated} />
      </TableCell>
    </TableRow>
  );
};
