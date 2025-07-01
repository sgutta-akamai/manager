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

export interface CreateCustomRulePayload {
  action: string;
  criteria: string;
  description: string;
  filters: FilterCondition[];
  label: string;
}
