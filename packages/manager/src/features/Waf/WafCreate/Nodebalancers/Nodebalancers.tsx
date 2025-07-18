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
import {
  Device,
  PathType,
  WafCreateForm,
  WILDCARD_HOSTNAME,
} from 'src/features/Waf/utils';

export const Nodebalancers = () => {
  const { control, watch } = useFormContext<WafCreateForm>();
  const isAdjustProtectedResourcesEnabled = watch(
    'isAdjustProtectedResourcesEnabled'
  );
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
        <Controller
          control={control}
          name="isAdjustProtectedResourcesEnabled"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Toggle
                  checked={field.value}
                  onChange={(_, value) => {
                    field.onChange(value);
                  }}
                />
              }
              label="Adjust protected resources"
              sx={{ marginTop: '10px' }}
            />
          )}
        />
        {isAdjustProtectedResourcesEnabled && (
          <>
            <Typography sx={{ marginTop: '10px' }}>
              By default, all hostnames and paths are selected and protected by
              this WAF. You can choose to exclude specific hostnames or paths
              from protection as needed.
            </Typography>
            <Box sx={{ width: '462px' }}>
              <Controller
                control={control}
                name="hosts"
                render={({ field }) => (
                  <TagsInput
                    label="Exclude hostnames"
                    onChange={(selected) =>
                      field.onChange(
                        selected.map((item) => ({
                          hostname: item.value,
                          path: '',
                          type: PathType.EXCLUDE,
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
            </Box>
            <Box sx={{ width: '462px' }}>
              <Controller
                control={control}
                name="paths"
                render={({ field }) => (
                  <TagsInput
                    label="Exclude paths"
                    onChange={(selected) =>
                      field.onChange(
                        selected.map((item) => ({
                          hostname: WILDCARD_HOSTNAME,
                          path: item.value,
                          type: PathType.EXCLUDE,
                        }))
                      )
                    }
                    value={
                      field.value?.map((host) => ({
                        label: host.path,
                        value: host.path,
                      })) || []
                    }
                  />
                )}
              />
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};
