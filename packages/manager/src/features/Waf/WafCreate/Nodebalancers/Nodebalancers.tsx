import { Autocomplete, Box, Paper, TextField, Typography } from '@linode/ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// import {TagsInput} from "src/components/TagsInput/TagsInput";
import { Device, WafCreateForm } from 'src/features/Waf/utils';

export const Nodebalancers = () => {
  const { control } = useFormContext<WafCreateForm>();

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
        <Typography sx={{ marginTop: '20px' }}>
          By default, all hostnames and paths are selected and protected by this
          WAF. You can choose to exclude specific hostnames or paths from
          protection as needed.
        </Typography>
        {/*<Controller*/}
        {/*  control={control}*/}
        {/*  name="hosts"*/}
        {/*  render={({ field }) => (*/}
        {/*    <TagsInput<Host>*/}
        {/*      disableOptions={true}*/}
        {/*      label="Exclude Hostnames"*/}
        {/*      onChange={(selected) => field.onChange(*/}
        {/*        selected.map(item => ({*/}
        {/*          hostname: item.value,*/}
        {/*          path: item.value,*/}
        {/*          type: 'exclude'*/}
        {/*        }))*/}
        {/*      )}*/}
        {/*      sx={{width: '462px'}}*/}
        {/*      value={field.value?.map(host => ({*/}
        {/*        label: host.hostname,*/}
        {/*        value: host.hostname*/}
        {/*      })) || []}*/}
        {/*    />*/}
        {/*    )}*/}
        {/*/>*/}
      </Box>
    </Paper>
  );
};
