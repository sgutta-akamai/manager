import { WAFAction } from '@linode/api-v4';
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

import type { CreateCustomRulePayload } from '@linode/api-v4';

interface CreateCustomRuleDrawerProps {
  onClose: () => void;
  onSubmit: (data: CreateCustomRulePayload) => void;
  open: boolean;
}

const DEFAULT_FORM_VALUES: CreateCustomRulePayload = {
  label: '',
  description: '',
  filters: {
    match_type: 'all',
    conditions: [],
  },
  action: WAFAction.ALERT,
};

export const CustomRuleDrawer = ({
  onClose,
  onSubmit,
  open,
}: CreateCustomRuleDrawerProps) => {
  const { data: wafMetadata } = useWafMetadataQuery();

  const form = useForm<CreateCustomRulePayload>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { control, handleSubmit, watch, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'filters.conditions',
  });

  // Watch form values for validation
  const [label, conditions] = watch(['label', 'filters.conditions']);
  const isSaveDisabled = !label?.trim() || conditions?.length === 0;

  // Reset form when drawer closes
  React.useEffect(() => {
    if (!open) {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [open, reset]);

  const handleAddCondition = React.useCallback(() => {
    append({
      field: wafMetadata?.custom_rules.condition_field?.[0]?.value || '',
      operator: wafMetadata?.custom_rules.condition_operator?.[0]?.value || '',
      values: [],
    });
  }, [append, wafMetadata]);

  const handleFormSubmit = React.useCallback(
    (formData: CreateCustomRulePayload) => {
      onSubmit(formData);
    },
    [onSubmit]
  );

  const matchTypeOptions = wafMetadata?.custom_rules.match_type || [];

  return (
    <Drawer onClose={onClose} open={open} title="Create custom rule" wide>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box marginTop={3}>
            <Controller
              control={control}
              name="label"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  errorText={fieldState.error?.message}
                  expand
                  label="Custom Rule Label"
                  placeholder="Enter custom rule label"
                  required
                />
              )}
              rules={{ required: 'Label is required' }}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  errorText={fieldState.error?.message}
                  expand
                  label="Description"
                  multiline
                  optional
                  placeholder="Enter a description"
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
            <Typography variant="subtitle1">
              Execute the rule only when
            </Typography>

            <Controller
              control={control}
              name="filters.match_type"
              render={({ field }) => {
                const selectedOption = matchTypeOptions.find(
                  (option) => option.value === field.value
                );

                return (
                  <Select
                    hideLabel
                    label="Match Type"
                    onChange={(_, selected) => field.onChange(selected?.value)}
                    options={matchTypeOptions}
                    value={selectedOption || null}
                  />
                );
              }}
            />

            <Typography variant="subtitle1">
              of the following conditions are met:
            </Typography>
          </Stack>

          {fields.map((row, index) => (
            <CustomRuleCondition
              index={index}
              key={row.id}
              onRemove={() => remove(index)}
            />
          ))}

          <Box marginTop={3}>
            <Button buttonType="outlined" onClick={handleAddCondition}>
              Add Condition
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
