import { CircleProgress, ErrorState, Typography } from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { LandingHeader } from 'src/components/LandingHeader';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import { WafEmptyState } from 'src/features/Waf/WafLanding/WafEmptyState';
import { WafLandingTable } from 'src/features/Waf/WafLanding/WafLandingTable';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

// --- Mocked useWafQuery hook ---
const useWafQuery = () => {
  const isLoading = false;
  const error = undefined;

  const dummyData = {
    // waf_configs: [] /*Simulating empty WAF data*/,
    waf_configs: [
      {
        config_id: 101,
        label: 'Production WAF',
        status: 'active',
        resources: ['NodeBalancer-01', 'NodeBalancer-02'],
        update_dt: '2025-06-10T12:00:00Z',
      },
      {
        config_id: 102,
        label: 'Staging WAF',
        status: 'active',
        resources: ['NodeBalancer-03'],
        update_dt: '2025-06-11T08:30:00Z',
      },
      {
        config_id: 103,
        label: 'Develop WAF',
        status: 'inactive',
        resources: ['NodeBalancer-04'],
        update_dt: '2025-02-18T08:30:00Z',
      },
      {
        config_id: 104,
        label: 'UAT WAF',
        status: 'inactive',
        resources: ['NodeBalancer-05', 'NodeBalancer-06'],
        update_dt: '2025-04-22T08:30:00Z',
      },
    ],
  };

  return { data: dummyData, isLoading, error };
};

export const WafLanding = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useWafQuery();

  // TODO: Update the relevant docsLink, currently this serves as a placeholder
  const docsLink = '';

  if (isLoading) {
    return <CircleProgress />;
  }

  if (data?.waf_configs.length === 0) {
    return (
      <>
        <WafEmptyState />
      </>
    );
  }

  if (error) {
    return (
      <ErrorState
        errorText={
          getAPIErrorOrDefault(error, 'Error loading WAF configurations.')[0]
            .reason
        }
      />
    );
  }

  return (
    <>
      <LandingHeader
        breadcrumbProps={{ pathname: '/waf' }}
        buttonDataAttrs={{
          tooltipText: getRestrictedResourceText({
            action: 'create',
            isSingular: false,
            resourceType: 'WAFs',
          }),
        }}
        createButtonText="Create WAF configuration"
        docsLink={docsLink}
        onButtonClick={() => navigate({ to: '/waf/create' })}
        title="Akamai Cloud WAF"
      />
      <Typography variant="h3"> WAF Configurations </Typography>
      <WafLandingTable wafData={data?.waf_configs} />
    </>
  );
};
