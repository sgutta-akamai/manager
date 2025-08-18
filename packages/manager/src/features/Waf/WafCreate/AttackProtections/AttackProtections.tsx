import { Box, FormControlLabel, Paper, Toggle, Typography } from '@linode/ui';
import * as React from 'react';

import { AttackGroupsTable } from 'src/features/Waf/WafCreate/AttackProtections/AttackGroupsTable/AttackGroupsTable';

export const AttackProtections = () => {
  const [isAttackGroupsTableDisplayed, setIsAttackGroupsTableDisplayed] =
    React.useState<boolean>(false);

  return (
    <Paper>
      <Box alignItems="flex-start" display="flex" flexDirection="column">
        <Typography variant="h2">Attack Protections</Typography>
        <Typography sx={{ marginTop: '10px' }}>
          Your app will be protected against common threat categories, based on
          OWASP best practices. These protections are currently in Alert mode -
          monitoring traffic without blocking.
          <br />
          Attack Categories: injection attacks, scripting & file inclusion,
          protocol violations, abuse tools & crawlers, and known CVEs &
          exploits.
        </Typography>
        <FormControlLabel
          control={
            <Toggle
              checked={isAttackGroupsTableDisplayed}
              onChange={() =>
                setIsAttackGroupsTableDisplayed(!isAttackGroupsTableDisplayed)
              }
            />
          }
          label="View details and settings"
          sx={{ marginTop: '10px' }}
        />
        {isAttackGroupsTableDisplayed && <AttackGroupsTable />}
      </Box>
    </Paper>
  );
};
