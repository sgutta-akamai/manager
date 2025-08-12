import { useWafQuery } from '@linode/queries';
import { CircleProgress, ErrorState } from '@linode/ui';
import { useParams } from '@tanstack/react-router';
import * as React from 'react';

import { WafSettingsLabel } from 'src/features/Waf/WafDetail/WafSettings/WafSettingsLabel/WafSettingsLabel';
import { WafSettingsNodebalancers } from 'src/features/Waf/WafDetail/WafSettings/WafSettingsNodebalancers/WafSettingsNodebalancers';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

export const WafSettings = () => {
  const { id } = useParams({ from: '/waf/$id/settings' });
  const { data, isLoading, error } = useWafQuery(Number(id));

  if (isLoading) return <CircleProgress />;

  if (error) {
    return (
      <ErrorState
        errorText={
          getAPIErrorOrDefault(error, 'Error loading WAF configuration.')[0]
            .reason
        }
      />
    );
  }

  if (!data) return null;

  return (
    <div>
      <WafSettingsLabel wafData={data} />
      <WafSettingsNodebalancers wafData={data} />
    </div>
  );
};
