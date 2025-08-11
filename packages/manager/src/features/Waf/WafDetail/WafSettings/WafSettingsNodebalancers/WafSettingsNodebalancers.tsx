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

//TODO - replace with better solution
const deepEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a == null ||
    b == null
  ) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
};

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

  const currentDevices = methods.watch('devices');
  const currentHosts = methods.watch('hosts');
  const currentPaths = methods.watch('paths');
  const currentIsAdjustProtectedResourcesEnabled = methods.watch(
    'isAdjustProtectedResourcesEnabled'
  );
  const isValueChanged = () => {
    //TODO comparison is not working as expected for some edge cases. need to fix
    const currentValues = {
      devices: currentDevices,
      hosts: currentHosts,
      paths: currentPaths,
      isAdjustProtectedResourcesEnabled:
        currentIsAdjustProtectedResourcesEnabled,
    };

    const originalValues = {
      devices: devicesValue,
      hosts: hostsValue,
      paths: pathsValue,
      isAdjustProtectedResourcesEnabled: isAdjustProtectedResourcesEnabledValue,
    };

    return !deepEqual(currentValues, originalValues);
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
                disabled={!isValueChanged()}
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
