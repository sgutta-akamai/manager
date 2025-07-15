import { Box, Paper, Stack, Typography } from '@linode/ui';
import * as React from 'react';

import { Link } from 'src/components/Link';

export const WafOverview = () => {
  return (
    <Stack spacing={2}>
      <Paper>
        <Typography variant="subtitle1"> Summary </Typography>
        <Typography variant="h2"> Protection active </Typography>

        <Box alignItems="center" display="flex" gap={1} marginTop={2}>
          <Typography variant="subtitle1"> Excluded: </Typography>
          <Typography color="textSecondary" variant="body1">
            www.exampleHostname.com
          </Typography>
        </Box>

        <Box alignItems="center" display="flex" gap={1}>
          <Typography variant="subtitle1"> NodeBalancers: </Typography>
          <Typography color="textSecondary" variant="body1">
            {/*// TODO: Add the relevant re-direction link for the NodeBalancers' page. */}
            <Link to="">NBalancer-01</Link>
          </Typography>
        </Box>
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
