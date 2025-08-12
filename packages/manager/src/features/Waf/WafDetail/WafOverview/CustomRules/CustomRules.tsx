import { Box, Button } from '@linode/ui';
import * as React from 'react';

import { CustomRulesTable } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRulesTable';

interface CustomRulesProps {
  wafId: number;
}

export const CustomRules = ({ wafId }: CustomRulesProps) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  return (
    <>
      <CustomRulesTable
        isCreateDrawerOpen={isCreateDrawerOpen}
        onCloseCreateDrawer={() => setIsCreateDrawerOpen(false)}
        wafId={wafId}
      />
      <Box marginTop={2}>
        <Button
          buttonType="outlined"
          onClick={() => setIsCreateDrawerOpen(true)}
        >
          Add custom rule
        </Button>
      </Box>
    </>
  );
};
