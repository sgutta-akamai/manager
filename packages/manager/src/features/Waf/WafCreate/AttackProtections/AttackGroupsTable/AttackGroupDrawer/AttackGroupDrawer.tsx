import { Drawer } from '@linode/ui';
import * as React from 'react';

import { AttackGroupDescription } from 'src/features/Waf/utils';

interface AttackGroupDrawerProps {
  attackGroupDescription: AttackGroupDescription | undefined;
  onClose: () => void;
  open: boolean;
}
export const AttackGroupDrawer = (props: AttackGroupDrawerProps) => {
  const { attackGroupDescription, onClose, open } = props;

  return (
    <Drawer onClose={onClose} open={open} title="Attack Group Details">
      <h2>{attackGroupDescription?.attack_group_label}</h2>
      <p>{attackGroupDescription?.attack_group_description}</p>
    </Drawer>
  );
};
