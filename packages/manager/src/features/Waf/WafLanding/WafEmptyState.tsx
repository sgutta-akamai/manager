import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import WafIcon from 'src/assets/icons/entityIcons/security.svg';
import { ResourcesSection } from 'src/components/EmptyLandingPageResources/ResourcesSection';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import {
  gettingStartedGuides,
  headers,
  linkAnalyticsEvent,
  youtubeLinkData,
} from 'src/features/Waf/WafLanding/WafLandingEmptyStateData';
import { sendEvent } from 'src/utilities/analytics/utils';

export const WafEmptyState = () => {
  const navigate = useNavigate();

  return (
    <ResourcesSection
      buttonProps={[
        {
          children: 'Create WAF',
          onClick: () => {
            sendEvent({
              action: 'Click:button',
              category: linkAnalyticsEvent.category,
              label: 'Create WAF',
            });
            navigate({
              to: '/waf/create',
            });
          },
          tooltipText: getRestrictedResourceText({
            action: 'create',
            isSingular: false,
            resourceType: 'WAFs',
          }),
        },
      ]}
      gettingStartedGuidesData={gettingStartedGuides}
      headers={headers}
      icon={WafIcon}
      linkAnalyticsEvent={linkAnalyticsEvent}
      youtubeLinkData={youtubeLinkData}
    />
  );
};
