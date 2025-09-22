import { type APIError, WAF } from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { Button, Paper } from '@linode/ui';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { WafCreateForm } from 'src/features/Waf/utils';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

interface WafSettingsLabelProps {
  waf: WAF;
}

export const WafSettingsLabel = ({ waf }: WafSettingsLabelProps) => {
  const labelValue = waf.label;
  const { mutate: updateWaf, isPending } = useUpdateWafMutation();
  const methods = useForm<Pick<WafCreateForm, 'label'>>({
    defaultValues: {
      label: labelValue,
    },
  });
  const { isDirty } = methods.formState;
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = getErrorStringOrDefault(
        errors,
        'Failed to update WAF label'
      );
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const onSubmit = useCallback(
    (data: Pick<WafCreateForm, 'label'>) => {
      updateWaf(
        {
          wafId: waf.id,
          data: {
            label: data.label,
            status: waf.status,
            devices: waf.devices,
            hosts: waf.hosts,
            advanced_settings: waf.advanced_settings,
            attack_groups: waf.attack_groups,
          },
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
          <WafName />
          <Paper>
            <Button
              buttonType="primary"
              disabled={!isDirty || isPending}
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
