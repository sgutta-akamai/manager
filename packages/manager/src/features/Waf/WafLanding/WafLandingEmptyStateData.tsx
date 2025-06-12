import {
  docsLink,
  guidesMoreLinkText,
  youtubeChannelLink,
  youtubeMoreLinkText,
} from 'src/utilities/emptyStateLandingUtils';

import type {
  ResourcesHeaders,
  ResourcesLinks,
  ResourcesLinkSection,
} from 'src/components/EmptyLandingPageResources/ResourcesLinksTypes';

export const headers: ResourcesHeaders = {
  description:
    'Safeguard your web applications and APIs with Akamai’s Cloud Protector service - delivering robust Layer 7 protection, seamless integration with Linode Cloud Manager, and a strong foundation for your cloud security strategy.',
  subtitle: 'Essential Layer 7 Setup',
  title: 'Akamai Cloud WAF',
};

export const gettingStartedGuides: ResourcesLinkSection = {
  links: [
    {
      text: 'Overview of Akamai-Powered WAF',
      to: 'https://techdocs.akamai.com/cloud-computing/docs/aiven-database-clusters',
    },
    {
      text: 'Linode WAF Security Quick Start',
      to: 'https://techdocs.akamai.com/cloud-computing/docs/get-started-new-clusters',
    },
    {
      text: 'Monitor and Tune App Protections',
      to: 'https://techdocs.akamai.com/cloud-computing/docs/aiven-database-engines',
    },
  ],
  moreInfo: {
    text: guidesMoreLinkText,
    to: docsLink,
  },
  title: 'Getting Started Guides',
};

export const youtubeLinkData: ResourcesLinkSection = {
  links: [
    {
      external: true,
      text: 'Introduction to Linode WAF',
      to: 'https://www.youtube.com/watch?v=loEVtzUN2i8',
    },
    {
      external: true,
      text: 'How to Protect Your Applications',
      to: 'https://www.youtube.com/watch?v=dnV-6TtfYfY',
    },
    {
      external: true,
      text: 'WAF Customization and Monitoring',
      to: 'https://www.youtube.com/playlist?list=PLTnRtjQN5ieZl3kM_jqfnK98uqYeXbfmC',
    },
  ],
  moreInfo: {
    text: youtubeMoreLinkText,
    to: youtubeChannelLink,
  },
  title: 'Video Playlist',
};

export const linkAnalyticsEvent: ResourcesLinks['linkAnalyticsEvent'] = {
  action: 'Click:link',
  category: 'Akamai Cloud WAF landing page empty',
};
