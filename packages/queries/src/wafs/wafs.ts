import {
  createWaf,
  deleteWaf,
  getAvailableWafDevices,
  getWaf,
  getWafRuleSet,
  getWafs,
  updateWaf,
} from '@linode/api-v4';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  APIError,
  CreateWafPayload,
  Filter,
  Params,
  ResourcePage,
  WAF,
  WAFDevice,
  WAFRuleSet,
} from '@linode/api-v4';

export const wafQueries = createQueryKeys('wafs', {
  waf: (id: number) => ({
    queryFn: () => getWaf(id),
    queryKey: [id],
  }),
  paginated: (params: Params = {}, filter: Filter = {}) => ({
    queryFn: () => getWafs(params, filter),
    queryKey: [params, filter],
  }),
  availableDevices: (filter: Filter = {}) => ({
    queryFn: ({ pageParam }) =>
      getAvailableWafDevices(
        { page: pageParam as number, page_size: 25 },
        filter,
      ),
    queryKey: [filter],
  }),
  wafRuleSet: {
    queryFn: () => getWafRuleSet(),
    queryKey: null,
  },
});

export const useWafsQuery = (params?: Params, filter?: Filter) => {
  return useQuery<ResourcePage<WAF>, APIError[]>({
    ...wafQueries.paginated(params, filter),
    placeholderData: keepPreviousData,
  });
};

export const useWafQuery = (wafId: number) =>
  useQuery<WAF, APIError[]>({
    ...wafQueries.waf(wafId),
  });

export const useCreateWafMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<WAF, APIError[], CreateWafPayload>({
    mutationFn: createWaf,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.paginated._def,
      });
    },
  });
};

export const useUpdateWafMutation = (wafId: number) => {
  const queryClient = useQueryClient();

  return useMutation<WAF, APIError[], CreateWafPayload>({
    mutationFn: (data) => updateWaf(wafId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.paginated._def,
      });
    },
  });
};

export const useDeleteWafMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<object, APIError[], number>({
    mutationFn: deleteWaf,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.paginated._def,
      });
    },
  });
};

export const useAvailableWafDevicesInfiniteQuery = (
  filter: Filter = {},
  enabled = true,
) => {
  return useInfiniteQuery<ResourcePage<WAFDevice>, APIError[]>({
    ...wafQueries.availableDevices(filter),
    enabled,
    getNextPageParam: ({ page, pages }) => {
      if (page === pages) {
        return undefined;
      }
      return page + 1;
    },
    initialPageParam: 1,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useWafRuleSetQuery = () =>
  useQuery<WAFRuleSet, APIError[]>({
    ...wafQueries.wafRuleSet,
  });
