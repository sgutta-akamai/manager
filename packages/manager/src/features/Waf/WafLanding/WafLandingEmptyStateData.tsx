// TODO: Add all the relevant redirection links, & currently this page serves only as a placeholder (with empty links).

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
    'Safeguard your web applications and APIs with Akamai’s Cloud Protector service - delivering robust Layer 7 protection, seamless integration with Cloud Manager, and a strong foundation for your cloud security strategy.',
  subtitle: 'Essential Layer 7 Firewall',
  title: 'Akamai Cloud WAF',
};

export const gettingStartedGuides: ResourcesLinkSection = {
  links: [
    {
      text: 'Overview of Akamai-Powered WAF',
      to: '',
    },
    {
      text: 'Linode WAF Security Quick Start',
      to: '',
    },
    {
      text: 'Monitor and Tune App Protections',
      to: '',
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
      to: '',
    },
    {
      external: true,
      text: 'How to Protect Your Applications',
      to: '',
    },
    {
      external: true,
      text: 'WAF Customization and Monitoring',
      to: '',
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
