import { Box, Paper, Typography } from '@linode/ui';
import * as React from 'react';

import { CheckoutSummary } from 'src/components/CheckoutSummary/CheckoutSummary';

interface SummaryProps {
  isHostnamesSet: boolean;
  isNodebalancersSet: boolean;
  isWafLabelSet: boolean;
  wafLabel: string;
}

export const Summary = (props: SummaryProps) => {
  const { wafLabel, isWafLabelSet, isNodebalancersSet, isHostnamesSet } = props;

  const summaryItems = [];

  if (isWafLabelSet) {
    summaryItems.push({
      title: 'WAF',
      details: wafLabel,
    });
  }

  if (isNodebalancersSet) {
    summaryItems.push({ title: 'NodeBalancers Assigned' });
  }

  if (isHostnamesSet) {
    summaryItems.push({ title: 'Protected Resources Defined' });
  }

  return (
    <div>
      <Paper sx={{ marginBottom: '20px' }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h2">Summary</Typography>
          <Box display="flex" sx={{ marginTop: '20px' }}>
            {isWafLabelSet && <Typography>WAF {wafLabel}</Typography>}
            {isNodebalancersSet && (
              <Typography>NodeBalancers Assigned</Typography>
            )}
            {isHostnamesSet && (
              <Typography>Protected Resources Defined</Typography>
            )}
          </Box>
        </Box>
      </Paper>
      <CheckoutSummary displaySections={summaryItems} heading="Summary" />
    </div>
  );
};
