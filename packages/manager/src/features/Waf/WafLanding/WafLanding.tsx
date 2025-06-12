import { CircleProgress, ErrorState } from '@linode/ui';
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
    resources: [] /*Simulating empty WAF data*/,
    // resources: [
    //   {
    //     config_id: 101,
    //     label: 'Production WAF',
    //     status: 'enabled',
    //     resources: ['host1.com', 'host2.com'],
    //     update_dt: '2025-06-10T12:00:00Z',
    //   },
    //   {
    //     config_id: 102,
    //     label: 'Staging WAF',
    //     status: 'disabled',
    //     resources: ['staging.example.com'],
    //     update_dt: '2025-06-08T08:30:00Z',
    //   },
    // ],
  };

  return { data: dummyData, isLoading, error };
};

export const WafLanding = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useWafQuery();

  const docsLink = 'https://techdocs.akamai.com/cloud-computing/docs/welcome';

  if (isLoading) {
    return <CircleProgress />;
  }

  if (data?.resources.length === 0) {
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
        //TODO: Change navigate URL to- /waf/create
        onButtonClick={() => navigate({ to: '/databases/create' })}
        title="Akamai Cloud WAF"
      />
      <WafLandingTable wafData={data?.resources} />
    </>
  );
};
