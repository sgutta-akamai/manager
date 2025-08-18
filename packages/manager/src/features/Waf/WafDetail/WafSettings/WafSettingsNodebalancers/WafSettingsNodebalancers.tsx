import { type APIError, WAFExclusionType } from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { Button, Paper } from '@linode/ui';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
  const hostsValue = hosts.filter((host) => host.hostname !== '*');
  const pathsValue = hosts.filter((host) => host.hostname === '*');
  const isAdjustProtectedResourcesEnabledValue = hosts.length > 0;
  const methods = useForm<Partial<WafCreateForm>>({
    defaultValues: {
      devices: devicesValue,
      hosts: hostsValue,
      paths: pathsValue,
      isAdjustProtectedResourcesEnabled: isAdjustProtectedResourcesEnabledValue,
    },
  });

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = getErrorStringOrDefault(errors, 'Failed to update WAF');
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const createPayload = (data: Partial<WafCreateForm>) => {
    const getHosts = data.hosts || [];
    const getPaths = data.paths || [];
    const updatedHosts = [...getHosts, ...getPaths];

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
      payload.hosts = updatedHosts.map((host) => {
        return {
          path: host.path,
          hostname: host.hostname,
          exclusion_type: WAFExclusionType.EXCLUDED,
        } as WAFHost;
      });
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
              disabled={isPending}
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
