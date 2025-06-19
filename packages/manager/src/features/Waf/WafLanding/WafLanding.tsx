import {
  CircleProgress,
  CloseIcon,
  ErrorState,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@linode/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import * as React from 'react';
import { debounce } from 'throttle-debounce';

import { LandingHeader } from 'src/components/LandingHeader';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import { WafEmptyState } from 'src/features/Waf/WafLanding/WafEmptyState';
import { WafLandingTable } from 'src/features/Waf/WafLanding/WafLandingTable';
import { useOrderV2 } from 'src/hooks/useOrderV2';
import { usePaginationV2 } from 'src/hooks/usePaginationV2';
// TODO: import { useWafQuery } from 'src/queries/wafs/wafs';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

import type { Filter } from '@linode/api-v4';
import type { WafSearchParams } from 'src/routes/waf';

// --- Mocked useWafQuery hook ---
const useWafQuery = (pagination: {}, filter: Filter) => {
  const isLoading = false;
  const error = undefined;
  const isFetching = true;

  const dummyData = {
    // waf_configs: [] /*Simulating empty WAF data*/,
    waf_configs: [
      {
        config_id: 101,
        label: 'Production WAF',
        status: 'active',
        resources: ['NodeBalancer-01', 'NodeBalancer-02'],
        update_dt: '2025-06-10T12:00:00Z',
      },
      {
        config_id: 102,
        label: 'Staging WAF',
        status: 'active',
        resources: ['NodeBalancer-03'],
        update_dt: '2025-06-11T08:30:00Z',
      },
      {
        config_id: 103,
        label: 'Develop WAF',
        status: 'inactive',
        resources: ['NodeBalancer-04'],
        update_dt: '2025-02-18T08:30:00Z',
      },
      {
        config_id: 104,
        label: 'UAT WAF',
        status: 'inactive',
        resources: ['NodeBalancer-05', 'NodeBalancer-06'],
        update_dt: '2025-04-22T08:30:00Z',
      },
    ],
    results: 4,
  };

  return { data: dummyData, error, isFetching, isLoading };
};

const preferenceKey = 'wafs';

export const WafLanding = () => {
  const navigate = useNavigate();
  const search: WafSearchParams = useSearch({
    from: '/waf',
  });
  const pagination = usePaginationV2({
    currentRoute: '/waf',
    preferenceKey,
    searchParams: (prev) => ({
      ...prev,
      query: search.query,
    }),
  });

  const { query } = search;

  const {
    handleOrderChange: handleOrderChange,
    order: order,
    orderBy: orderBy,
  } = useOrderV2({
    initialRoute: {
      defaultOrder: {
        order: 'desc',
        orderBy: 'label',
      },
      from: '/waf',
    },
    preferenceKey: `${preferenceKey}-order`,
  });

  const filter: Filter = {
    ['+order']: order,
    ['+order_by']: orderBy,
    ...(query && {
      label: { '+contains': query },
    }),
  };

  const { data, error, isFetching, isLoading } = useWafQuery(
    {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
    filter
  );

  // TODO: Update the relevant docsLink, currently this serves as a placeholder
  const docsLink = '';

  const resetSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        query: undefined,
      }),
      to: '/waf',
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        query: e.target.value || undefined,
      }),
      to: '/waf',
    });
  };

  if (isLoading) {
    return <CircleProgress />;
  }

  if (data?.waf_configs.length === 0) {
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
        onButtonClick={() => navigate({ to: '/waf/create' })}
        title="Akamai Cloud WAF"
      />
      <Typography variant="h3"> WAF Configurations </Typography>
      <TextField
        hideLabel
        InputProps={{
          endAdornment: query && (
            <InputAdornment position="end">
              {isFetching && <CircleProgress size="sm" />}
              <IconButton aria-label="Clear" onClick={resetSearch} size="small">
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { my: 2 },
        }}
        label="Search"
        onChange={debounce(400, (e) => {
          onSearch(e);
        })}
        placeholder="Search by Configuration Name"
        value={query ?? ''}
      />
      <WafLandingTable
        data={data?.waf_configs}
        handleOrderChange={handleOrderChange}
        order={order}
        orderBy={orderBy}
        results={data?.results}
      />
    </>
  );
};
