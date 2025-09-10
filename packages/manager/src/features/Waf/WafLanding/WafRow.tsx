import { getFormattedStatus } from '@linode/utilities';
import * as React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { Link } from 'src/components/Link';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { getWafStatusIcon } from 'src/features/Waf/utils';

import { WafActionMenu } from './WafActionMenu';

import type { ActionHandlers } from './WafActionMenu';
import type { WAF } from '@linode/api-v4';

interface Props {
  handlers: ActionHandlers;
  waf: WAF;
}

export const WafRow = (props: Props) => {
  const { handlers, waf } = props;

  return (
    <TableRow>
      <TableCell>
        <Link to={`/waf/${waf.id}`}>{waf.label}</Link>
      </TableCell>
      <TableCell statusCell>
        <StatusIcon status={getWafStatusIcon(waf.status)} />
        {getFormattedStatus(waf.status)}
      </TableCell>
      <TableCell>
        {waf.devices && waf.devices.length > 0
          ? waf.devices.map((device, index) => (
              <React.Fragment key={device.id}>
                {device.label}
                {index < (waf.devices?.length ?? 0) - 1 && ' | '}
              </React.Fragment>
            ))
          : '-'}
      </TableCell>
      <TableCell>
        <DateTimeDisplay value={waf.updated} />
      </TableCell>
      <TableCell actionCell>
        <WafActionMenu handlers={handlers} waf={waf} />
      </TableCell>
    </TableRow>
  );
};
