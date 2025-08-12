import { useUpdateWafMutation, useWafQuery } from '@linode/queries';
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
import React, { useCallback, useState } from 'react';

import { Link } from 'src/components/Link';
import { CustomRules } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRules';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

import type { WAF } from '@linode/api-v4';

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
            {data.hosts!.map((host: any) => host.hostname).join(' | ')}
          </Typography>
        </Box>
      )}

      {hasDevices && (
        <Box alignItems="center" display="flex" gap={1}>
          <Typography variant="subtitle1">NodeBalancers:</Typography>
          <Typography color="textSecondary" variant="body1">
            {data.devices!.map((device: any, index: number) => (
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
const ProtectionsSection: React.FC = () => (
  <Paper>
    <Typography variant="h2">Protections</Typography>
    <Stack mt={1}>
      <Typography variant="body1">
        Specify how your web application firewall responds to traffic by setting
        actions for attack groups. These are sets of firewall rules that work
        together to identify and mitigate related attack types. Review and
        update these settings regularly to stay protected against evolving
        attack patterns.
        {/* // TODO: Add the relevant redirection link for 'Learn more', once available. */}
        <Link to="">Learn more</Link>
      </Typography>
    </Stack>
  </Paper>
);

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
              getAPIErrorOrDefault(error, 'Error toggling custom rules, ')[0]
                .reason,
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
        errorText={
          getAPIErrorOrDefault(error, 'Error loading WAF configuration.')[0]
            .reason
        }
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
      <ProtectionsSection />
      <CustomRulesSection
        customRulesEnabled={customRulesEnabled}
        onToggle={handleCustomRulesToggle}
        wafId={wafId}
      />
    </Stack>
  );
};
