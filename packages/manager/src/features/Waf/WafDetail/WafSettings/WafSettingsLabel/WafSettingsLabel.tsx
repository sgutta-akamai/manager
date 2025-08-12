import { WAF } from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { Box, Button, Paper } from '@linode/ui';
import * as React from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { WafCreateForm } from 'src/features/Waf/utils';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

interface WafSettingsLabelProps {
  wafData: WAF;
}

export const WafSettingsLabel = (props: WafSettingsLabelProps) => {
  const labelValue = props.wafData.label;
  const { mutate: updateWaf, isPending } = useUpdateWafMutation(
    props.wafData.id
  );

  const methods = useForm<Pick<WafCreateForm, 'label'>>({
    defaultValues: {
      label: labelValue,
    },
  });

  const currentValue = methods.watch('label');

  const isValueChanged = () => {
    return currentValue !== labelValue;
  };

  const handleError = () => {};

  const handleSuccess = () => {};

  const onSubmit = useCallback(
    (data: Pick<WafCreateForm, 'label'>) => {
      updateWaf(
        {
          label: data.label,
          devices: props.wafData.devices,
          hosts: props.wafData.hosts,
          advanced_settings: props.wafData.advanced_settings,
          attack_groups: props.wafData.attack_groups,
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      );
    },
    [updateWaf, props.wafData, handleSuccess, handleError]
  );

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper>
            <WafName />
            <Box display="flex" flexDirection="row">
              <Button
                buttonType="primary"
                disabled={!isValueChanged() || isPending}
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
