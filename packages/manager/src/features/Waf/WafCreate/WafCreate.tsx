import { Box, Button } from '@linode/ui';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { LandingHeader } from 'src/components/LandingHeader';
import { WafCreateForm } from 'src/features/Waf/utils';
import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { Summary } from 'src/features/Waf/WafCreate/Summary/Summary';
import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';

export const WafCreate = () => {
  const methods = useForm<WafCreateForm>();
  const onSubmit = (_data: any) => {
    //TODO - add proper event handler
    // console.log(data);
  };

  const labelValue = methods.watch('label') || '';
  const devicesValue = methods.watch('devices') || [];
  const hostnamesValue = methods.watch('hosts') || [];

  const isNodebalancersSet = devicesValue.length > 0;
  const isHostnamesSet = hostnamesValue.length > 0;

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
            isHostnamesSet={isHostnamesSet}
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
