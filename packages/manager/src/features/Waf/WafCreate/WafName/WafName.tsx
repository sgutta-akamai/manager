import { Box, Paper, TextField, Typography } from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { WafCreateForm } from 'src/features/Waf/utils';

export const WafName = () => {
  const { control } = useFormContext<WafCreateForm>();

  return (
    <Paper>
      <Box alignItems="flex-start" display="flex" flexDirection="column">
        <Typography variant="h2">
          {' '}
          Provide your WAF configuration label{' '}
        </Typography>
        <Controller
          control={control}
          name="label"
          render={({ field, fieldState }) => (
            <TextField
              errorText={fieldState.error?.message}
              label="WAF Label"
              onBlur={field.onBlur}
              onChange={field.onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              required
              sx={{ width: '462px' }}
              value={field.value}
            />
          )}
          rules={{ required: 'Label is required.' }}
        />
      </Box>
    </Paper>
  );
};
