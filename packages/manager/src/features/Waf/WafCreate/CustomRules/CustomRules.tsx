import { Button, Paper, Typography } from '@linode/ui';
import * as React from 'react';

import { CreateCustomRuleDrawer } from 'src/features/Waf/WafCreate/CustomRules/CreateCustomRules/CreateCustomRuleDrawer';

export const CustomRules = () => {
  const [isCreateCustomRuleDrawerOpen, setIsCreateCustomRuleDrawerOpen] =
    React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Paper>
        <Typography marginBottom={2} variant="h2">
          Custom rules
        </Typography>

        <Button
          buttonType="outlined"
          onClick={() => {
            setIsCreateCustomRuleDrawerOpen(true);
          }}
        >
          Create custom rule
        </Button>
      </Paper>

      <CreateCustomRuleDrawer
        onClose={() => {
          setIsCreateCustomRuleDrawerOpen(false);
        }}
        open={isCreateCustomRuleDrawerOpen}
      />
    </React.Fragment>
  );
};
