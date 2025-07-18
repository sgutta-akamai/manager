import * as React from 'react';

import { CheckoutSummary } from 'src/components/CheckoutSummary/CheckoutSummary';

interface SummaryProps {
  isHostsSet: boolean;
  isNodebalancersSet: boolean;
  isWafLabelSet: boolean;
  wafLabel: string;
}

export const Summary = (props: SummaryProps) => {
  const { wafLabel, isWafLabelSet, isNodebalancersSet, isHostsSet } = props;

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
      details: wafLabel,
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

  return (
    <div>
      <CheckoutSummary displaySections={summaryItems} heading="Summary" />
    </div>
  );
};
