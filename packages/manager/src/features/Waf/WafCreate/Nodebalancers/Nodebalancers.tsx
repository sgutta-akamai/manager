import { useAvailableWafDevicesInfiniteQuery } from '@linode/queries';
import {
  Autocomplete,
  Box,
  Button,
  CloseIcon,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toggle,
  Typography,
} from '@linode/ui';
import * as React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import { TagsInput } from 'src/components/TagsInput/TagsInput';
import { MULTIPLE_HOSTNAMES_SELECTED_ERROR_MESSAGE } from 'src/features/Waf/utils';

import type { WAFDevice } from '@linode/api-v4';
import type { TagOption } from 'src/components/TagsInput/TagsInput';
import type { WafCreateForm } from 'src/features/Waf/utils';

interface HostnameError {
  indicesWithError: number[];
  message: string;
}

export const Nodebalancers = () => {
  const { control, watch, setError, clearErrors } =
    useFormContext<WafCreateForm>();
  const isAdjustProtectedResourcesEnabled = watch(
    'isAdjustProtectedResourcesEnabled'
  );
  const { fields, append, remove } = useFieldArray<WafCreateForm>({
    control,
    name: 'hosts',
  });

  const [open, setOpen] = React.useState(false);
  const [multipleHostnamesSelectedError, setMultipleHostnamesSelectedError] =
    React.useState<HostnameError>({
      indicesWithError: [],
      message: MULTIPLE_HOSTNAMES_SELECTED_ERROR_MESSAGE,
    });

  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useAvailableWafDevicesInfiniteQuery({}, open);

  const deviceOptions = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const handleAddHostname = () => {
    append({ hostname: [], paths: [] });
  };

  const handleRemoveHostname = (index: number) => {
    remove(index);
  };

  const setHostErrors = (selected: TagOption[], index: number) => {
    const hasMultipleHostnames: boolean = selected.length > 1;
    if (hasMultipleHostnames) {
      // add index to indicesWithError if not already present
      if (!multipleHostnamesSelectedError.indicesWithError.includes(index)) {
        setMultipleHostnamesSelectedError({
          indicesWithError: [
            ...multipleHostnamesSelectedError.indicesWithError,
            index,
          ],
          message: MULTIPLE_HOSTNAMES_SELECTED_ERROR_MESSAGE,
        });
      }
      setError('hosts', {
        type: 'manual',
        message: MULTIPLE_HOSTNAMES_SELECTED_ERROR_MESSAGE,
      });
    } else {
      const updatedIndices =
        multipleHostnamesSelectedError.indicesWithError?.filter(
          (i) => i !== index
        );
      setMultipleHostnamesSelectedError({
        indicesWithError: updatedIndices,
        message: MULTIPLE_HOSTNAMES_SELECTED_ERROR_MESSAGE,
      });
      if (updatedIndices.length === 0) {
        clearErrors('hosts');
      }
    }
  };

  return (
    <Paper>
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
                    if (value && fields.length === 0) {
                      append({ hostname: [], paths: [] });
                    }
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
            {fields.map((item, index) => (
              <Stack alignItems="center" flexDirection="row" key={item.id}>
                <Box sx={{ width: '462px' }}>
                  <Controller
                    control={control}
                    name={`hosts.${index}.hostname`}
                    render={({ field }) => (
                      <TagsInput
                        label="Hostname"
                        onChange={(selected) => {
                          field.onChange(selected.map((item) => item.value));
                          setHostErrors(selected, index);
                        }}
                        tagError={
                          multipleHostnamesSelectedError.indicesWithError.includes(
                            index
                          )
                            ? multipleHostnamesSelectedError.message
                            : ''
                        }
                        value={
                          field.value?.map((host) => ({
                            label: host,
                            value: host,
                          })) || []
                        }
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '462px' }}>
                  <Controller
                    control={control}
                    name={`hosts.${index}.paths`}
                    render={({ field }) => (
                      <TagsInput
                        label="Paths"
                        onChange={(selected) =>
                          field.onChange(selected.map((item) => item.value))
                        }
                        value={
                          field.value?.map((host) => ({
                            label: host,
                            value: host,
                          })) || []
                        }
                      />
                    )}
                  />
                </Box>
                {index > 0 && (
                  <IconButton
                    aria-label="Clear"
                    onClick={() => handleRemoveHostname(index)}
                    size="medium"
                    sx={{
                      height: 'fit-content',
                      position: 'relative',
                      top: '20px',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button
              buttonType="outlined"
              onClick={handleAddHostname}
              sx={{ marginTop: '16px' }}
            >
              Add A Hostname
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};
