import { type APIError, WafStatus } from '@linode/api-v4';
import { useUpdateWafMutation } from '@linode/queries';
import { useSnackbar } from 'notistack';
import React, { useCallback } from 'react';

import { AlertConfirmationDialog } from 'src/features/CloudPulse/Alerts/AlertsLanding/AlertConfirmationDialog';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

import type { WAF } from '@linode/api-v4';

interface Props {
  onClose: () => void;
  open: boolean;
  waf?: WAF;
}

export const WafStatusDialog = ({ onClose, open, waf }: Props) => {
  const isEnabled = waf?.status === WafStatus.ENABLED;
  const { mutate: updateWaf, isPending, reset } = useUpdateWafMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleError = useCallback(
    (errors: APIError[]) => {
      const message = getErrorStringOrDefault(
        errors,
        `Failed to ${isEnabled ? 'disable' : 'enable'} WAF configuration`
      );
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar, isEnabled]
  );

  const handleConfirm = () => {
    if (!waf) return;

    updateWaf(
      {
        wafId: waf.id,
        data: {
          label: waf.label,
          devices: waf.devices,
          hosts: waf.hosts,
          advanced_settings: waf.advanced_settings,
          attack_groups: waf.attack_groups,
          status: isEnabled ? WafStatus.DISABLED : WafStatus.ENABLED,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };

  return (
    <AlertConfirmationDialog
      handleCancel={onClose}
      handleConfirm={handleConfirm}
      isLoading={isPending}
      isOpen={open}
      message={`Are you sure you want to ${
        isEnabled ? 'disable' : 'enable'
      } this configuration?`}
      primaryButtonLabel={`${isEnabled ? 'Disable ' : 'Enable '} configuration`}
      title={`${isEnabled ? 'Disable' : 'Enable'} ${waf?.label} configuration? `}
    />
  );
};
