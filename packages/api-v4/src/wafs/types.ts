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

export interface Filter {
  conditions: FilterCondition[];
  match_type: string;
}

export interface CreateCustomRulePayload {
  action: string;
  description: string;
  filters: Filter[];
  label: string;
}
