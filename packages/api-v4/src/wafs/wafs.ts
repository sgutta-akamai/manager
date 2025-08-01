import { API_ROOT } from '../constants';
import Request, { setMethod, setParams, setURL, setXFilter } from '../request';

import type { Filter, Params, ResourcePage } from '../types';
import type { WAF } from './types';

/**
 * getWafs
 *
 * Return a paginated list of WAF configurations on this account.
 */
export const getWafs = (params?: Params, filter?: Filter) =>
  Request<ResourcePage<WAF>>(
    setURL(`${API_ROOT}/waf-configs`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filter),
  );

/**
 * getWaf
 *
 * Get a specific WAF configuration.
 */
export const getWaf = (wafId: number) =>
  Request<WAF>(
    setMethod('GET'),
    setURL(`${API_ROOT}/waf-configs/${encodeURIComponent(wafId)}`),
  );
