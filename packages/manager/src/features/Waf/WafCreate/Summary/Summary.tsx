// import { Box, Paper, Typography } from '@linode/ui';
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
      {/*<Paper sx={{ marginBottom: '20px' }}>*/}
      {/*  <Box display="flex" flexDirection="column">*/}
      {/*    <Typography variant="h2">Summary</Typography>*/}
      {/*    <Box display="flex" sx={{ marginTop: '20px' }}>*/}
      {/*      {isWafLabelSet && <Typography>WAF {wafLabel}</Typography>}*/}
      {/*      {isNodebalancersSet && (*/}
      {/*        <Typography>NodeBalancers Assigned</Typography>*/}
      {/*      )}*/}
      {/*      {isHostsSet && <Typography>Protected Resources Defined</Typography>}*/}
      {/*    </Box>*/}
      {/*  </Box>*/}
      {/*</Paper>*/}
      <CheckoutSummary displaySections={summaryItems} heading="Summary" />
    </div>
  );
};
