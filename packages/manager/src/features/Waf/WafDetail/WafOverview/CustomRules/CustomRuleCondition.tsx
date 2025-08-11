import { useWafMetadataQuery } from '@linode/queries';
import { Box, Button, Select, Stack, TextField } from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface CustomRuleConditionProps {
  index: number;
  onRemove: () => void;
}

export const CustomRuleCondition = (props: CustomRuleConditionProps) => {
  const { index, onRemove } = props;

  // Fetch WAF metadata using the hook directly
  const { data: wafMetadata } = useWafMetadataQuery();

  const { control } = useFormContext();

  return (
    <Stack direction="row" marginTop={2} spacing={2}>
      <Box sx={{ width: '20%' }}>
        <Controller
          control={control}
          name={`filters.conditions.${index}.field`}
          render={({ field, fieldState }) => {
            const selectedOption =
              wafMetadata?.custom_rules.condition_field?.find(
                (option) => option.value === field.value
              ) || null;

            return (
              <Select
                errorText={fieldState.error?.message}
                hideLabel
                label="Field"
                onChange={(_, selected) => field.onChange(selected?.value)}
                options={wafMetadata?.custom_rules.condition_field || []}
                value={selectedOption}
              />
            );
          }}
        />
      </Box>

      <Box sx={{ width: '20%' }}>
        <Controller
          control={control}
          name={`filters.conditions.${index}.operator`}
          render={({ field, fieldState }) => {
            const selectedOption =
              wafMetadata?.custom_rules.condition_operator?.find(
                (option) => option.value === field.value
              ) || null;

            return (
              <Select
                errorText={fieldState.error?.message}
                hideLabel
                label="Operator"
                onChange={(_, selected) => field.onChange(selected?.value)}
                options={wafMetadata?.custom_rules.condition_operator || []}
                value={selectedOption}
              />
            );
          }}
        />
      </Box>

      <Box sx={{ width: '40%' }}>
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

      <Box sx={{ width: '10%' }}>
        <Button buttonType="outlined" onClick={onRemove}>
          Remove
        </Button>
      </Box>
    </Stack>
  );
};
