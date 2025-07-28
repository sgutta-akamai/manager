import { Box, Button } from '@linode/ui';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { LandingHeader } from 'src/components/LandingHeader';
import { WafCreateForm, WafCreateFormDTO } from 'src/features/Waf/utils';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { Summary } from 'src/features/Waf/WafCreate/Summary/Summary';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

export const WafCreate = () => {
  const methods = useForm<WafCreateForm>({
    defaultValues: {
      isAdjustProtectedResourcesEnabled: false,
    },
  });
  const onSubmit = (data: WafCreateForm) => {
    //TODO - add proper event handler
    // console.log(data);
    getTransformedData(data);
  };

  const getTransformedData = (formData: WafCreateForm): WafCreateFormDTO => {
    const excludedHosts = formData.hosts || [];
    const excludedPaths = formData.paths || [];

    return {
      label: formData.label,
      attack_groups: formData.attackGroups,
      devices: formData.devices,
      advanced_settings: {
        custom_rules_enabled: formData.advancedSettings?.customRulesEnabled,
      },
      ...(formData.isAdjustProtectedResourcesEnabled && {
        hosts: [...excludedHosts, ...excludedPaths],
      }),
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
          <Summary />
          {/*for debugging form values TODO - remove later once integrated with attack groups table and backend*/}
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
