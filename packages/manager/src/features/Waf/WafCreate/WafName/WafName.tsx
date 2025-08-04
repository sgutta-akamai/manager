import { Box, Paper, TextField, Typography } from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { WafCreateForm } from 'src/features/Waf/utils';

export const WafName = () => {
  const { control } = useFormContext<WafCreateForm>();

  return (
    <Paper sx={{ marginBottom: '20px' }}>
      <Box alignItems="flex-start" display="flex" flexDirection="column">
        <Typography variant="h2">Name your WAF</Typography>
        <Controller
          control={control}
          name="label"
          render={({ field }) => (
            <TextField
              label="WAF Label"
              onChange={field.onChange}
              placeholder="WAF Label"
              sx={{ width: '462px' }}
              value={field.value}
            />
          )}
        />
      </Box>
    </Paper>
  );
};
