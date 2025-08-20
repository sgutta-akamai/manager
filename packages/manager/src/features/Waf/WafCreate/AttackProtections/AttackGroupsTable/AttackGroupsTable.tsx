import { useUpdateWafAttackGroupActionMutation } from '@linode/queries';
import { Notice, Paper, Select } from '@linode/ui';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import {
  AttackGroupDetailsMapping,
  WAF_ACTION_LABELS,
  WAF_ACTION_OPTIONS,
} from 'src/features/Waf/utils';
import { AttackGroupDrawer } from 'src/features/Waf/WafCreate/AttackProtections/AttackGroupsTable/AttackGroupDrawer/AttackGroupDrawer';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

import type { WAFAction } from '@linode/api-v4';
import type { WAFAttackGroup } from '@linode/api-v4';
import type { WafCreateForm } from 'src/features/Waf/utils';

const StyledAttackGroupLabel = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

// Custom hook for shared table logic
const useAttackGroupsTable = (attackGroups: WAFAttackGroup[]) => {
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [drawerState, setDrawerState] = React.useState<{
    isOpen: boolean;
    selectedGroup?: string;
  }>({ isOpen: false });

  const sortedData = React.useMemo(() => {
    return [...attackGroups].sort((a, b) => {
      const comparison = a.attack_group_label.localeCompare(
        b.attack_group_label
      );
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [attackGroups, sortOrder]);

  const handleSort = () =>
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const openDrawer = (groupName: string) => {
    setDrawerState({ isOpen: true, selectedGroup: groupName });
  };

  const closeDrawer = () => {
    setDrawerState({ isOpen: false });
  };

  return {
    sortOrder,
    sortedData,
    drawerState,
    handleSort,
    openDrawer,
    closeDrawer,
  };
};

interface AttackGroupsTableProps {
  attackGroups?: WAFAttackGroup[];
  mode?: 'create' | 'edit';
  wafId?: number;
}

// Shared Table Layout Component
const AttackGroupsTableContent: React.FC<{
  children?: React.ReactNode;
  onOpenDrawer: (groupName: string) => void;
  onSort: () => void;
  renderActionCell: (item: WAFAttackGroup) => React.ReactNode;
  sortedData: WAFAttackGroup[];
  sortOrder: 'asc' | 'desc';
}> = ({
  sortedData,
  sortOrder,
  onSort,
  onOpenDrawer,
  renderActionCell,
  children,
}) => (
  <div style={{ width: '100%' }}>
    {children}
    <Paper sx={{ width: '100%', padding: '0', marginTop: '20px' }}>
      <Table striped={false}>
        <TableHead>
          <TableRow>
            <TableSortCell
              active
              direction={sortOrder}
              handleClick={onSort}
              label="Attack Group"
              sx={{ width: '70%' }}
            >
              Attack Group
            </TableSortCell>
            <TableCell sx={{ width: '30%' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.attack_group_name}>
              <TableCell>
                <StyledAttackGroupLabel
                  onClick={() => onOpenDrawer(item.attack_group_name)}
                >
                  {item.attack_group_label}
                </StyledAttackGroupLabel>
              </TableCell>
              <TableCell>{renderActionCell(item)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </div>
);

// Shared Drawer Component
const AttackGroupDrawerWrapper: React.FC<{
  drawerState: { isOpen: boolean; selectedGroup?: string };
  onClose: () => void;
}> = ({ drawerState, onClose }) => {
  if (!drawerState.isOpen || !drawerState.selectedGroup) return null;

  return (
    <AttackGroupDrawer
      attackGroupDescription={
        AttackGroupDescriptions[
          drawerState.selectedGroup as keyof typeof AttackGroupDescriptions
        ]
      }
      onClose={onClose}
      open={drawerState.isOpen}
    />
  );
};

// Create Mode Component - Uses form context
const CreateModeTable: React.FC<{ attackGroups: WAFAttackGroup[] }> = () => {
  const { control } = useFormContext<WafCreateForm>();
  const { fields } = useFieldArray({
    control,
    name: 'attackGroups',
  });

  const {
    sortOrder,
    sortedData: sortedFields,
    drawerState,
    handleSort,
    openDrawer,
    closeDrawer,
  } = useAttackGroupsTable(fields);

  const renderActionCell = (item: WAFAttackGroup) => {
    // Find the index of this item in the fields array
    const fieldIndex = fields.findIndex(
      (field) => field.attack_group_name === item.attack_group_name
    );

    if (fieldIndex === -1) return null;

    return (
      <Controller
        control={control}
        name={`attackGroups.${fieldIndex}.action`}
        render={({ field: { onChange, value } }) => (
          <Select
            hideLabel
            label="action"
            onChange={(_, selected) => onChange(selected.value)}
            options={WAF_ACTION_OPTIONS}
            value={value ? { label: WAF_ACTION_LABELS[value], value } : null}
          />
        )}
      />
    );
  };

  return (
    <>
      <AttackGroupsTableContent
        onOpenDrawer={openDrawer}
        onSort={handleSort}
        renderActionCell={renderActionCell}
        sortedData={sortedFields}
        sortOrder={sortOrder}
      >
        <Notice
          sx={{ marginTop: '10px' }}
          text="Use Alert mode to inspect WAF-triggered events before enabling Deny."
          variant="info"
        />
      </AttackGroupsTableContent>

      <AttackGroupDrawerWrapper
        drawerState={drawerState}
        onClose={closeDrawer}
      />
    </>
  );
};

// Edit Mode Component - Direct state management
const EditModeTable: React.FC<{
  attackGroups: WAFAttackGroup[];
  wafId: number;
}> = ({ attackGroups, wafId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    sortOrder,
    sortedData,
    drawerState,
    handleSort,
    openDrawer,
    closeDrawer,
  } = useAttackGroupsTable(attackGroups);

  const [optimisticUpdates, setOptimisticUpdates] = React.useState<
    Record<string, WAFAction>
  >({});

  const updateMutation = useUpdateWafAttackGroupActionMutation(wafId);

  const handleActionChange = React.useCallback(
    (attackGroupName: string, newAction: WAFAction) => {
      const attackGroup = attackGroups.find(
        (g) => g.attack_group_name === attackGroupName
      );
      if (!attackGroup) {
        enqueueSnackbar('Unable to update attack group: Group not found', {
          variant: 'error',
        });
        return;
      }

      updateMutation.mutate(
        {
          attack_group_name: attackGroup.attack_group_name,
          attack_group_label: attackGroup.attack_group_label,
          action: newAction,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(
              `Successfully updated ${attackGroup.attack_group_label} action`,
              { variant: 'success' }
            );
          },
          onError: (error) => {
            setOptimisticUpdates((prev) => {
              const rest = { ...prev };
              delete rest[attackGroupName];
              return rest;
            });
            enqueueSnackbar(
              getErrorStringOrDefault(error, 'Error updating attack group'),
              { variant: 'error' }
            );
          },
        }
      );
    },
    [updateMutation, attackGroups, enqueueSnackbar]
  );

  const renderActionCell = (item: WAFAttackGroup) => {
    const currentAction =
      optimisticUpdates[item.attack_group_name] ?? item.action;

    return (
      <Select
        hideLabel
        label="action"
        onChange={(_, selected) => {
          const newAction = selected.value as WAFAction;
          setOptimisticUpdates((prev) => ({
            ...prev,
            [item.attack_group_name]: newAction,
          }));
          handleActionChange(item.attack_group_name, newAction);
        }}
        options={WAF_ACTION_OPTIONS}
        value={{
          label: WAF_ACTION_LABELS[currentAction],
          value: currentAction,
        }}
      />
    );
  };

  return (
    <>
      <AttackGroupsTableContent
        onOpenDrawer={openDrawer}
        onSort={handleSort}
        renderActionCell={renderActionCell}
        sortedData={sortedData}
        sortOrder={sortOrder}
      />

      <AttackGroupDrawerWrapper
        drawerState={drawerState}
        onClose={closeDrawer}
      />
    </>
  );
};

// Main component - delegates to appropriate sub-component
export const AttackGroupsTable: React.FC<AttackGroupsTableProps> = ({
  mode = 'create',
  wafId,
  attackGroups = [],
}) => {
  if (mode === 'create') {
    return <CreateModeTable attackGroups={attackGroups} />;
  }

  if (mode === 'edit' && wafId) {
    return <EditModeTable attackGroups={attackGroups} wafId={wafId} />;
  }

  return null;
};
