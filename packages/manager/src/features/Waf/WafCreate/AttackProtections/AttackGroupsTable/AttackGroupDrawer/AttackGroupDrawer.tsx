import { Drawer } from '@linode/ui';
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
      <h2>{attackGroupDetails?.attack_group_label}</h2>
      <p>{attackGroupDetails?.attack_group_description}</p>
    </Drawer>
  );
};
