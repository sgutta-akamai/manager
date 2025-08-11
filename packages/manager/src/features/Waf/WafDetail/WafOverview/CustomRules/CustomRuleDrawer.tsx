import { useWafMetadataQuery } from '@linode/queries';
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

import { CustomRuleCondition } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRuleCondition';

import type { WAFCustomRule } from '@linode/api-v4';

export interface CreateCustomRuleDrawerProps {
  onClose: () => void;
  onSubmit: (data: WAFCustomRule) => void;
  open: boolean;
}

export const CustomRuleDrawer = (props: CreateCustomRuleDrawerProps) => {
  const { onClose, onSubmit, open } = props;

  // Fetch WAF metadata using the custom hook
  const { data: wafMetadata } = useWafMetadataQuery();

  const form = useForm<WAFCustomRule>({
    defaultValues: {
      label: '',
      description: '',
      filters: {
        match_type: 'all',
        conditions: [],
      },
    },
  });

  const { control, handleSubmit, watch } = form;

  // Watch form values to determine save button state
  const watchedValues = watch([
    'label',
    'filters.match_type',
    'filters.conditions',
  ]);
  const [label, matchType, conditions] = watchedValues;

  // Check if save button should be disabled
  const isSaveDisabled =
    !label || !matchType || !conditions || conditions.length === 0;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'filters.conditions',
  });

  const handleAddCondition = () => {
    append({
      field: wafMetadata?.custom_rules.condition_field[0].value || '',
      operator: wafMetadata?.custom_rules.condition_operator[0].value || '',
      values: [],
    });
  };

  const handleFormSubmit = (formData: WAFCustomRule) => {
    onSubmit(formData);
  };

  return (
    <Drawer
      onClose={onClose}
      open={open}
      title={'Create custom rule'}
      wide={true}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              name="filters.match_type"
              render={({ field, fieldState }) => {
                const selectedOption =
                  wafMetadata?.custom_rules.match_type?.find(
                    (option) => option.value === field.value
                  ) || null;

                return (
                  <Select
                    errorText={fieldState.error?.message}
                    hideLabel
                    label="Match Type"
                    onChange={(_, selected) => field.onChange(selected?.value)}
                    options={wafMetadata?.custom_rules.match_type || []}
                    value={selectedOption}
                  />
                );
              }}
            />

            <Typography variant={'subtitle1'}>
              of the following conditions are met:
            </Typography>
          </Stack>

          {fields.map((row, index: number) => (
            <CustomRuleCondition
              index={index}
              key={row.id}
              onRemove={() => remove(index)}
            />
          ))}

          <Box marginTop={3}>
            <Button buttonType="outlined" onClick={() => handleAddCondition()}>
              Add
            </Button>
          </Box>

          <ActionsPanel
            primaryButtonProps={{
              disabled: isSaveDisabled,
              label: 'Save',
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
  );
};
