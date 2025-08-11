import { Button } from '@linode/ui';
import * as React from 'react';

import { CustomRuleDrawer } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRuleDrawer';

import type { WAFCustomRule } from '@linode/api-v4';

export const CustomRules = () => {
  const [isCreateCustomRuleDrawerOpen, setIsCreateCustomRuleDrawerOpen] =
    React.useState<boolean>(false);

  const handleSaveCustomRule = (formData: WAFCustomRule) => {
    /* eslint-disable */
    // TODO: Remove the console log statement
    console.log('Parent received form data:', formData);
    /* eslint-enable */

    // TODO: Send to backend once integration is done
    setIsCreateCustomRuleDrawerOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        buttonType="outlined"
        onClick={() => {
          setIsCreateCustomRuleDrawerOpen(true);
        }}
      >
        Add custom rule
      </Button>

      <CustomRuleDrawer
        onClose={() => {
          setIsCreateCustomRuleDrawerOpen(false);
        }}
        onSubmit={handleSaveCustomRule}
        open={isCreateCustomRuleDrawerOpen}
      />
    </React.Fragment>
  );
};
