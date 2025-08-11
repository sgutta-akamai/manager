import type { WAFAction, WAFDevice } from '@linode/api-v4';
import type { WAFExclusionType } from '@linode/api-v4';

export interface WafCreateForm {
  advancedSettings?: {
    customRulesEnabled?: boolean;
  };
  attackGroups?: AttackGroup[];
  devices?: WAFDevice[];
  hosts?: Host[];
  isAdjustProtectedResourcesEnabled: boolean;
  label: string;
  paths?: Path[];
}

export interface AttackGroup {
  action: WAFAction;
  attack_group_label: string;
  attack_group_name: string;
}

export interface AttackGroupDescription {
  attack_group_description: string;
  attack_group_label: string;
}

export interface Host {
  exclusionType: WAFExclusionType;
  hostname: string;
  path: string;
}

type Path = Host;

export const WILDCARD_HOSTNAME = '*';

// TODO - replace keys with actual attack group names from backend
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
