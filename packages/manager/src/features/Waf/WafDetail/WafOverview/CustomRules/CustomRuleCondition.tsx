import { useWafMetadataQuery } from '@linode/queries';
import {
  Box,
  CloseIcon,
  IconButton,
  Select,
  Stack,
  TextField,
} from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface CustomRuleConditionProps {
  index: number;
  onRemove: () => void;
}

export const CustomRuleCondition = ({
  index,
  onRemove,
}: CustomRuleConditionProps) => {
  const { data: wafMetadata } = useWafMetadataQuery();
  const { control } = useFormContext();

  const conditionFieldOptions = wafMetadata?.custom_rules.condition_field || [];
  const conditionOperatorOptions =
    wafMetadata?.custom_rules.condition_operator || [];

  return (
    <Stack direction="row" marginTop={2} spacing={2}>
      <Box sx={{ width: '40%' }}>
        <Controller
          control={control}
          name={`filters.conditions.${index}.field`}
          render={({ field, fieldState }) => {
            const selectedOption = conditionFieldOptions.find(
              (option) => option.value === field.value
            );

            return (
              <Select
                errorText={fieldState.error?.message}
                hideLabel
                label="Field"
                onChange={(_, selected) => field.onChange(selected?.value)}
                options={conditionFieldOptions}
                value={selectedOption || null}
              />
            );
          }}
        />
      </Box>

      <Box sx={{ width: '25%' }}>
        <Controller
          control={control}
          name={`filters.conditions.${index}.operator`}
          render={({ field, fieldState }) => {
            const selectedOption = conditionOperatorOptions.find(
              (option) => option.value === field.value
            );

            return (
              <Select
                errorText={fieldState.error?.message}
                hideLabel
                label="Operator"
                onChange={(_, selected) => field.onChange(selected?.value)}
                options={conditionOperatorOptions}
                value={selectedOption || null}
              />
            );
          }}
        />
      </Box>

      <Box sx={{ width: '30%' }}>
        <Controller
          control={control}
          name={`filters.conditions.${index}.values`}
          render={({ field, fieldState }) => (
            <TextField
              errorText={fieldState.error?.message}
              hideLabel
              label="Values"
              onChange={(e) => field.onChange([e.target.value])}
              placeholder="Enter values"
              value={field.value?.[0] || ''}
            />
          )}
        />
      </Box>

      <Box sx={{ width: '5%' }}>
        <IconButton aria-label="Clear" onClick={onRemove} size="medium">
          <CloseIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};
