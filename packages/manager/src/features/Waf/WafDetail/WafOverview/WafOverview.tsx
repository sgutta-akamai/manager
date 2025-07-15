import {
  Box,
  CircleProgress,
  ErrorState,
  Paper,
  Stack,
  Typography,
} from '@linode/ui';
import { useParams } from '@tanstack/react-router';
import * as React from 'react';

import { Link } from 'src/components/Link';
// TODO: import { useWafOverviewQuery } from 'src/queries/wafs/wafs';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

// --- Mocked useWafOverviewQuery hook ---
const useWafOverviewQuery = (id: string) => {
  const isLoading = false;
  const error = undefined;

  const dummyData = {
    id,
    hosts: [
      { hostname: 'www.exampleHostname1.com', path: '/', type: 'exclusion' },
      { hostname: 'www.exampleHostname2.com', path: '/', type: 'exclusion' },
      { hostname: 'www.exampleHostname3.com', path: '/', type: 'exclusion' },
    ],
    devices: [
      { id: '146442', label: 'NBalancer-01', type: 'NODEBALANCER' },
      { id: '224663', label: 'NBalancer-02', type: 'NODEBALANCER' },
      { id: '376453', label: 'NBalancer-03', type: 'NODEBALANCER' },
    ],
  };

  return { data: dummyData, error, isLoading };
};

export const WafOverview = () => {
  const { id } = useParams({
    from: '/waf/$id/overview',
  });

  const { data, isLoading, error } = useWafOverviewQuery(id);

  if (isLoading) {
    return <CircleProgress />;
  }

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

  return (
    <Stack spacing={2}>
      <Paper>
        <Typography variant="subtitle1"> Summary </Typography>
        <Typography variant="h2"> Protection active </Typography>

        {data?.hosts?.length > 0 && (
          <Box alignItems="center" display="flex" gap={1} marginTop={2}>
            <Typography variant="subtitle1"> Excluded: </Typography>
            <Typography color="textSecondary" variant="body1">
              {data.hosts.map((host) => host.hostname).join(' | ')}
            </Typography>
          </Box>
        )}

        {data?.devices?.length > 0 && (
          <Box alignItems="center" display="flex" gap={1}>
            <Typography variant="subtitle1"> NodeBalancers: </Typography>
            <Typography color="textSecondary" variant="body1">
              {data.devices.map((device, index) => (
                <React.Fragment key={device.id}>
                  <Link to={`/nodebalancers/${device.id}`}>
                    {' '}
                    {device.label}{' '}
                  </Link>
                  {index < data.devices.length - 1 && ' | '}
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        )}
      </Paper>

      <Paper>
        <Typography variant="h2"> Protections </Typography>
        <Stack mt={1}>
          <Typography variant="body1">
            Specify how your web application firewall responds to traffic by
            setting actions for attack groups. These are sets of firewall rules
            that work together to identify and mitigate related attack types.
            Review and update these settings regularly to stay protected against
            evolving attack patterns. &nbsp;
            {/*// TODO: Add the relevant redirection link for 'Learn more', once available. */}
            <Link to="">Learn more</Link>
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
