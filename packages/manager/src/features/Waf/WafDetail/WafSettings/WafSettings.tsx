import * as React from 'react';

import { Device, ExclusionType, Host, Path } from 'src/features/Waf/utils';
import { WafSettingsLabel } from 'src/features/Waf/WafDetail/WafSettings/WafSettingsLabel/WafSettingsLabel';
import { WafSettingsNodebalancers } from 'src/features/Waf/WafDetail/WafSettings/WafSettingsNodebalancers/WafSettingsNodebalancers';

export const WafSettings = () => {
  const mockDevices: Device[] = [
    { id: '1', label: 'NodeBalancer 1', type: 'NodeBalancer' },
    { id: '2', label: 'NodeBalancer 2', type: 'NodeBalancer' },
  ];
  const mockHosts: Host[] = [
    {
      exclusionType: ExclusionType.INCLUDED,
      hostname: 'example.com',
      path: '/',
    },
    {
      exclusionType: ExclusionType.EXCLUDED,
      hostname: 'test.com',
      path: '/test',
    },
  ];
  const mockPaths: Path[] = [
    {
      exclusionType: ExclusionType.INCLUDED,
      hostname: 'example.com',
      path: '/',
    },
    {
      exclusionType: ExclusionType.EXCLUDED,
      hostname: 'test.com',
      path: '/test',
    },
  ];

  return (
    <div>
      <WafSettingsLabel labelValue="waffy" />
      <WafSettingsNodebalancers
        devicesValue={mockDevices}
        hostsValue={mockHosts}
        isAdjustProtectedResourcesEnabledValue={false}
        pathsValue={mockPaths}
      />
    </div>
  );
};
