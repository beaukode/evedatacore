import React from "react";
import { Box, Button, Skeleton } from "@mui/material";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "@latticexyz/config";
import { useMudWeb3, usePushTrackingEvent } from "@/contexts/AppContext";
import useAbiFields from "@/tools/useAbiFields";
import useValueChanged from "@/tools/useValueChanged";
import { TableRecordValues } from "@/tools/abi";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import ArrayOfFields from "../form/ArrayOfFields";

interface DialogTableRecordProps {
  table: Table;
  keyValues?: TableRecordValues<string>;
  owner: string;
  open: boolean;
  onClose: () => void;
}

const DialogTableRecord: React.FC<DialogTableRecordProps> = ({
  table,
  keyValues,
  owner,
  open,
  onClose,
}) => {
  const pushTrackingEvent = usePushTrackingEvent();
  const formRef = React.useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const mudWeb3 = useMudWeb3();

  const createRecord = keyValues === undefined;

  const {
    fields,
    validationSchema,
    defaultValues,
    initialValues,
    recordValuesToFormValues,
  } = useAbiFields(table.schema, keyValues);

  const queryKey = [
    "TableRecord",
    table.tableId,
    Object.entries(keyValues || {})
      .map((kv) => kv.join(":"))
      .join("|"),
  ];

  const queryRecord = useQuery({
    queryKey,
    queryFn: async () => {
      const keysToPick = table.key.reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, true>
      );
      const key = validationSchema
        .pick(keysToPick)
        .parse(recordValuesToFormValues(keyValues || {}));
      return mudWeb3.storeGetRecord({
        table,
        key,
      });
    },
    enabled: open && Boolean(keyValues),
  });

  const mutateRecord = useMutation({
    mutationFn: async (values: z.infer<typeof validationSchema>) => {
      if (createRecord) {
        const keysToPick = table.key.reduce(
          (acc, key) => {
            acc[key] = true;
            return acc;
          },
          {} as Record<string, true>
        );
        const key = validationSchema
          .pick(keysToPick)
          .parse(recordValuesToFormValues(values || {}));
        const existing = await mudWeb3.storeGetRecord({
          table,
          key,
        });

        if (existing) {
          throw new Error("A record with those keys already exists.");
        }
      }
      return mudWeb3.storeSetRecord({
        table,
        values: values,
      });
    },
    onSuccess() {
      pushTrackingEvent(`web3://tableRecord`);
    },
    retry: false,
  });

  const deleteRecord = useMutation({
    mutationFn: async () => {
      const keysToPick = table.key.reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, true>
      );
      const key = validationSchema
        .pick(keysToPick)
        .parse(recordValuesToFormValues(keyValues || {}));

      return mudWeb3.storeDeleteRecord({
        table,
        key,
      });
    },
    onSuccess() {
      pushTrackingEvent(`web3://tableRecordDelete`);
    },
    retry: false,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    control,
    reset,
    trigger,
  } = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
    values: initialValues,
  });

  React.useEffect(() => {
    if (queryRecord.data) {
      reset(recordValuesToFormValues(queryRecord.data));
    }
  }, [queryRecord.data, reset, recordValuesToFormValues]);

  useValueChanged((v) => {
    if (v) {
      queryClient.resetQueries({ queryKey: ["TableRecord"] });
      mutateRecord.reset();
      deleteRecord.reset();
    }
  }, open);

  const isLoading =
    queryRecord.isLoading || mutateRecord.isPending || deleteRecord.isPending;
  const mutationSuccess = mutateRecord.isSuccess || deleteRecord.isSuccess;
  const disableForm = isLoading || mutationSuccess;

  const headerActions = React.useMemo(() => {
    if (keyValues) {
      return (
        <Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => {
              deleteRecord.mutate();
            }}
            loading={deleteRecord.isPending}
            disabled={disableForm && !deleteRecord.isPending}
          >
            Delete record
          </Button>
        </Box>
      );
    }
    return;
  }, [deleteRecord, keyValues, disableForm]);

  const title = createRecord ? "Create table record" : "Edit table record";

  return (
    <>
      <BaseWeb3Dialog
        title={title}
        open={open}
        owner={owner}
        size="lg"
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
        actions={
          <>
            {!mutationSuccess && (
              <Button
                variant="contained"
                onClick={() => formRef.current?.requestSubmit()}
                loading={mutateRecord.isPending}
                disabled={disableForm && !mutateRecord.isPending}
              >
                Save
              </Button>
            )}
          </>
        }
        headerActions={headerActions}
        txError={mutateRecord.error || deleteRecord.error}
        txReceipt={mutateRecord.data || deleteRecord.data}
      >
        <div style={{ overflow: "auto", marginRight: -24, paddingRight: 12 }}>
          <form
            ref={formRef}
            onSubmit={handleSubmit((v) => mutateRecord.mutate(v))}
          >
            {fields.map(({ key, label, abiType, FormComponent }) => {
              const isKey = table.key.includes(key);
              let helperText = "";
              if (!createRecord && isKey) {
                helperText = "Key fields cannot be edited";
              }
              if (abiType.isArray) {
                return (
                  <React.Fragment key={key}>
                    {!isKey && queryRecord.isLoading && (
                      <Skeleton
                        variant="rounded"
                        sx={{ mt: 1, mb: 0.5 }}
                        height={48}
                      />
                    )}
                    {(isKey || !queryRecord.isLoading) && (
                      <>
                        {
                          <ArrayOfFields
                            control={control}
                            name={key}
                            label={label}
                            abiType={abiType}
                            formComponent={FormComponent}
                            disabled={(isKey && !createRecord) || disableForm}
                            onChange={() => {
                              if (isSubmitted) {
                                trigger(key);
                              }
                            }}
                          />
                        }
                      </>
                    )}
                  </React.Fragment>
                );
              }

              if (errors[key]?.message?.toString()) {
                helperText = errors[key]?.message?.toString();
              }
              return (
                <React.Fragment key={key}>
                  {!isKey && queryRecord.isLoading && (
                    <Skeleton
                      variant="rounded"
                      sx={{ mt: 1, mb: 0.5 }}
                      height={48}
                    />
                  )}
                  {(isKey || !queryRecord.isLoading) && (
                    <FormComponent
                      control={control}
                      name={key}
                      label={label}
                      abiType={abiType}
                      error={!!errors[key]}
                      helperText={helperText}
                      margin="dense"
                      disabled={(isKey && !createRecord) || disableForm}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </form>
        </div>
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogTableRecord);
