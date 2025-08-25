import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { CheckoutSummary } from 'src/components/CheckoutSummary/CheckoutSummary';
import { WafCreateForm } from 'src/features/Waf/utils';

export const Summary = () => {
  const { watch } = useFormContext<WafCreateForm>();

  const labelValue = watch('label') || '';
  const devicesValue = watch('devices') || [];
  const hostnamesValue = watch('hosts') || [];
  const pathsValue = watch('paths') || [];
  const isAdjustProtectedResourcesEnabled = watch(
    'isAdjustProtectedResourcesEnabled'
  );

  const isWafLabelSet = !!labelValue;
  const isNodebalancersSet = devicesValue.length > 0;
  const isHostsSet =
    (hostnamesValue.length > 0 || pathsValue.length > 0) &&
    isAdjustProtectedResourcesEnabled;

  //add a placeholder item to ensure there is no zero state with the "Linode" text in the CheckoutSummary component
  const summaryItems = [{ title: '', details: '' }];
  const removePlaceholderItem = () => {
    if (summaryItems.length === 1 && summaryItems[0].title === '') {
      summaryItems.pop();
    }
  };

  if (isWafLabelSet) {
    removePlaceholderItem();
    summaryItems.push({
      title: 'WAF',
      details: labelValue,
    });
  }

  if (isNodebalancersSet) {
    removePlaceholderItem();
    summaryItems.push({ title: 'NodeBalancers Assigned', details: '' });
  }

  if (isHostsSet) {
    removePlaceholderItem();
    summaryItems.push({ title: 'Protected Resources Defined', details: '' });
  }

  return <CheckoutSummary displaySections={summaryItems} heading="Summary" />;
};
