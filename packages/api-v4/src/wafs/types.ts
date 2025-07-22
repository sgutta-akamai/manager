export interface WAF {
  config_id: number;
  label: string;
  resources: string[];
  status: string;
  update_dt: string;
}

export interface FilterCondition {
  field: string;
  operator: string;
  values: string[];
}

export interface FilterType {
  conditions: FilterCondition[];
  match_type: string;
}

export interface CreateCustomRulePayload {
  action: string;
  description: string;
  filters: FilterType[];
  label: string;
}
