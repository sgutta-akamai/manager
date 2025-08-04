import { WAFAction } from '@linode/api-v4';
import { useCreateWafMutation } from '@linode/queries';
import { Box, Button } from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { LandingHeader } from 'src/components/LandingHeader';
import { defaultAttackGroups } from 'src/features/Waf/utils';
import { AttackProtections } from 'src/features/Waf/WafCreate/AttackProtections/AttackProtections';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { Summary } from 'src/features/Waf/WafCreate/Summary/Summary';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

import type {
  APIError,
  CreateWafPayload,
  WAFDeviceType,
  WAFExclusionType,
} from '@linode/api-v4';
import type { WafCreateForm } from 'src/features/Waf/utils';

export const WafCreate = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: createWaf, isPending } = useCreateWafMutation();

  const form = useForm<WafCreateForm>({
    defaultValues: {
      isAdjustProtectedResourcesEnabled: false,
      attackGroups: defaultAttackGroups,
    },
  });

  const handleSubmit = (formData: WafCreateForm) => {
    const payload = createPayload(formData);

    createWaf(payload, {
      onSuccess: () => navigate({ to: '/waf' }),
      onError: handleError,
    });
  };

  const handleError = (error: APIError[]) => {
    const message = error?.[0]?.reason || 'Failed to create WAF';
    enqueueSnackbar(message, { variant: 'error' });
  };

  const createPayload = (formData: WafCreateForm): CreateWafPayload => {
    const payload: CreateWafPayload = {
      label: formData.label,
      devices: formData.devices?.map((device) => ({
        ...device,
        type: 'nodebalancer' as WAFDeviceType,
      })),
    };

    if (formData.advancedSettings?.customRulesEnabled !== undefined) {
      payload.advanced_settings = {
        custom_rules_enabled: formData.advancedSettings.customRulesEnabled,
      };
    }

    if (formData.isAdjustProtectedResourcesEnabled) {
      const allHosts = [...(formData.hosts || []), ...(formData.paths || [])];
      payload.hosts = allHosts.map((host) => ({
        ...host,
        exclusion_type: 'excluded' as WAFExclusionType,
      }));
    }

    if (
      formData.attackGroups &&
      formData.attackGroups.some((group) => group.action !== WAFAction.ALERT)
    ) {
      payload.attack_groups = formData.attackGroups!.map((group) => ({
        ...group,
        action: group.action as WAFAction,
      }));
    }

    return payload;
  };

  return (
    <>
      <LandingHeader
        breadcrumbProps={{ pathname: '/waf/create' }}
        docsLabel="Getting Started"
        docsLink="https://techdocs.akamai.com/cloud-computing/docs/"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <WafName />
          <Nodebalancers />
          <AttackProtections />
          <Summary />

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button buttonType="primary" loading={isPending} type="submit">
              Create WAF
            </Button>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};
