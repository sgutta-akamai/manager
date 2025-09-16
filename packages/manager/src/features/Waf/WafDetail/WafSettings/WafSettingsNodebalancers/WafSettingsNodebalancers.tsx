import { type APIError } from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { Button, Paper } from '@linode/ui';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { getTransformedHostsForPayload } from 'src/features/Waf/utils';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

import type { WAF, WAFDevice, WAFHost, WAFPayload } from '@linode/api-v4';
import type { WafCreateForm } from 'src/features/Waf/utils';

interface WafSettingsNodebalancersProps {
  waf: WAF;
}

export const WafSettingsNodebalancers = ({
  waf,
}: WafSettingsNodebalancersProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: updateWaf, isPending } = useUpdateWafMutation();

  const devicesValue: WAFDevice[] = waf.devices || [];
  const hosts: WAFHost[] = waf.hosts || [];
  const isAdjustProtectedResourcesEnabledValue = hosts.length > 0;

  // transform backend data into format required by the form
  const getInitialFormValues = (hosts: WAFHost[]) => {
    const hostnamePathMap: Map<string, Array<string>> = new Map();
    hosts.forEach((host: WAFHost) => {
      if (hostnamePathMap.has(host.hostname)) {
        hostnamePathMap.set(host.hostname, [
          ...(hostnamePathMap.get(host.hostname) || []),
          host.path,
        ]);
      } else {
        hostnamePathMap.set(host.hostname, [host.path]);
      }
    });

    const initialFormValues: Array<{ hostname: string[]; paths: string[] }> =
      [];
    Array.from(hostnamePathMap.keys()).forEach((hostname) => {
      initialFormValues.push({
        hostname: [hostname],
        paths: hostnamePathMap.get(hostname) || [],
      });
    });

    return initialFormValues;
  };

  const methods = useForm<Partial<WafCreateForm>>({
    defaultValues: {
      devices: devicesValue,
      hosts: getInitialFormValues(hosts),
      isAdjustProtectedResourcesEnabled: isAdjustProtectedResourcesEnabledValue,
    },
  });
  const { isDirty } = methods.formState;

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = getErrorStringOrDefault(errors, 'Failed to update WAF');
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const createPayload = (data: Partial<WafCreateForm>) => {
    const payload: WAFPayload = {
      label: waf.label,
      attack_groups: waf.attack_groups,
    };

    if (waf.advanced_settings) {
      payload.advanced_settings = { ...waf.advanced_settings };
    }

    if (data?.devices?.length) {
      payload.devices = data.devices;
    }

    if (data.isAdjustProtectedResourcesEnabled) {
      if (data.hosts && data.hosts.length > 0) {
        payload.hosts = getTransformedHostsForPayload(data);
        payload.advanced_settings = {
          ...payload.advanced_settings,
          host_path_exclusion_enabled: true,
        };
      }
    }

    if (payload.hosts && payload.hosts.length > 0) {
      payload.advanced_settings = {
        ...waf.advanced_settings,
        host_path_exclusion_enabled: true,
      };
    }

    return payload;
  };

  const onSubmit = useCallback(
    (data: Partial<WafCreateForm>) => {
      updateWaf(
        { wafId: waf.id, data: createPayload(data) },
        {
          onSuccess: () => {},
          onError: handleError,
        }
      );
    },
    [updateWaf, waf, handleError]
  );

  // TODO - implement deep equality check for form values to disable save button
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Nodebalancers />
          <Paper>
            <Button
              buttonType="primary"
              disabled={
                !isDirty || isPending || !!methods.formState.errors.hosts
              }
              loading={isPending}
              type="submit"
            >
              Save
            </Button>
          </Paper>
        </form>
      </FormProvider>
    </div>
  );
};
