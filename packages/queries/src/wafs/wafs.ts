import { getWaf, getWafs } from '@linode/api-v4';
import { getAll } from '@linode/utilities';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
  WAF,
} from '@linode/api-v4';

const getAllWafsRequest = () =>
  getAll<WAF>((passedParams, passedFilter) =>
    getWafs(passedParams, passedFilter),
  )().then((data) => data.data);

export const wafQueries = createQueryKeys('wafs', {
  waf: (id: number) => ({
    queryFn: () => getWaf(id),
    queryKey: [id],
  }),
  wafs: {
    contextQueries: {
      all: {
        queryFn: getAllWafsRequest,
        queryKey: null,
      },
      paginated: (params: Params = {}, filter: Filter = {}) => ({
        queryFn: () => getWafs(params, filter),
        queryKey: [params, filter],
      }),
    },
    queryKey: null,
  },
});

export const useWafsQuery = (params?: Params, filter?: Filter) => {
  return useQuery<ResourcePage<WAF>, APIError[]>({
    ...wafQueries.wafs._ctx.paginated(params, filter),
    placeholderData: keepPreviousData,
  });
};

export const useWafQuery = (wafId: number, enabled: boolean = true) =>
  useQuery<WAF, APIError[]>({
    ...wafQueries.waf(wafId),
    enabled,
  });

export const useAllWafsQuery = (enabled: boolean = true) =>
  useQuery<WAF[], APIError[]>({
    ...wafQueries.wafs._ctx.all,
    enabled,
  });
