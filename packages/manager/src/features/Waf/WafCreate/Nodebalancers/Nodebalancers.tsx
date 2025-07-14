import {
  Autocomplete,
  Box,
  FormControlLabel,
  Paper,
  TextField,
  Toggle,
  Typography,
} from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TagsInput } from 'src/components/TagsInput/TagsInput';
import { Device, WafCreateForm } from 'src/features/Waf/utils';

export const Nodebalancers = () => {
  const { control } = useFormContext<WafCreateForm>();
  const [
    isAdjustProtectedResourcesEnabled,
    setIsAdjustProtectedResourcesEnabled,
  ] = React.useState<boolean>(false);

  const handleAdjustProtectResourcesChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => {
    setIsAdjustProtectedResourcesEnabled(value);
  };

  const deviceOptions: Device[] = [
    { id: '1', label: 'NodeBalancer 1', type: 'nodebalancer' },
    { id: '2', label: 'NodeBalancer 2', type: 'nodebalancer' },
  ];

  return (
    <Paper sx={{ marginBottom: '20px' }}>
      <Box alignItems="flex-start" display="flex" flexDirection="column">
        <Typography variant="h2">Assign NodeBalancers</Typography>
        <Typography sx={{ marginTop: '10px' }}>
          Select an existing NodeBalancer to associate with this WAF
          configuration.
        </Typography>
        <Controller
          control={control}
          defaultValue={[]}
          name="devices"
          render={({ field }) => (
            <Autocomplete<Device, true>
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label=""
              multiple
              onChange={(_, selected) => field.onChange(selected)}
              options={deviceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="NodeBalancers"
                  sx={{ width: '462px' }}
                />
              )}
              value={field.value || []}
            />
          )}
        />
        <FormControlLabel
          control={
            <Toggle
              checked={isAdjustProtectedResourcesEnabled}
              onChange={handleAdjustProtectResourcesChanged}
            />
          }
          label="Adjust protected resources"
          sx={{ marginTop: '10px' }}
        ></FormControlLabel>
        {isAdjustProtectedResourcesEnabled && (
          <>
            <Typography sx={{ marginTop: '10px' }}>
              By default, all hostnames and paths are selected and protected by
              this WAF. You can choose to exclude specific hostnames or paths
              from protection as needed.
            </Typography>
            <Controller
              control={control}
              name="hosts"
              render={({ field }) => (
                <TagsInput
                  disableOptions={true}
                  label="Exclude Hostnames"
                  onChange={(selected) =>
                    field.onChange(
                      selected.map((item) => ({
                        hostname: item.value,
                        path: item.value,
                        type: 'exclude',
                      }))
                    )
                  }
                  value={
                    field.value?.map((host) => ({
                      label: host.hostname,
                      value: host.hostname,
                    })) || []
                  }
                />
              )}
            />
          </>
        )}
      </Box>
    </Paper>
  );
};
