import { WAFAction, type WAFCustomRule } from '@linode/api-v4';
import {
  useCreateCustomRuleMutation,
  useUpdateCustomRuleMutation,
  useWafMetadataQuery,
} from '@linode/queries';
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
import { useSnackbar } from 'notistack';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import { CustomRuleCondition } from 'src/features/Waf/WafDetail/WafOverview/CustomRules/CustomRuleCondition';

interface CustomRuleDrawerProps {
  onClose: () => void;
  open: boolean;
  rule?: null | WAFCustomRule;
  wafId: number;
}

const DEFAULT_FORM_VALUES: WAFCustomRule = {
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
  open,
  rule,
  wafId,
}: CustomRuleDrawerProps) => {
  const { data: wafMetadata } = useWafMetadataQuery();
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = Boolean(rule);

  // Set up mutations
  const updateCustomRuleMutation = useUpdateCustomRuleMutation(wafId);
  const createCustomRuleMutation = useCreateCustomRuleMutation(wafId);

  const form = useForm<WAFCustomRule>({
    defaultValues: rule
      ? {
          label: rule.label,
          description: rule.description,
          filters: rule.filters,
          action: rule.action,
        }
      : DEFAULT_FORM_VALUES,
  });

  const { control, handleSubmit, watch, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'filters.conditions',
  });

  // Watch form values for validation
  const [label, conditions] = watch(['label', 'filters.conditions']);
  const isSaveDisabled = !label?.trim() || conditions?.length === 0;

  // Reset form when drawer closes or rule changes
  React.useEffect(() => {
    if (!open) {
      reset(DEFAULT_FORM_VALUES);
    } else if (rule) {
      reset({
        label: rule.label,
        description: rule.description,
        filters: rule.filters,
        action: rule.action,
      });
    }
  }, [open, reset, rule]);

  const handleAddCondition = React.useCallback(() => {
    append({
      field: wafMetadata?.custom_rules.condition_field?.[0]?.value || '',
      operator: wafMetadata?.custom_rules.condition_operator?.[0]?.value || '',
      values: [],
    });
  }, [append, wafMetadata]);

  const handleFormSubmit = React.useCallback(
    (formData: WAFCustomRule) => {
      if (isEditMode && rule?.id) {
        updateCustomRuleMutation.mutate(
          {
            ruleId: rule.id,
            data: formData,
          },
          {
            onSuccess: () => {
              enqueueSnackbar('Custom rule updated successfully', {
                variant: 'success',
              });
              onClose();
            },
            onError: (_error) => {
              enqueueSnackbar('Failed to update custom rule', {
                variant: 'error',
              });
            },
          }
        );
      } else {
        createCustomRuleMutation.mutate(formData, {
          onSuccess: () => {
            enqueueSnackbar('Custom rule created successfully', {
              variant: 'success',
            });
            onClose();
          },
          onError: (_error) => {
            enqueueSnackbar('Failed to create custom rule', {
              variant: 'error',
            });
          },
        });
      }
    },
    [
      isEditMode,
      rule?.id,
      updateCustomRuleMutation,
      createCustomRuleMutation,
      enqueueSnackbar,
      onClose,
    ]
  );

  const matchTypeOptions = wafMetadata?.custom_rules.match_type || [];

  return (
    <Drawer
      onClose={onClose}
      open={open}
      title={isEditMode ? 'Edit custom rule' : 'Add custom rule'}
      wide
    >
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
