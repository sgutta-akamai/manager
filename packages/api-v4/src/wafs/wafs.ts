import { API_ROOT } from '../constants';
import Request, {
  setData,
  setMethod,
  setParams,
  setURL,
  setXFilter,
} from '../request';

import type { Filter, Params, ResourcePage } from '../types';
import type { CreateWafPayload, WAF, WAFDevice, WAFRuleSet } from './types';

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

/**
 * createWaf
 *
 * Create a new WAF configuration.
 */
export const createWaf = (data: CreateWafPayload) =>
  Request<WAF>(
    setURL(`${API_ROOT}/waf-configs`),
    setMethod('POST'),
    setData(data),
  );

/**
 * updateWaf
 *
 * Update an existing WAF configuration.
 */

export const updateWaf = (wafId: number, data: CreateWafPayload) =>
  Request<WAF>(
    setURL(`${API_ROOT}/waf-configs/${encodeURIComponent(wafId)}`),
    setMethod('PUT'),
    setData(data),
  );

/**
 * deleteWaf
 *
 * Delete a WAF configuration.
 */
export const deleteWaf = (wafId: number) =>
  Request<object>(
    setURL(`${API_ROOT}/waf-configs/${encodeURIComponent(wafId)}`),
    setMethod('DELETE'),
  );

/**
 * getAvailableWafDevices
 *
 * Return a paginated list of available devices for WAF.
 */
export const getAvailableWafDevices = (params?: Params, filter?: Filter) =>
  Request<ResourcePage<WAFDevice>>(
    setURL(`${API_ROOT}/waf-configs/devices`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filter),
  );

/**
 * getWafRuleSet
 *
 * Get the WAF ruleset.
 */
export const getWafRuleSet = () =>
  Request<WAFRuleSet>(
    setURL(`${API_ROOT}/waf-configs/rule-set`),
    setMethod('GET'),
  );
