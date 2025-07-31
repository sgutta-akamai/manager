export interface WafCreateForm {
  advancedSettings?: {
    customRulesEnabled?: boolean;
  };
  attackGroups?: AttackGroup[];
  devices?: Device[];
  hosts?: Host[];
  isAdjustProtectedResourcesEnabled: boolean;
  label: string;
  paths?: Path[];
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
  action: AttackGroupAction;
  attack_group_label: string;
  attack_group_name: string;
}

export interface AttackGroupDescription {
  attack_group_description: string;
  attack_group_label: string;
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

export enum AttackGroupAction {
  ALERT = 'alert',
  DENY = 'deny',
  NOT_USED = 'not_used',
}

type Path = Host;

export const WILDCARD_HOSTNAME = '*';

//TODO - replace with values from backend data during integration
export const defaultAttackGroups: AttackGroup[] = [
  {
    attack_group_label: 'Command Injection',
    attack_group_name: 'Command Injection',
    action: AttackGroupAction.ALERT,
  },
  {
    attack_group_label: 'File Inclusion',
    attack_group_name: 'File Inclusion',
    action: AttackGroupAction.ALERT,
  },
  {
    attack_group_label: 'Remote File Inclusion',
    attack_group_name: 'Remote File Inclusion',
    action: AttackGroupAction.ALERT,
  },
  {
    attack_group_label: 'SQL Injection',
    attack_group_name: 'SQL Injection',
    action: AttackGroupAction.ALERT,
  },
  {
    attack_group_label: 'Web Protocol Attack',
    attack_group_name: 'Web Protocol Attack',
    action: AttackGroupAction.ALERT,
  },
];

//TODO - replace keys with actual attack group names from backend
export const AttackGroupDescriptions = {
  'Command Injection': {
    attack_group_label: 'Command Injection',
    attack_group_description:
      'Detects and blocks attempts to execute arbitrary commands on the server.',
  },
  'File Inclusion': {
    attack_group_label: 'File Inclusion',
    attack_group_description:
      'Detects and blocks attempts to include files from the local or remote file system.',
  },
  'Remote File Inclusion': {
    attack_group_label: 'Remote File Inclusion',
    attack_group_description:
      'Detects and blocks attempts to include files from remote servers.',
  },
  'SQL Injection': {
    attack_group_label: 'SQL Injection',
    attack_group_description:
      'Detects and blocks attempts to manipulate SQL queries through user input.',
  },
  'Web Protocol Attack': {
    attack_group_label: 'Web Protocol Attack',
    attack_group_description:
      'Detects and blocks attacks targeting web protocols and standards.',
  },
};
