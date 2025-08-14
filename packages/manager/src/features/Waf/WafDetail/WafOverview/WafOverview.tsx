import { WAFAction } from '@linode/api-v4';
import {
  useUpdateWafMutation,
  useWafQuery,
  useWafRuleSetQuery,
} from '@linode/queries';
import {
  Box,
  CircleProgress,
  ErrorState,
  Paper,
  Stack,
  Toggle,
  Typography,
} from '@linode/ui';
import { FormControlLabel } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useMemo, useState } from 'react';

import { Link } from 'src/components/Link';
import { AttackGroupsTable } from 'src/features/Waf/WafCreate/AttackProtections/AttackGroupsTable/AttackGroupsTable';
import { CustomRules } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRules';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

import type { WAF, WAFDevice, WAFHost } from '@linode/api-v4';

interface WafSummaryProps {
  data: WAF;
}

interface CustomRulesSectionProps {
  customRulesEnabled: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  wafId: number;
}

// Helper function to create WAF update payload
const createWafUpdatePayload = (data: WAF, customRulesEnabled: boolean) => ({
  label: data.label,
  devices: data.devices || [],
  attack_groups: data.attack_groups || [],
  hosts: data.hosts || [],
  advanced_settings: {
    ...data.advanced_settings,
    custom_rules_enabled: customRulesEnabled,
  },
});

// WAF Summary Component
const WafSummary: React.FC<WafSummaryProps> = ({ data }) => {
  const hasHosts = data.hosts && data.hosts.length > 0;
  const hasDevices = data.devices && data.devices.length > 0;

  return (
    <Paper>
      <Typography variant="subtitle1">Summary</Typography>
      <Typography variant="h2">Protection active</Typography>

      {hasHosts && (
        <Box alignItems="center" display="flex" gap={1} marginTop={2}>
          <Typography variant="subtitle1">Excluded:</Typography>
          <Typography color="textSecondary" variant="body1">
            {data.hosts!.map((host: WAFHost) => host.hostname).join(' | ')}
          </Typography>
        </Box>
      )}

      {hasDevices && (
        <Box alignItems="center" display="flex" gap={1}>
          <Typography variant="subtitle1">NodeBalancers:</Typography>
          <Typography color="textSecondary" variant="body1">
            {data.devices!.map((device: WAFDevice, index: number) => (
              <React.Fragment key={device.id}>
                <Link to={`/nodebalancers/${device.id}`}>{device.label}</Link>
                {index < data.devices!.length - 1 && ' | '}
              </React.Fragment>
            ))}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Protections Section Component
const ProtectionsSection: React.FC<{ data: WAF }> = ({ data }) => {
  const { data: wafRuleSet } = useWafRuleSetQuery();

  // Merge default attack groups with existing WAF config
  const attackGroups = useMemo(() => {
    if (!wafRuleSet?.attack_groups) return [];

    return wafRuleSet.attack_groups.map((ruleSetGroup) => {
      // Find matching attack group in current WAF config
      const existingGroup = data.attack_groups?.find(
        (configGroup) =>
          configGroup.attack_group_name === ruleSetGroup.attack_group_name
      );

      return {
        attack_group_name: ruleSetGroup.attack_group_name,
        attack_group_label: ruleSetGroup.attack_group_label,
        // Use action from existing config if found, otherwise default to ALERT
        action: existingGroup?.action || WAFAction.ALERT,
      };
    });
  }, [wafRuleSet?.attack_groups, data.attack_groups]);

  return (
    <Paper>
      <Typography variant="h2">Protections</Typography>
      <Stack mt={1}>
        <Typography variant="body1">
          Specify how your web application firewall responds to traffic by
          setting actions for attack groups. These are sets of firewall rules
          that work together to identify and mitigate related attack types.
          Review and update these settings regularly to stay protected against
          evolving attack patterns.
          {/* // TODO: Add the relevant redirection link for 'Learn more', once available. */}
          <Link to="">Learn more</Link>
        </Typography>
      </Stack>

      <AttackGroupsTable
        attackGroups={attackGroups}
        mode="edit"
        wafId={data.id}
      />
    </Paper>
  );
};

// Custom Rules Section Component
const CustomRulesSection: React.FC<CustomRulesSectionProps> = ({
  wafId,
  customRulesEnabled,
  onToggle,
}) => (
  <Paper>
    <Stack alignItems="center" direction="row" spacing={1}>
      <Typography variant="h2">Custom rules</Typography>
      <Typography variant="body1">(optional)</Typography>
    </Stack>

    <Stack>
      <FormControlLabel
        control={<Toggle checked={customRulesEnabled} onChange={onToggle} />}
        label={customRulesEnabled ? 'On' : 'Off'}
      />
    </Stack>

    <Stack mb={4} mt={1}>
      <Typography variant="body1">
        Use custom rules to handle scenarios not covered by standard firewall
        rules or to quickly patch new website vulnerabilities.
        {/* // TODO: Add the relevant redirection link for 'Learn more', once available. */}
        <Link to="">Learn more</Link>
      </Typography>
    </Stack>

    {customRulesEnabled && <CustomRules wafId={wafId} />}
  </Paper>
);

export const WafOverview = () => {
  const { id } = useParams({ from: '/waf/$id/overview' });
  const wafId = Number(id);

  // Data fetching hooks
  const { data, isLoading, error } = useWafQuery(wafId);
  const { mutate: updateWaf } = useUpdateWafMutation();
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [optimisticCustomRulesEnabled, setOptimisticCustomRulesEnabled] =
    useState<boolean | null>(null);

  // Computed values
  const customRulesEnabled =
    optimisticCustomRulesEnabled !== null
      ? optimisticCustomRulesEnabled
      : (data?.advanced_settings?.custom_rules_enabled ?? false);

  const handleCustomRulesToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;

      if (!data) return;

      setOptimisticCustomRulesEnabled(enabled);

      const updatePayload = createWafUpdatePayload(data, enabled);

      updateWaf(
        { wafId, data: updatePayload },
        {
          onError: (error) => {
            setOptimisticCustomRulesEnabled(!enabled);
            enqueueSnackbar(
              getErrorStringOrDefault(error, 'Error toggling custom rules'),
              { variant: 'error' }
            );
          },
        }
      );
    },
    [data, wafId, updateWaf, enqueueSnackbar]
  );

  // Loading state
  if (isLoading) {
    return <CircleProgress />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        errorText={getErrorStringOrDefault(
          error,
          'Error loading WAF configuration.'
        )}
      />
    );
  }

  // No data state
  if (!data) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <WafSummary data={data} />
      <ProtectionsSection data={data} />
      <CustomRulesSection
        customRulesEnabled={customRulesEnabled}
        onToggle={handleCustomRulesToggle}
        wafId={wafId}
      />
    </Stack>
  );
};
