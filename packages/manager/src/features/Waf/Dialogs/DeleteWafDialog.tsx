import { useDeleteWafMutation } from '@linode/queries';
import { Notice, Typography } from '@linode/ui';
import React from 'react';

import { TypeToConfirmDialog } from 'src/components/TypeToConfirmDialog/TypeToConfirmDialog';
import { useEventsPollingActions } from 'src/queries/events/events';

import type { WAF } from '@linode/api-v4';

interface Props {
  onClose: () => void;
  open: boolean;
  // TODO: Review the handling of 'waf' prop later, to provide a better fix
  waf?: WAF;
}

export const DeleteWafDialog = ({ onClose, open, waf }: Props) => {
  const {
    error,
    isPending,
    mutateAsync: deleteWaf,
    reset,
  } = useDeleteWafMutation();
  const { checkForNewEvents } = useEventsPollingActions();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = async () => {
    if (!waf?.id) {
      handleClose();
      return;
    }

    await deleteWaf(waf.id)
      .then(() => {
        checkForNewEvents();
        handleClose();
      })
      .catch(() => {
        // Error is automatically handled by React Query and displayed via the errors prop
        // We don't need to handle it here since the dialog will show the error
      });
  };

  return (
    <TypeToConfirmDialog
      entity={{
        action: 'deletion',
        name: waf?.label,
        primaryBtnText: 'Delete',
        type: 'WAF configuration',
      }}
      errors={error}
      expand
      label="WAF configuration label"
      loading={isPending}
      onClick={handleDelete}
      onClose={handleClose}
      open={open}
      title="Delete configuration?"
      typographyStyle={{ marginTop: '10px' }}
    >
      <Notice variant="warning">
        <Typography style={{ fontSize: '0.875rem' }}>
          Deleting this WAF configuration is permanent and can't be undone.
        </Typography>
      </Notice>

      {/* TODO: Replace the relevant text content below, once available from the UX*/}
      <Typography variant="body1">
        This action will permanently remove your WAF configuration from our
        database. The WAF and custom rules will also be removed from your
        NodeBalancers and they will no longer protect your traffic.
      </Typography>
    </TypeToConfirmDialog>
  );
};
