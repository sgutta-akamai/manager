import { Box, CloseIcon, IconButton, Select, Stack } from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TagsInput } from 'src/components/TagsInput/TagsInput';
interface CustomRuleConditionProps {
  filterFields: string[];
  index: number;
  onRemove: () => void;
  operators: string[];
}

export const CustomRuleCondition = (props: CustomRuleConditionProps) => {
  const { filterFields, index, onRemove, operators } = props;
  //TODO: Add CreateCustomRulePayload interface
  const { control } = useFormContext<any>();

  const filterFieldOptions = React.useMemo(
    () => filterFields.map((f) => ({ label: f, value: f })),
    [filterFields]
  );

  const operatorOptions = React.useMemo(
    () => operators.map((o) => ({ label: o, value: o })),
    [operators]
  );

  return (
    <>
      <Stack alignItems="center" direction="row" marginY={2} spacing={1}>
        <Box sx={{ width: '40%' }}>
          <Controller
            control={control}
            name={`filters.0.conditions.${index}.field`}
            render={({ field, fieldState }) => (
              <Select
                errorText={fieldState.error?.message}
                hideLabel
                label="Field"
                onChange={(_, selected) => field.onChange(selected?.value)}
                options={filterFieldOptions}
                value={{
                  label: field.value,
                  value: field.value,
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ width: '20%' }}>
          <Controller
            control={control}
            name={`filters.0.conditions.${index}.operator`}
            render={({ field, fieldState }) => (
              <Select
                errorText={fieldState.error?.message}
                hideLabel
                label="Operator"
                onChange={(_, selected) => field.onChange(selected?.value)}
                options={operatorOptions}
                value={{
                  label: field.value,
                  value: field.value,
                }}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            alignItems: 'center',
            height: 'auto',
            minWidth: '40%',
          }}
        >
          <Controller
            control={control}
            name={`filters.0.conditions.${index}.values`}
            render={({ field, fieldState }) => (
              <TagsInput
                hideLabel
                label="Values"
                menuPlacement="bottom"
                onChange={(item) => field.onChange(item.map((i) => i.value))}
                tagError={fieldState.error?.message}
                value={
                  field.value?.map((tag: string) => ({
                    label: tag,
                    value: tag,
                  })) ?? []
                }
              />
            )}
          />
        </Box>

        <IconButton
          aria-label="Remove condition"
          color="primary"
          onClick={onRemove}
          size="large"
          sx={{ padding: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </>
  );
};
