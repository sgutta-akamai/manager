import { Button, Paper, Typography } from '@linode/ui';
import * as React from 'react';

import { CreateCustomRuleDrawer } from 'src/features/Waf/WafCreate/CustomRules/CreateCustomRules/CreateCustomRuleDrawer';

import type { CreateCustomRulePayload } from '@linode/api-v4';

export const CustomRules = () => {
  const [isCreateCustomRuleDrawerOpen, setIsCreateCustomRuleDrawerOpen] =
    React.useState<boolean>(false);

  // TODO: Remove the dummy data, once BE integration is finished
  // const initialJSON = undefined;  /* If there is no initial data for Custom rule drawer. */
  const initialJSON: CreateCustomRulePayload = {
    label: 'Custom Rule #01',
    description: 'Creating custom rules',
    filters: [
      {
        match_type: 'all',
        conditions: [
          {
            field: 'Hostname',
            operator: 'matches',
            values: ['test.org'],
          },
          {
            field: 'Request body parameter',
            operator: 'equals',
            values: ['param1'],
          },
          {
            field: 'IP Address',
            operator: 'contains',
            values: ['192.168'],
          },
        ],
      },
    ],
    action: 'alert',
  };

  const handleSaveCustomRule = (formData: CreateCustomRulePayload) => {
    /* eslint-disable */
    // TODO: Remove the console log statement
    console.log('Parent received form data:', formData);
    /* eslint-enable */

    // TODO: Send to backend once integration is done
    setIsCreateCustomRuleDrawerOpen(false);
  };

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
        customRuleData={initialJSON}
        onClose={() => {
          setIsCreateCustomRuleDrawerOpen(false);
        }}
        onSubmit={handleSaveCustomRule}
        open={isCreateCustomRuleDrawerOpen}
      />
    </React.Fragment>
  );
};
