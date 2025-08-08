import { Box, Button, Paper } from '@linode/ui';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Device, Host, Path, WafCreateForm } from 'src/features/Waf/utils';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';

interface WafSettingsNodebalancersProps {
  devicesValue: Device[];
  hostsValue: Host[];
  isAdjustProtectedResourcesEnabledValue: boolean;
  pathsValue: Path[];
}

export const WafSettingsNodebalancers = (
  props: WafSettingsNodebalancersProps
) => {
  const {
    devicesValue,
    hostsValue,
    pathsValue,
    isAdjustProtectedResourcesEnabledValue,
  } = props;
  const methods = useForm<Partial<WafCreateForm>>({
    defaultValues: {
      devices: devicesValue,
      hosts: hostsValue,
      paths: pathsValue,
      isAdjustProtectedResourcesEnabled: isAdjustProtectedResourcesEnabledValue,
    },
  });

  const onSubmit = (_data: Partial<WafCreateForm>) => {
    // console.log(_data)
  };

  const {
    formState: { isDirty },
  } = methods;
  const currentDevices = methods.watch('devices');
  const currentHosts = methods.watch('hosts');
  const currentPaths = methods.watch('paths');
  const currentIsAdjustProtectedResourcesEnabled = methods.watch(
    'isAdjustProtectedResourcesEnabled'
  );
  const isValueChanged = () => {
    //comparison does not work as expected because of array and object types. Need something similar to lodash isEqual
    return (
      currentDevices !== devicesValue ||
      currentHosts !== hostsValue ||
      currentPaths !== pathsValue ||
      currentIsAdjustProtectedResourcesEnabled !==
        isAdjustProtectedResourcesEnabledValue
    );
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper>
            <Nodebalancers />
            <Box display="flex" flexDirection="row">
              <Button
                buttonType="primary"
                disabled={!isDirty || !isValueChanged()}
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
