import * as React from 'react';

import { WafSettingsLabel } from 'src/features/Waf/WafDetail/WafSettings/WafSettingsLabel/WafSettingsLabel';
import { WafSettingsNodebalancers } from 'src/features/Waf/WafDetail/WafSettings/WafSettingsNodebalancers/WafSettingsNodebalancers';

export const WafSettings = () => {
  return (
    <div>
      <WafSettingsLabel labelValue="waffy" />
      <WafSettingsNodebalancers />
    </div>
  );
};
