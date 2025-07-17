import { Box, Button } from '@linode/ui';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { LandingHeader } from 'src/components/LandingHeader';
import { WafCreateForm, WafCreateFormDTO } from 'src/features/Waf/utils';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { Summary } from 'src/features/Waf/WafCreate/Summary/Summary';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

export const WafCreate = () => {
  const methods = useForm<WafCreateForm>();
  const onSubmit = (_data: WafCreateForm) => {
    //TODO - add proper event handler
    // console.log(data);
    getTransformedData(_data);
  };

  const labelValue = methods.watch('label') || '';
  const devicesValue = methods.watch('devices') || [];
  const hostnamesValue = methods.watch('hosts') || [];
  const pathsValue = methods.watch('paths') || [];

  const isNodebalancersSet = devicesValue.length > 0;
  const isHostsSet = hostnamesValue.length > 0 || pathsValue.length > 0;

  const getTransformedData = (formData: WafCreateForm): WafCreateFormDTO => {
    return {
      label: formData.label,
      attack_groups: formData.attackGroups,
      devices: formData.devices,
      hosts: [...(formData.hosts || []), ...(formData.paths || [])],
      advanced_settings: {
        custom_rules_enabled: formData.advancedSettings?.customRulesEnabled,
      },
    };
  };

  return (
    <div>
      <LandingHeader
        breadcrumbProps={{
          pathname: `/waf/create`,
        }}
        docsLabel="Getting Started"
        docsLink="https://techdocs.akamai.com/cloud-computing/docs/" //TODO - add correct link once available
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <WafName />
          <Nodebalancers />
          <Summary
            isHostsSet={isHostsSet}
            isNodebalancersSet={isNodebalancersSet}
            isWafLabelSet={!!labelValue}
            wafLabel={labelValue}
          />
          {JSON.stringify(methods.getValues())}
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Button buttonType="primary" type="submit">
              Create WAF
            </Button>
          </Box>
        </form>
      </FormProvider>
    </div>
  );
};
