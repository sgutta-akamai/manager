import { useWafsQuery } from '@linode/queries';
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
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

import type { Filter } from '@linode/api-v4';
import type { WafSearchParams } from 'src/routes/waf';

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

  const {
    data: wafs,
    error,
    isFetching,
    isLoading,
  } = useWafsQuery(
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

  if (wafs?.data.length === 0) {
    return <WafEmptyState />;
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
        data={wafs?.data || []}
        handleOrderChange={handleOrderChange}
        order={order}
        orderBy={orderBy}
        results={wafs?.results || 0}
      />
    </>
  );
};
