// TODO: import { useDeleteWafMutation } from "@linode/queries";
import { Notice, Typography } from '@linode/ui';
import * as React from 'react';

import { TypeToConfirmDialog } from 'src/components/TypeToConfirmDialog/TypeToConfirmDialog';
import { useEventsPollingActions } from 'src/queries/events/events';

import type { APIError, WAF } from '@linode/api-v4';

interface Props {
  isFetching?: boolean;
  onClose: () => void;
  open: boolean;
  // TODO: Review the handling of 'waf' prop later, to provide a better fix
  waf: undefined | WAF;
  wafError?: APIError[] | null;
}

export const DeleteWafDialog = (props: Props) => {
  const { isFetching, onClose, open, waf, wafError } = props;

  // --- Mocked useDeleteWafMutation hook ---
  const useDeleteWafMutation = () => {
    const [isPending, setIsPending] = React.useState(false);
    const [error, setError] = React.useState<APIError[] | null>(null);

    const mutateAsync = async ({ id }: { id: number }) => {
      /* eslint-disable */
      // TODO: Remove the console log statement
      console.log(`Mock useDeleteWafMutation API called for Waf ID: ${id}`);
      /* eslint-enable */
      setIsPending(true);
      setError(null);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsPending(false);
          resolve();
        }, 1000);
      });
    };

    return {
      error,
      isPending,
      mutateAsync,
    };
  };

  const { error, isPending, mutateAsync: deleteWaf } = useDeleteWafMutation();

  const { checkForNewEvents } = useEventsPollingActions();

  const onDelete = () => {
    // TODO: Review the handling of 'id' in deleteWaf() mutation, to provide a better fix
    deleteWaf({ id: waf?.id ?? -1 }).then(() => {
      onClose();
      checkForNewEvents();
    });
  };

  return (
    <TypeToConfirmDialog
      entity={{
        action: 'deletion',
        name: waf?.label,
        primaryBtnText: 'Delete',
        type: 'WAF configuration',
        error: wafError,
      }}
      errors={error}
      expand
      isFetching={isFetching}
      label="Waf Configuration Label"
      loading={isPending}
      onClick={onDelete}
      onClose={onClose}
      open={open}
      title={`Delete configuration`}
      typographyStyle={{ marginTop: '10px' }}
    >
      <Notice variant="warning">
        <Typography style={{ fontSize: '0.875rem' }}>
          Deleted this WAF configuration is permanent and can’t be undone.
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
