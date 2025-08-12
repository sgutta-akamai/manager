import {
  type APIError,
  CreateWafPayload,
  WAF,
  WAFDevice,
  WAFExclusionType,
  WAFHost,
} from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { Box, Button, Paper } from '@linode/ui';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { WafCreateForm } from 'src/features/Waf/utils';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';

interface WafSettingsNodebalancersProps {
  wafData: WAF;
}

export const WafSettingsNodebalancers = (
  props: WafSettingsNodebalancersProps
) => {
  const { wafData } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: updateWaf, isPending } = useUpdateWafMutation(
    props.wafData.id
  );

  const devicesValue: WAFDevice[] = wafData.devices || [];
  const hosts: WAFHost[] = wafData.hosts || [];
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

  const handleSuccess = () => {};
  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = errors?.[0]?.reason || 'Failed to update WAF';
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const createPayload = (data: Partial<WafCreateForm>) => {
    const getHosts = data.hosts || [];
    const getPaths = data.paths || [];
    const updatedHosts = [...getHosts, ...getPaths];

    const payload: CreateWafPayload = {
      label: wafData.label,
      advanced_settings: wafData.advanced_settings,
      attack_groups: wafData.attack_groups,
    };

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

    return payload;
  };

  const onSubmit = useCallback(
    (data: Partial<WafCreateForm>) => {
      updateWaf(createPayload(data), {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    },
    [updateWaf, props.wafData, handleSuccess, handleError]
  );

  //TODO - implement deep equality check for form values to disable save button
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper>
            <Nodebalancers />
            <Box display="flex" flexDirection="row">
              <Button
                buttonType="primary"
                disabled={isPending}
                loading={isPending}
                sx={{ marginLeft: '16px' }}
                type="submit"
              >
                Save
              </Button>
            </Box>
          </Paper>
        </form>
      </FormProvider>
    </div>
  );
};
