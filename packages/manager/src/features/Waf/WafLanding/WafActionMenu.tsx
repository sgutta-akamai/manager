import { WafStatus } from '@linode/api-v4';
import * as React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';

import type { WAF } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

export interface ActionHandlers {
  handleAnalytics: () => void;
  handleDelete: () => void;
  handleLogs: () => void;
  handleOverview: () => void;
  handleSettings: () => void;
  handleStatusChange: () => void;
}

export interface Props {
  handlers: ActionHandlers;
  waf: WAF;
}

export const WafActionMenu = (props: Props) => {
  const { handlers, waf } = props;

  const isEnabled = waf?.status === WafStatus.ENABLED;

  const actions: Action[] = [
    {
      onClick: handlers.handleOverview,
      title: 'Overview',
    },
    {
      onClick: handlers.handleAnalytics,
      title: 'Analytics',
    },
    {
      onClick: handlers.handleLogs,
      title: 'Logs',
    },
    {
      onClick: handlers.handleSettings,
      title: 'Settings',
    },
    {
      onClick: handlers.handleStatusChange,
      title: isEnabled ? 'Disable' : 'Enable',
    },
    {
      onClick: handlers.handleDelete,
      title: 'Delete',
    },
  ];

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Action menu for WAF ${waf.label}`}
    />
  );
};
