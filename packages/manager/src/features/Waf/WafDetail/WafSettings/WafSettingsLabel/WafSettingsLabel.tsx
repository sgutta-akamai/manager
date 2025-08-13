import { type APIError, WAF } from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { Box, Button, Paper } from '@linode/ui';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { WafCreateForm } from 'src/features/Waf/utils';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

interface WafSettingsLabelProps {
  waf: WAF;
}

export const WafSettingsLabel = ({ waf }: WafSettingsLabelProps) => {
  const labelValue = waf.label;
  const { mutate: updateWaf, isPending } = useUpdateWafMutation(waf.id);
  const methods = useForm<Pick<WafCreateForm, 'label'>>({
    defaultValues: {
      label: labelValue,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const currentValue = methods.watch('label');
  const isValueChanged = () => {
    return currentValue !== labelValue;
  };

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = errors?.[0]?.reason || 'Failed to update WAF';
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const onSubmit = useCallback(
    (data: Pick<WafCreateForm, 'label'>) => {
      updateWaf(
        {
          label: data.label,
          devices: waf.devices,
          hosts: waf.hosts,
          advanced_settings: waf.advanced_settings,
          attack_groups: waf.attack_groups,
        },
        {
          onSuccess: () => {},
          onError: handleError,
        }
      );
    },
    [updateWaf, waf, handleError]
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
