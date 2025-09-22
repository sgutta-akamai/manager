import { WAFAction, WafStatus } from '@linode/api-v4';
import { WAFExclusionType } from '@linode/api-v4';

import type { WAFDevice } from '@linode/api-v4';

export interface WafCreateForm {
  advancedSettings?: {
    customRulesEnabled?: boolean;
    host_path_exclusion_enabled?: boolean;
  };
  attackGroups?: AttackGroup[];
  devices?: WAFDevice[];
  hosts?: Array<{
    hostname: string[];
    paths: string[];
  }>;
  isAdjustProtectedResourcesEnabled: boolean;
  label: string;
  paths?: Path[];
  status: WafStatus;
}

export interface AttackGroup {
  action: WAFAction;
  attack_group_label: string;
  attack_group_name: string;
}

export interface AttackGroupDetails {
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

// TODO - update attack_group_description values after discussion with UX team
export const AttackGroupDetailsMapping = {
  'CMD-INJECTION-ANOMALY': {
    attack_group_label: 'Command Injection',
    attack_group_description:
      'Detects and blocks attempts to execute arbitrary commands on the server.',
  },
  'LFI-ANOMALY': {
    attack_group_label: 'Local File Inclusion',
    attack_group_description:
      'Detects and blocks attempts to include files from the local or remote file system.',
  },
  'RFI-ANOMALY': {
    attack_group_label: 'Remote File Inclusion',
    attack_group_description:
      'Detects and blocks attempts to include files from remote servers.',
  },
  'SQL-INJECTION-ANOMALY': {
    attack_group_label: 'SQL Injection',
    attack_group_description:
      'Detects and blocks attempts to manipulate SQL queries through user input.',
  },
  'PROTOCOL-ANOMALY': {
    attack_group_label: 'Web Protocol Attack',
    attack_group_description:
      'Detects and blocks attacks targeting web protocols and standards.',
  },
  'XSS-ANOMALY': {
    attack_group_label: 'Cross-Site Scripting (XSS)',
    attack_group_description:
      'Detects and blocks attempts to execute scripts in the context of a user’s browser.',
  },
  'PLATFORM-ANOMALY': {
    attack_group_label: 'Web Platform Attack',
    attack_group_description:
      'Detects and blocks attacks targeting web platform vulnerabilities.',
  },
  'WAT-ANOMALY': {
    attack_group_label: 'Web Attack Tool',
    attack_group_description:
      'Detects and blocks automated tools used for web attacks.',
  },
  'POLICY-ANOMALY': {
    attack_group_label: 'Web Policy Violation',
    attack_group_description:
      'Detects and blocks requests that violate web security policies.',
  },
};

export const WAF_ACTION_OPTIONS = [
  { label: 'Alert', value: WAFAction.ALERT },
  { label: 'Deny', value: WAFAction.DENY },
  { label: 'Not used', value: WAFAction.NOT_USED },
];

export const WAF_ACTION_LABELS = {
  [WAFAction.ALERT]: 'Alert',
  [WAFAction.DENY]: 'Deny',
  [WAFAction.NOT_USED]: 'Not used',
};

export const getTransformedHostsForPayload = (
  formData: Partial<WafCreateForm>
) => {
  if (!formData.hosts) return [];

  return formData.hosts
    .filter((host) => Array.isArray(host.hostname) && host.hostname.length > 0)
    .flatMap((host) =>
      host.paths.map((path) => ({
        hostname: host.hostname[0],
        path,
        exclusion_type: WAFExclusionType.EXCLUDED,
      }))
    );
};

export const MULTIPLE_HOSTNAMES_SELECTED_ERROR_MESSAGE =
  'You can only specify one hostname per entry';

export const getWafStatusIcon = (status: WafStatus) => {
  switch (status) {
    case WafStatus.DELETED:
    case WafStatus.DISABLED:
      return 'inactive';
    case WafStatus.ENABLED:
      return 'active';
    case WafStatus.ERROR:
      return 'error';
    case WafStatus.PENDING:
    case WafStatus.UPDATING:
      return 'other';
    default:
      return 'inactive';
  }
};
