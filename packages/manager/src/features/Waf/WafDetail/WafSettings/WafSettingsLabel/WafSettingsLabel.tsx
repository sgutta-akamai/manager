import { Box, Button, Paper } from '@linode/ui';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { WafCreateForm } from 'src/features/Waf/utils';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

interface WafSettingsLabelProps {
  labelValue: string;
}

export const WafSettingsLabel = (props: WafSettingsLabelProps) => {
  const { labelValue } = props;
  const methods = useForm<Pick<WafCreateForm, 'label'>>({
    defaultValues: {
      label: labelValue,
    },
  });

  const onSubmit = (_data: Pick<WafCreateForm, 'label'>) => {
    //TODO - add event handler
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper>
            <WafName />
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button buttonType="primary" type="submit">
                Save
              </Button>
            </Box>
          </Paper>
        </form>
      </FormProvider>
    </div>
  );
};
