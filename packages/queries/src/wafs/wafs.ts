import { createWaf, deleteWaf, getWaf, getWafs } from '@linode/api-v4';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  keepPreviousData,
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
