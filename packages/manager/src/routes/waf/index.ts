import { createRoute, redirect } from '@tanstack/react-router';

import { WafRoute } from 'src/routes/waf/WafRoute';

import { rootRoute } from '../root';

const wafAction = {
  analytics: 'analytics',
  delete: 'delete',
  disable: 'disable',
  enable: 'enable',
  logs: 'logs',
  overview: 'overview',
  settings: 'settings',
} as const;

export type WafAction = (typeof wafAction)[keyof typeof wafAction];

export interface WafSearchParams {
  query?: string;
}

const wafRoute = createRoute({
  component: WafRoute,
  getParentRoute: () => rootRoute,
  path: 'waf',
});

const wafIndexRoute = createRoute({
  getParentRoute: () => wafRoute,
  path: '/',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafLandingLazyRoute));

type WafActionRouteParams<P = number | string> = {
  action: WafAction;
  wafId: P;
};

const wafActionRoute = createRoute({
  beforeLoad: async ({ params }) => {
    if (!(params.action in wafAction)) {
      throw redirect({
        search: () => ({}),
        to: '/waf',
      });
    }
  },
  getParentRoute: () => wafRoute,
  params: {
    parse: ({ action, wafId }: WafActionRouteParams<string>) => ({
      action,
      wafId: Number(wafId),
    }),
    stringify: ({ action, wafId }: WafActionRouteParams<number>) => ({
      action,
      wafId: String(wafId),
    }),
  },
  path: '$wafId/$action',
  validateSearch: (search: WafSearchParams) => search,
}).lazy(() =>
  import('src/routes/waf/wafLazyRoutes').then((m) => m.wafLandingLazyRoute)
);

const wafCreateRoute = createRoute({
  getParentRoute: () => wafRoute,
  path: 'create',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafCreateLazyRoute));

const wafDetailRoute = createRoute({
  getParentRoute: () => wafRoute,
  path: '$id',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafDetailLazyRoute));

const wafDetailIndexRoute = createRoute({
  beforeLoad: async ({ params }) => {
    throw redirect({
      params: { id: params.id },
      to: '/waf/$id/overview',
    });
  },
  getParentRoute: () => wafDetailRoute,
  path: '/',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafDetailLazyRoute));

const wafDetailOverviewRoute = createRoute({
  getParentRoute: () => wafDetailRoute,
  path: 'overview',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafDetailLazyRoute));

const wafDetailAnalyticsRoute = createRoute({
  getParentRoute: () => wafDetailRoute,
  path: 'analytics',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafDetailLazyRoute));

const wafDetailSettingsRoute = createRoute({
  getParentRoute: () => wafDetailRoute,
  path: 'settings',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafDetailLazyRoute));

const wafDetailLogsRoute = createRoute({
  getParentRoute: () => wafDetailRoute,
  path: 'logs',
}).lazy(() => import('./wafLazyRoutes').then((m) => m.wafDetailLazyRoute));

export const wafRouteTree = wafRoute.addChildren([
  wafIndexRoute.addChildren([wafActionRoute]),
  wafCreateRoute,
  wafDetailRoute.addChildren([
    wafDetailIndexRoute,
    wafDetailOverviewRoute,
    wafDetailAnalyticsRoute,
    wafDetailLogsRoute,
    wafDetailSettingsRoute,
  ]),
]);
