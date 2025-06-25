import { Box, Button, Paper, Stack, Typography } from '@linode/ui';
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';

import type { Theme } from '@mui/material/styles';

const useStyles = makeStyles()((theme: Theme) => ({
  enableBackupsButton: {
    ...theme.applyLinkStyles,
    fontSize: '0.875rem',
  },
}));

export const WafOverview = () => {
  const { classes } = useStyles();

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
            <button
              className={classes.enableBackupsButton}
              onClick={() => 'Protections Learn more clicked!'}
            >
              Learn more
            </button>
          </Typography>
        </Stack>
      </Paper>

      <Paper>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Typography variant="h2"> Custom rules </Typography>
          <Box>
            <Button buttonType="outlined" onClick={() => 'Manage clicked!'}>
              Manage
            </Button>
          </Box>
        </Box>

        <Stack mt={1}>
          <Typography variant="body1">
            Use custom rules to protect against specific traffic patterns. To
            activate a custom rule, add it to a Security Policy. &nbsp;
            <button
              className={classes.enableBackupsButton}
              onClick={() => 'Custom Rule Learn more clicked!'}
            >
              Learn more
            </button>
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
