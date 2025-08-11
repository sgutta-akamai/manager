import { WAFAction } from '@linode/api-v4';
import { useCreateCustomRuleMutation } from '@linode/queries';
import { Button } from '@linode/ui';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { CustomRuleDrawer } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRuleDrawer';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

import type { CreateCustomRulePayload } from '@linode/api-v4';

interface CustomRulesProps {
  wafId: number;
}

export const CustomRules = ({ wafId }: CustomRulesProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createCustomRule } = useCreateCustomRuleMutation(wafId);

  const handleOpenDrawer = React.useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleSubmit = React.useCallback(
    async (formData: CreateCustomRulePayload) => {
      try {
        const payload: CreateCustomRulePayload = {
          ...formData,
          action: WAFAction.ALERT,
        };

        await createCustomRule(payload);
        handleCloseDrawer();

        enqueueSnackbar('Custom rule created successfully', {
          variant: 'success',
        });
      } catch (error) {
        const errorMessage = getAPIErrorOrDefault(
          error,
          'Failed to create custom rule'
        )[0].reason;

        enqueueSnackbar(errorMessage, {
          variant: 'error',
        });
      }
    },
    [createCustomRule, handleCloseDrawer, enqueueSnackbar]
  );

  return (
    <>
      <Button buttonType="outlined" onClick={handleOpenDrawer}>
        Add custom rule
      </Button>

      <CustomRuleDrawer
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        open={isDrawerOpen}
      />
    </>
  );
};
