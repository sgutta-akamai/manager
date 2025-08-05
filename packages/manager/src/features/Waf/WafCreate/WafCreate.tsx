import { WAFAction, WAFDeviceType, WAFExclusionType } from '@linode/api-v4';
import { useCreateWafMutation, useWafRuleSetQuery } from '@linode/queries';
import { Box, Button } from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { LandingHeader } from 'src/components/LandingHeader';
import { AttackProtections } from 'src/features/Waf/WafCreate/AttackProtections/AttackProtections';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { Summary } from 'src/features/Waf/WafCreate/Summary/Summary';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

import type { APIError, CreateWafPayload } from '@linode/api-v4';
import type { WafCreateForm } from 'src/features/Waf/utils';

const DEFAULT_FORM_VALUES: Partial<WafCreateForm> = {
  isAdjustProtectedResourcesEnabled: false,
  attackGroups: [],
};

export const WafCreate = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: createWaf, isPending } = useCreateWafMutation();
  const { data: wafRuleSet } = useWafRuleSetQuery();

  const form = useForm<WafCreateForm>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // Transform ruleset attack groups for form usage
  const attackGroups = useMemo(() => {
    return (
      wafRuleSet?.attack_groups?.map((group) => ({
        attack_group_name: group.attack_group_name,
        attack_group_label: group.attack_group_label,
        action: WAFAction.ALERT,
      })) ?? []
    );
  }, [wafRuleSet?.attack_groups]);

  // Update form when attack groups are loaded
  useEffect(() => {
    if (attackGroups.length > 0) {
      form.reset({
        ...form.getValues(),
        attackGroups,
      });
    }
  }, [attackGroups, form]);

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = errors?.[0]?.reason || 'Failed to create WAF';
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const createPayload = useCallback(
    (formData: WafCreateForm): CreateWafPayload => {
      const payload: CreateWafPayload = {
        label: formData.label,
      };

      // Add devices if present
      if (formData.devices?.length) {
        payload.devices = formData.devices.map((device) => ({
          ...device,
          type: WAFDeviceType.NODEBALANCER,
        }));
      }

      // Add advanced settings if custom rules are enabled
      if (formData.advancedSettings?.customRulesEnabled !== undefined) {
        payload.advanced_settings = {
          custom_rules_enabled: formData.advancedSettings.customRulesEnabled,
        };
      }

      // Add hosts if protected resources are enabled
      if (formData.isAdjustProtectedResourcesEnabled) {
        const allHosts = [...(formData.hosts || []), ...(formData.paths || [])];
        if (allHosts.length > 0) {
          payload.hosts = allHosts.map((host) => ({
            ...host,
            exclusion_type: WAFExclusionType.EXCLUDED,
          }));
        }
      }

      // Add attack groups if any have non-default actions
      const hasCustomActions = formData.attackGroups?.some(
        (group) => group.action !== WAFAction.ALERT
      );
      if (hasCustomActions) {
        payload.attack_groups = formData.attackGroups!.map((group) => ({
          ...group,
          action: group.action as WAFAction,
        }));
      }

      return payload;
    },
    []
  );

  const handleSubmit = useCallback(
    (formData: WafCreateForm) => {
      const payload = createPayload(formData);

      createWaf(payload, {
        onSuccess: () => navigate({ to: '/waf' }),
        onError: handleError,
      });
    },
    [createPayload, createWaf, navigate, handleError]
  );

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
