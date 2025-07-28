export interface WafCreateForm {
  advancedSettings?: {
    customRulesEnabled?: boolean;
  };
  attackGroups?: AttackGroup[];
  devices?: Device[];
  hosts?: Host[];
  isAdjustProtectedResourcesEnabled: boolean;
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
  attack_group_label: string;
  attack_group_name: string;
}

export interface Device {
  id: string;
  label: string;
  type: string;
}

export interface Host {
  exclusionType: ExclusionType;
  hostname: string;
  path: string;
}

export enum ExclusionType {
  EXCLUDED = 'excluded',
  INCLUDED = 'included',
}

export const WILDCARD_HOSTNAME = '*';
