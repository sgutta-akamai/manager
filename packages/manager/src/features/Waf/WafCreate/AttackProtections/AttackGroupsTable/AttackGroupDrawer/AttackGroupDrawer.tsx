import { Drawer, Stack } from '@linode/ui';
import * as React from 'react';

import { AttackGroupDetails } from 'src/features/Waf/utils';

interface AttackGroupDrawerProps {
  attackGroupDetails: AttackGroupDetails | undefined;
  onClose: () => void;
  open: boolean;
}
export const AttackGroupDrawer = (props: AttackGroupDrawerProps) => {
  const { attackGroupDetails, onClose, open } = props;

  return (
    <Drawer onClose={onClose} open={open} title="Attack Group Details">
      <Stack gap="8px">
        <h2
          style={{ borderBottom: '1px solid #D6D6DD', paddingBottom: '12px' }}
        >
          {attackGroupDetails?.attack_group_label}
        </h2>
        <Stack>
          <span style={{ fontWeight: '800' }}>Description</span>
          <p style={{ marginTop: '5px' }}>
            {attackGroupDetails?.attack_group_description}
          </p>
          {!attackGroupDetails && (
            <p>No details available for this attack group.</p>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};
