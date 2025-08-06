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
      label="WAF Configuration Label"
      loading={isPending}
      onClick={handleDelete}
      onClose={handleClose}
      open={open}
      title="Delete Configuration"
      typographyStyle={{ marginTop: '10px' }}
    >
      <Notice variant="warning">
        <Typography style={{ fontSize: '0.875rem' }}>
          Deleting this WAF configuration is permanent and can&#39;t be undone.
        </Typography>
      </Notice>

      {/* TODO: Replace the relevant text content below, once available from the UX*/}
      <Typography variant="body1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Typography>
    </TypeToConfirmDialog>
  );
};
