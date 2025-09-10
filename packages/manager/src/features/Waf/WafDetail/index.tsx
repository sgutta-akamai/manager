import { type APIError } from '@linode/api-v4';
import { useUpdateWafMutation, useWafQuery } from '@linode/queries';
import { CircleProgress, ErrorState, Typography } from '@linode/ui';
import { getFormattedStatus } from '@linode/utilities';
import { Paper, Stack, useTheme } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback } from 'react';

import { LandingHeader } from 'src/components/LandingHeader';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { SuspenseLoader } from 'src/components/SuspenseLoader';
import { SafeTabPanel } from 'src/components/Tabs/SafeTabPanel';
import { TabPanels } from 'src/components/Tabs/TabPanels';
import { Tabs } from 'src/components/Tabs/Tabs';
import { TanStackTabLinkList } from 'src/components/Tabs/TanStackTabLinkList';
import { getWafStatusIcon } from 'src/features/Waf/utils';
import { useTabs } from 'src/hooks/useTabs';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

const WafOverview = React.lazy(() =>
  import('./WafOverview/WafOverview').then((module) => ({
    default: module.WafOverview,
  }))
);

const WafAnalytics = React.lazy(() =>
  import('./WafAnalytics/WafAnalytics').then((module) => ({
    default: module.WafAnalytics,
  }))
);

const WafLogs = React.lazy(() =>
  import('./WafLogs/WafLogs').then((module) => ({
    default: module.WafLogs,
  }))
);

const WafSettings = React.lazy(() =>
  import('./WafSettings/WafSettings').then((module) => ({
    default: module.WafSettings,
  }))
);

export const WafDetail = () => {
  const theme = useTheme();
  const { id } = useParams({
    strict: false,
  });
  const { mutate: updateWaf } = useUpdateWafMutation();
  const { enqueueSnackbar } = useSnackbar();

  const { handleTabChange, tabIndex, tabs } = useTabs([
    {
      title: 'Overview',
      to: '/waf/$id/overview',
    },
    {
      title: 'Analytics',
      to: '/waf/$id/analytics',
    },
    {
      title: 'Logs',
      to: '/waf/$id/logs',
    },
    {
      title: 'Settings',
      to: '/waf/$id/settings',
    },
  ]);

  const { data: waf, isLoading, error } = useWafQuery(Number(id));

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = getErrorStringOrDefault(
        errors,
        'Failed to update WAF label'
      );
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  if (isLoading) {
    return <CircleProgress />;
  }

  if (error) {
    return (
      <ErrorState errorText="There was an error retrieving your WAF configuration. Please reload and try again." />
    );
  }

  if (!waf) {
    return null;
  }

  const handleLabelChange = (newLabel: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      updateWaf(
        {
          wafId: waf.id,
          data: {
            label: newLabel,
            devices: waf.devices,
            hosts: waf.hosts,
            advanced_settings: waf.advanced_settings,
            attack_groups: waf.attack_groups,
          },
        },
        {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            handleError(error);
            reject(error);
          },
        }
      );
    });
  };

  const resetEditableLabel = (): Promise<string> => {
    return Promise.resolve(waf.label);
  };

  return (
    <React.Fragment>
      <LandingHeader
        breadcrumbProps={{
          crumbOverrides: [{ label: 'WAF', position: 1 }],
          onEditHandlers: {
            editableTextTitle: waf?.label,
            onCancel: resetEditableLabel,
            onEdit: handleLabelChange,
          },
          // TODO - add onEditHandler when integrating with backend
          pathname: `/waf/${waf.label}`,
        }}
        docsLabel="Getting Started"
        docsLink="https://techdocs.akamai.com/cloud-computing/docs/" // TODO - add correct link once available
        // TODO - add AI assistance feature once more clarity is available
        title={waf.label}
      />
      <Paper>
        <Stack alignItems="center" direction="row" p={1}>
          <StatusIcon status={getWafStatusIcon(waf.status)} />
          <Typography sx={{ font: theme.font.bold }}>
            {getFormattedStatus(waf.status)}
          </Typography>
        </Stack>
      </Paper>
      <Tabs index={tabIndex} onChange={handleTabChange}>
        <TanStackTabLinkList tabs={tabs} />
        <React.Suspense fallback={<SuspenseLoader />}>
          <TabPanels>
            <SafeTabPanel index={0}>
              <WafOverview />
            </SafeTabPanel>
            <SafeTabPanel index={1}>
              <WafAnalytics />
            </SafeTabPanel>
            <SafeTabPanel index={2}>
              <WafLogs />
            </SafeTabPanel>
            <SafeTabPanel index={3}>
              <WafSettings />
            </SafeTabPanel>
          </TabPanels>
        </React.Suspense>
      </Tabs>
    </React.Fragment>
  );
};
