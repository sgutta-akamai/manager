import { useWafCustomRulesQuery, useWafMetadataQuery } from '@linode/queries';
import { Box, Button } from '@linode/ui';
import { CircleProgress, Notice } from '@linode/ui';
import * as React from 'react';

import { CustomRulesTable } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRulesTable';

interface CustomRulesProps {
  isEnabled: boolean;
  wafId: number;
}

export const CustomRules = ({ isEnabled, wafId }: CustomRulesProps) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const { data: customRulesData, isLoading: isLoadingCustomRules } =
    useWafCustomRulesQuery(wafId);
  const { data: wafMetadata, isLoading: isLoadingMetadata } =
    useWafMetadataQuery();

  const rulesLimit = wafMetadata?.custom_rules_limit ?? 10;
  const rulesLimitReached = (customRulesData?.data?.length ?? 0) >= rulesLimit;

  if (isLoadingCustomRules || isLoadingMetadata) {
    return <CircleProgress />;
  }

  return (
    <>
      {rulesLimitReached && (
        <Notice
          text={`You have reached the limit of ${rulesLimit} custom rules.`}
          variant="warning"
        />
      )}
      <CustomRulesTable
        isCreateDrawerOpen={isCreateDrawerOpen}
        isEnabled={isEnabled}
        onCloseCreateDrawer={() => setIsCreateDrawerOpen(false)}
        wafId={wafId}
      />
      <Box marginTop={2}>
        <Button
          buttonType="outlined"
          disabled={rulesLimitReached || !isEnabled}
          onClick={() => setIsCreateDrawerOpen(true)}
        >
          Add custom rule
        </Button>
      </Box>
    </>
  );
};
