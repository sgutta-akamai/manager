import { useWafQuery } from '@linode/queries';
import {
  Box,
  CircleProgress,
  ErrorState,
  Paper,
  Stack,
  Typography,
} from '@linode/ui';
import { useParams } from '@tanstack/react-router';
import React from 'react';

import { Link } from 'src/components/Link';
import { CustomRules } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRules';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

export const WafOverview = () => {
  const { id } = useParams({ from: '/waf/$id/overview' });
  const { data, isLoading, error } = useWafQuery(Number(id));

  if (isLoading) return <CircleProgress />;

  if (error) {
    return (
      <ErrorState
        errorText={
          getAPIErrorOrDefault(error, 'Error loading WAF configuration.')[0]
            .reason
        }
      />
    );
  }

  if (!data) return null;

  const hasHosts = data.hosts && data.hosts.length > 0;
  const hasDevices = data.devices && data.devices.length > 0;

  return (
    <Stack spacing={2}>
      {/* Summary Section */}
      <Paper>
        <Typography variant="subtitle1">Summary</Typography>
        <Typography variant="h2">Protection active</Typography>

        {hasHosts && (
          <Box alignItems="center" display="flex" gap={1} marginTop={2}>
            <Typography variant="subtitle1">Excluded:</Typography>
            <Typography color="textSecondary" variant="body1">
              {data.hosts!.map((host) => host.hostname).join(' | ')}
            </Typography>
          </Box>
        )}

        {hasDevices && (
          <Box alignItems="center" display="flex" gap={1}>
            <Typography variant="subtitle1">NodeBalancers:</Typography>
            <Typography color="textSecondary" variant="body1">
              {data.devices!.map((device, index) => (
                <React.Fragment key={device.id}>
                  <Link to={`/nodebalancers/${device.id}`}>{device.label}</Link>
                  {index < data.devices!.length - 1 && ' | '}
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Protections Section */}
      <Paper>
        <Typography variant="h2">Protections</Typography>
        <Stack mt={1}>
          <Typography variant="body1">
            Specify how your web application firewall responds to traffic by
            setting actions for attack groups. These are sets of firewall rules
            that work together to identify and mitigate related attack types.
            Review and update these settings regularly to stay protected against
            evolving attack patterns.
            {/*// TODO: Add the relevant redirection link for 'Learn more', once available. */}
            <Link to="">Learn more</Link>
          </Typography>
        </Stack>
      </Paper>

      {/* Custom Rules Section */}
      <Paper>
        <Typography variant="h2">Custom rules</Typography>
        <Stack mb={4} mt={1}>
          <Typography variant="body1">
            Use custom rules to handle scenarios not covered by standard
            firewall rules or to quickly patch new website vulnerabilities.
            {/*// TODO: Add the relevant redirection link for 'Learn more', once available. */}
            <Link to="">Learn more</Link>
          </Typography>
        </Stack>
        <CustomRules wafId={Number(id)} />
      </Paper>
    </Stack>
  );
};
