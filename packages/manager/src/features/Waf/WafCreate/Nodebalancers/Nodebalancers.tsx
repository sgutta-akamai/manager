import { WAFExclusionType } from '@linode/api-v4';
import { useAvailableWafDevicesInfiniteQuery } from '@linode/queries';
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
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import { TagsInput } from 'src/components/TagsInput/TagsInput';
import { WILDCARD_HOSTNAME } from 'src/features/Waf/utils';

import type { WAFDevice } from '@linode/api-v4';
import type { TagOption } from 'src/components/TagsInput/TagsInput';
import type { WafCreateForm } from 'src/features/Waf/utils';

export const Nodebalancers = () => {
  const { control, watch } = useFormContext<WafCreateForm>();
  const isAdjustProtectedResourcesEnabled = watch(
    'isAdjustProtectedResourcesEnabled'
  );

  const [open, setOpen] = React.useState(false);

  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useAvailableWafDevicesInfiniteQuery({}, open);

  const deviceOptions = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const handleHostnamesOnChange = (
    selected: TagOption[],
    field: ControllerRenderProps<WafCreateForm, 'hosts'>
  ) => {
    field.onChange(
      selected.map((item) => ({
        hostname: item.value,
        path: '',
        exclusionType: WAFExclusionType.EXCLUDED,
      }))
    );
  };

  const handlePathsOnChange = (
    selected: TagOption[],
    field: ControllerRenderProps<WafCreateForm, 'paths'>
  ) => {
    field.onChange(
      selected.map((item) => ({
        hostname: WILDCARD_HOSTNAME,
        path: item.value,
        exclusionType: WAFExclusionType.EXCLUDED,
      }))
    );
  };

  return (
    <Paper>
      <Box alignItems="flex-start" display="flex" flexDirection="column">
        <Typography variant="h2"> Associate NodeBalancers </Typography>
        <Typography sx={{ marginTop: '10px' }}>
          Select an existing NodeBalancer to associate with this configuration.
        </Typography>
        <Controller
          control={control}
          defaultValue={[]}
          name="devices"
          render={({ field }) => (
            <Autocomplete<WAFDevice, true>
              errorText={error?.[0]?.reason}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label=""
              loading={isFetching}
              multiple
              onChange={(_, selected) => field.onChange(selected)}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
              options={deviceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="NodeBalancers"
                  sx={{ width: '462px' }}
                />
              )}
              slotProps={{
                listbox: {
                  onScroll: (event: React.SyntheticEvent) => {
                    const listboxNode = event.currentTarget;
                    if (
                      listboxNode.scrollTop + listboxNode.clientHeight >=
                        listboxNode.scrollHeight &&
                      hasNextPage
                    ) {
                      fetchNextPage();
                    }
                  },
                },
              }}
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
              label="Define host and path exclusions"
              sx={{ marginTop: '10px' }}
            />
          )}
        />
        {isAdjustProtectedResourcesEnabled && (
          <>
            <Typography sx={{ marginTop: '10px' }}>
              By default, all hostnames and paths are selected and protected by
              this WAF configuration. You can choose to exclude specific
              hostnames or paths from protection as needed.
            </Typography>
            <Box sx={{ width: '462px' }}>
              <Controller
                control={control}
                name="hosts"
                render={({ field }) => (
                  <TagsInput
                    label="Exclude hostnames"
                    onChange={(selected) =>
                      handleHostnamesOnChange(selected, field)
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
                      handlePathsOnChange(selected, field)
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
