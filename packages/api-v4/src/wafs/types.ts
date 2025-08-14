export enum WAFExclusionType {
  EXCLUDED = 'excluded',
  INCLUDED = 'included',
}

export enum WAFAction {
  ALERT = 'alert',
  DENY = 'deny',
  NOT_USED = 'not_used',
}

export enum WAFDeviceType {
  NODEBALANCER = 'nodebalancer',
}

export interface WAFHost {
  exclusion_type: WAFExclusionType;
  hostname: string;
  path: string;
}

export interface WAFAttackGroup {
  action: WAFAction;
  attack_group_label: string;
  attack_group_name: string;
}

export interface WAFDevice {
  id: string;
  label: string;
  type: WAFDeviceType;
}

export interface WAFAdvancedSettings {
  custom_rules_enabled?: boolean;
  host_path_exclusion_enabled?: boolean;
}

export enum WafStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  INACTIVE = 'inactive',
}

export interface WAF {
  advanced_settings?: WAFAdvancedSettings;
  attack_groups?: WAFAttackGroup[];
  created: string;
  devices?: WAFDevice[];
  hosts?: WAFHost[];
  id: number;
  label: string;
  status: WafStatus;
  updated: string;
}

export interface WAFPayload {
  advanced_settings?: WAFAdvancedSettings;
  attack_groups?: WAFAttackGroup[];
  devices?: WAFDevice[];
  hosts?: WAFHost[];
  label: string;
}

export interface WAFRuleSetAttackGroup {
  action?: WAFAction;
  attack_group_label: string;
  attack_group_name: string;
}

export interface WAFRuleSet {
  attack_groups: WAFRuleSetAttackGroup[];
  created: string;
  created_by: string;
  min_software_version: string;
  notes: string;
  status: string;
  updated: string;
  updated_by: string;
}

export interface WAFCustomRuleOption {
  label: string;
  value: string;
}

export interface WAFCustomRulesMetadata {
  condition_field: WAFCustomRuleOption[];
  condition_operator: WAFCustomRuleOption[];
  match_type: WAFCustomRuleOption[];
}

export interface WAFMetadata {
  custom_rules: WAFCustomRulesMetadata;
  custom_rules_limit: number;
}

export interface WAFCustomRuleCondition {
  field: string;
  operator: string;
  values: string[];
}

export interface WAFCustomRuleFilters {
  conditions: WAFCustomRuleCondition[];
  match_type: string;
}

export interface WAFCustomRule {
  action: WAFAction;
  description: string;
  filters: WAFCustomRuleFilters;
  id?: number;
  label: string;
}
