import {
  WAFAction,
  WAFDeviceType,
  WafStatus,
} from '@linode/api-v4';
import { useCreateWafMutation, useWafRuleSetQuery } from '@linode/queries';
import { Button, Notice, Stack } from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ErrorMessage } from 'src/components/ErrorMessage';
import { LandingHeader } from 'src/components/LandingHeader';
import { getTransformedHostsForPayload } from 'src/features/Waf/utils';
import { AttackProtections } from 'src/features/Waf/WafCreate/AttackProtections/AttackProtections';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { Summary } from 'src/features/Waf/WafCreate/Summary/Summary';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

import type { WAFPayload } from '@linode/api-v4';
import type { WafCreateForm } from 'src/features/Waf/utils';

const DEFAULT_FORM_VALUES: Partial<WafCreateForm> = {
  isAdjustProtectedResourcesEnabled: false,
  attackGroups: [],
};

export const WafCreate = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createWaf, isPending } = useCreateWafMutation();
  const { data: wafRuleSet } = useWafRuleSetQuery();

  const form = useForm<WafCreateForm>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onTouched',
  });

  const {
    formState: { errors },
    setError,
  } = form;

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

  const createPayload = useCallback((formData: WafCreateForm): WAFPayload => {
    const payload: WAFPayload = {
      label: formData.label,
      status: WafStatus.ENABLED, // New WAFs are 'enabled' by default
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
      if (formData.hosts && formData.hosts.length > 0) {
        payload.hosts = getTransformedHostsForPayload(formData);

        payload.advanced_settings = {
          ...payload.advanced_settings,
          host_path_exclusion_enabled: true,
        };
      }
    }

    // Only include attack groups whose action is not ALERT
    const customAttackGroups = (formData.attackGroups ?? [])
      .filter((attackGroup) => attackGroup.action !== WAFAction.ALERT)
      .map((attackGroup) => ({
        ...attackGroup,
        action: attackGroup.action as WAFAction,
      }));

    if (customAttackGroups.length) {
      payload.attack_groups = customAttackGroups;
    }

    return payload;
  }, []);

  const onSubmit = useCallback(
    async (formData: WafCreateForm) => {
      const payload = createPayload(formData);

      try {
        await createWaf(payload);
        enqueueSnackbar(`${payload.label} configuration successfully created`, {
          variant: 'success',
        });
        navigate({ to: '/waf' });
      } catch (errors) {
        for (const error of errors) {
          setError(error?.field ?? 'root', { message: error.reason });
        }
      }
    },
    [createPayload, createWaf, setError, navigate, enqueueSnackbar]
  );

  const isLabelFilled = !!form.watch('label');

  return (
    <>
      <LandingHeader
        breadcrumbProps={{
          crumbOverrides: [{ label: 'Akamai Cloud WAF', position: 1 }],
          pathname: '/waf/create',
        }}
        docsLabel="Getting Started"
        docsLink="https://techdocs.akamai.com/cloud-computing/docs/"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {errors.root?.message && (
              <Notice spacingTop={8} variant="error">
                <ErrorMessage
                  message={
                    errors.root?.message ||
                    'An internal error occurred. Try again shortly.'
                  }
                />
              </Notice>
            )}
            <WafName />
            <Nodebalancers />
            <AttackProtections />
          </Stack>
          <Summary />
          <Stack alignItems="flex-end">
            <Button
              buttonType="primary"
              disabled={!isLabelFilled || !!form.formState.errors.hosts}
              loading={isPending}
              type="submit"
            >
              Create WAF
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </>
  );
};
