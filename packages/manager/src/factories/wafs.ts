import {
  WAFAction,
  WAFDeviceType,
  WAFExclusionType,
  WafStatus,
} from '@linode/api-v4';
import { Factory } from '@linode/utilities';

import type { WAF } from '@linode/api-v4';

export const wafConfigurationsFactory = Factory.Sync.makeFactory<WAF>({
  id: Factory.each((i) => 100 + i),
  label: Factory.each((i) => `Mock WAF ${i}`),
  hosts: Factory.each((i) => [
    {
      hostname: `example${i}.com`,
      path: '/',
      exclusion_type:
        i % 2 === 0 ? WAFExclusionType.INCLUDED : WAFExclusionType.EXCLUDED,
    },
  ]),
  attack_groups: Factory.each((i) => [
    {
      attack_group_name: `SQL_INJECTION_${i}`,
      attack_group_label: `SQL Injection Protection ${i}`,
      action:
        i % 3 === 0
          ? WAFAction.DENY
          : i % 3 === 1
            ? WAFAction.ALERT
            : WAFAction.NOT_USED,
    },
    {
      attack_group_name: `XSS_${i}`,
      attack_group_label: `Cross-Site Scripting Protection ${i}`,
      action: WAFAction.ALERT,
    },
  ]),
  devices: Factory.each((i) => [
    {
      id: `${1000 + i}`,
      label: `NodeBalancer-${i + 1}`,
      type: WAFDeviceType.NODEBALANCER,
    },
  ]),
  advanced_settings: {
    custom_rules_enabled: true,
  },
  created: Factory.each((i) => `2025-0${(i % 9) + 1}-01T12:00:00Z`),
  updated: Factory.each((i) => `2025-0${(i % 9) + 1}-15T12:00:00Z`),
  status: Factory.each((i) =>
    i % 3 === 0 ? WafStatus.INACTIVE : WafStatus.ACTIVE
  ),
});
