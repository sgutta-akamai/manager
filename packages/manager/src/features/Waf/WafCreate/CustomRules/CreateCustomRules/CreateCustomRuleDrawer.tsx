import {
  ActionsPanel,
  Box,
  Button,
  Drawer,
  Select,
  Stack,
  TextField,
  Typography,
} from '@linode/ui';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import { CustomRuleCondition } from 'src/features/Waf/WafCreate/CustomRules/CreateCustomRules/CustomRuleCondition';

import type { CreateCustomRulePayload } from '@linode/api-v4';

export interface CreateCustomRuleDrawerProps {
  onClose: () => void;
  open: boolean;
}

// TODO: Remove the dummy data, once BE integration is finished
const filterFields = ['Hostname', 'Request body parameter', 'IP Address'];
const operators = ['matches', 'equals', 'contains'];
const match_type = [
  {
    label: 'Any',
    value: 'any',
  },
  {
    label: 'All',
    value: 'all',
  },
];
const initialJSON = {
  custom_rule_id: 1751023618480,
  label: 'Custom Rule #01',
  description: 'Creating custom rules',
  filters: [
    {
      match_type: 'all',
      conditions: [
        {
          field: 'Hostname',
          operator: 'matches',
          values: ['example.com', 'test.org'],
        },
        {
          field: 'Request body parameter',
          operator: 'equals',
          values: ['param1'],
        },
        {
          field: 'IP Address',
          operator: 'contains',
          values: ['192.168'],
        },
      ],
    },
  ],
  action: 'alert',
};

export const CreateCustomRuleDrawer = (props: CreateCustomRuleDrawerProps) => {
  const { onClose, open } = props;
  const form = useForm({
    defaultValues: {
      label: initialJSON.label,
      description: initialJSON.description,
      filters: initialJSON.filters,
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'filters.0.conditions',
  });

  const onSubmit = (formData: CreateCustomRulePayload) => {
    /* eslint-disable */
    // TODO: Remove the console log statement
    console.log('Final form submission', formData);
    /* eslint-enable */
  };

  return (
    <>
      <Drawer
        onClose={onClose}
        open={open}
        title={'Create custom rule'}
        wide={true}
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box marginTop={3}>
              <Controller
                control={control}
                name="label"
                render={({ field, fieldState }) => (
                  <TextField
                    errorText={fieldState.error?.message}
                    expand
                    label="Custom Rule Label"
                    onChange={field.onChange}
                    placeholder="Enter custom rule label"
                    value={field.value}
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <TextField
                    errorText={fieldState.error?.message}
                    expand
                    label="Description"
                    multiline
                    onChange={field.onChange}
                    optional
                    placeholder="Enter a description"
                    value={field.value}
                  />
                )}
              />
            </Box>

            <Stack
              alignItems="center"
              direction="row"
              marginTop={4}
              spacing={1.5}
            >
              <Typography variant={'subtitle1'}>
                Execute the rule only when
              </Typography>

              <Controller
                control={control}
                name="filters.0.match_type"
                render={({ field, fieldState }) => (
                  <Select
                    errorText={fieldState.error?.message}
                    hideLabel
                    label="Match Type"
                    onChange={(_, selected) => field.onChange(selected?.value)}
                    options={match_type}
                    value={
                      match_type.find(
                        (option) => option.value === field.value
                      ) ?? null
                    }
                  />
                )}
              />

              <Typography variant={'subtitle1'}>
                of the following conditions are met:
              </Typography>
            </Stack>

            {fields.map((row, index: number) => (
              <CustomRuleCondition
                filterFields={filterFields}
                index={index}
                key={row.id}
                onRemove={() => remove(index)}
                operators={operators}
              />
            ))}

            <Box>
              <Button
                buttonType="outlined"
                onClick={() =>
                  append({
                    field: '',
                    operator: '',
                    values: [],
                  })
                }
              >
                Add
              </Button>
            </Box>

            <ActionsPanel
              primaryButtonProps={{
                label: 'Create Custom Rule',
                type: 'submit',
              }}
              secondaryButtonProps={{
                label: 'Cancel',
                onClick: onClose,
              }}
            />
          </form>
        </FormProvider>
      </Drawer>
    </>
  );
};
