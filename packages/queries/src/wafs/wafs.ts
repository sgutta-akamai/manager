import {
  createCustomRule,
  createWaf,
  deleteCustomRule,
  deleteWaf,
  getAvailableWafDevices,
  getWaf,
  getWafCustomRules,
  getWafMetadata,
  getWafRuleSet,
  getWafs,
  updateCustomRule,
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
  Filter,
  Params,
  ResourcePage,
  WAF,
  WAFCustomRule,
  WAFDevice,
  WAFMetadata,
  WafPayload,
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
  metadata: {
    queryFn: () => getWafMetadata(),
    queryKey: null,
  },
  customRules: (wafId: number, filter: Filter = {}) => ({
    queryFn: () => getWafCustomRules(wafId, {}, filter),
    queryKey: [wafId, 'custom-rules', filter],
  }),
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

  return useMutation<WAF, APIError[], WafPayload>({
    mutationFn: createWaf,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.paginated._def,
      });
    },
  });
};

export const useUpdateWafMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<WAF, APIError[], { data: WafPayload; wafId: number }>({
    mutationFn: ({ wafId, data }) => updateWaf(wafId, data),
    onSuccess: (updatedWaf) => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.paginated._def,
      });
      queryClient.setQueryData(
        wafQueries.waf(updatedWaf.id).queryKey,
        updatedWaf,
      );
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

export const useWafMetadataQuery = () =>
  useQuery<WAFMetadata, APIError[]>({
    ...wafQueries.metadata,
  });

export const useWafCustomRulesQuery = (
  wafId: number,
  filter?: Filter,
  enabled = true,
) => {
  return useQuery<ResourcePage<WAFCustomRule>, APIError[]>({
    ...wafQueries.customRules(wafId, filter),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useCreateCustomRuleMutation = (wafId: number) => {
  const queryClient = useQueryClient();

  return useMutation<WAFCustomRule, APIError[], WAFCustomRule>({
    mutationFn: (data) => createCustomRule(wafId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.customRules._def,
      });
    },
  });
};

export const useUpdateCustomRuleMutation = (wafId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    WAFCustomRule,
    APIError[],
    { data: WAFCustomRule; ruleId: number }
  >({
    mutationFn: ({ ruleId, data }) => updateCustomRule(wafId, ruleId, data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.customRules._def,
      });
    },
  });
};

export const useDeleteCustomRuleMutation = (wafId: number) => {
  const queryClient = useQueryClient();

  return useMutation<object, APIError[], { ruleId: number }>({
    mutationFn: ({ ruleId }) => deleteCustomRule(wafId, ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wafQueries.customRules._def,
      });
    },
  });
};
