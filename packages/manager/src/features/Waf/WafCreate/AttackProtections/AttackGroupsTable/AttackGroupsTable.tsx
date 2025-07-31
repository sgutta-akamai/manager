import { Box, Notice, Paper, Select } from '@linode/ui';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import {
  AttackGroupAction,
  AttackGroupDescriptions,
  WafCreateForm,
} from 'src/features/Waf/utils';
import { AttackGroupDrawer } from 'src/features/Waf/WafCreate/AttackProtections/AttackGroupsTable/AttackGroupDrawer/AttackGroupDrawer';

const StyledAttackGroupLabel = styled('span')({
  color: '#0174BC',
  cursor: 'pointer',
});

export const AttackGroupsTable = () => {
  const { control, setValue, watch } = useFormContext<WafCreateForm>();

  const { fields } = useFieldArray({
    control,
    name: 'attack_groups',
  });

  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [selectedAttackGroup, setSelectedAttackGroup] = React.useState<
    string | undefined
  >(undefined);

  const handleSort = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';

    //TODO - check if watch can be replaced by getValue
    const sortedFields = [...(watch('attack_groups') ?? [])].sort((a, b) => {
      return newOrder === 'asc'
        ? a.attack_group_label.localeCompare(b.attack_group_label)
        : b.attack_group_label.localeCompare(a.attack_group_label);
    });

    setValue('attack_groups', sortedFields, { shouldDirty: true });
    setOrder(newOrder);
  };

  const attackGroupOptions = [
    {
      label: 'Alert',
      value: AttackGroupAction.ALERT,
    },
    {
      label: 'Deny',
      value: AttackGroupAction.DENY,
    },
    {
      label: 'Not used',
      value: AttackGroupAction.NOT_USED,
    },
  ];

  const getLabel = (value: AttackGroupAction) => {
    const option = attackGroupOptions.find((option) => option.value === value);
    return option ? option.label : '';
  };

  return (
    <div style={{ width: '100%' }}>
      <Notice
        sx={{ marginTop: '10px' }}
        text="Use Alert mode to inspect WAF-triggered events before enabling Deny."
        variant="info"
      />
      <Paper sx={{ width: '100%', padding: '0', marginTop: '20px' }}>
        <Box>
          <Table striped={false}>
            <TableHead>
              <TableRow>
                <TableSortCell
                  active
                  direction={order}
                  handleClick={handleSort}
                  label="label"
                  sx={{ width: '70%' }}
                >
                  Attack Group
                </TableSortCell>
                <TableCell sx={{ width: '30%' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.attack_group_name}>
                  <TableCell>
                    <StyledAttackGroupLabel
                      onClick={() => {
                        setIsDrawerOpen(true);
                        setSelectedAttackGroup(field.attack_group_name);
                      }}
                    >
                      {field.attack_group_label}
                    </StyledAttackGroupLabel>
                  </TableCell>
                  <TableCell>
                    <Controller
                      control={control}
                      name={`attack_groups.${index}.action`}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          hideLabel={true}
                          label="action"
                          onChange={(e, selected) => {
                            onChange(selected.value);
                            //force setting form state. Fixes issue of form not registering first change unless another change is made. TODO - find better fix
                            //TODO - check if watch can be replaced by getValue
                            setValue('attack_groups', watch('attack_groups'), {
                              shouldDirty: true,
                            });
                          }}
                          options={attackGroupOptions}
                          value={
                            value ? { label: getLabel(value), value } : null
                          }
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      {selectedAttackGroup && (
        <AttackGroupDrawer
          attackGroupDescription={
            AttackGroupDescriptions[
              selectedAttackGroup as keyof typeof AttackGroupDescriptions
            ]
          }
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedAttackGroup(undefined);
          }}
          open={isDrawerOpen}
        ></AttackGroupDrawer>
      )}
    </div>
  );
};
