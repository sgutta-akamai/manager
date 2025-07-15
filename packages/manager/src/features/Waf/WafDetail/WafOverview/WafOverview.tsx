import { Box, Paper, Stack, Typography } from '@linode/ui';
import * as React from 'react';

import { Link } from 'src/components/Link';

export const WafOverview = () => {
  return (
    <Stack spacing={2}>
      <Paper>
        <Typography variant="subtitle1"> Summary </Typography>
        <Typography variant="h2"> All resources protected </Typography>

        <Box alignItems="center" display="flex" gap={1} marginTop={2}>
          <Typography variant="subtitle1"> Excluded: </Typography>
          <Typography color="textSecondary" variant="body1">
            www.exampleHostname.com
          </Typography>
        </Box>

        <Box alignItems="center" display="flex" gap={1}>
          <Typography variant="subtitle1"> NodeBalancers: </Typography>
          <Typography color="textSecondary" variant="body1">
            NBalancer-01 | NBalancer-02 | NBalancer-03
          </Typography>
        </Box>
      </Paper>

      <Paper>
        <Typography variant="h2"> Protections </Typography>
        <Stack mt={1}>
          <Typography variant="body1">
            When you apply web application firewall protections as part of your
            security policy, the policy uses rules to examine specific requests
            and determine what, if any, action to take. <br />
            {/*// TODO: Add the relevant redirection link for 'Learn more', once available. */}
            <Link to="">Learn more</Link>
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
