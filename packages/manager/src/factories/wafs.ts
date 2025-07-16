import { Factory } from '@linode/utilities';

import type { WAF } from '@linode/api-v4/lib/wafs/types';

export const wafConfigurationsFactory = Factory.Sync.makeFactory<WAF>({
  config_id: Factory.each((i) => 100 + i),
  label: Factory.each((i) => `Mock WAF ${i}`),
  status: Factory.each((i) => (i < 8 ? 'active' : 'inactive')),
  resources: Factory.each((i) => [
    `NodeBalancer-${i + 1}`,
    `NodeBalancer-${i + 2}`,
  ]),
  update_dt: '2025-07-09T12:00:00Z',
});
