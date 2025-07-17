export interface WafCreateForm {
  advancedSettings?: {
    customRulesEnabled?: boolean;
  };
  attackGroups?: AttackGroup[];
  devices?: Device[];
  hosts?: Host[];
  label: string;
  paths?: Host[];
}

export interface WafCreateFormDTO {
  advanced_settings?: {
    custom_rules_enabled?: boolean;
  };
  attack_groups?: AttackGroup[];
  devices?: Device[];
  hosts?: Host[];
  label: string;
}

export interface AttackGroup {
  action: string;
  attackGroupName: string;
}

export interface Device {
  id: string;
  label: string;
  type: string;
}

export interface Host {
  hostname: string;
  path: string;
  type: string;
}
