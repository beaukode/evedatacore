import React from "react";
import { Button, Skeleton } from "@mui/material";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "@latticexyz/config";
import { useMudWeb3 } from "@/contexts/AppContext";
import useAbiFields from "@/tools/useAbiFields";
import useValueChanged from "@/tools/useValueChanged";
import { TableRecordValues } from "@/tools/abi";
import BaseWeb3Dialog from "./BaseWeb3Dialog";

interface DialogTableRecordProps {
  title: string;
  table: Table;
  keyValues?: TableRecordValues<string>;
  owner: string;
  open: boolean;
  onClose: () => void;
}

const DialogTableRecord: React.FC<DialogTableRecordProps> = ({
  title,
  table,
  keyValues,
  owner,
  open,
  onClose,
}) => {
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
    retry: false,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    // <typeof defaultValues, any, z.infer<typeof validationSchema>>
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
    }
  }, open);

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
            {!mutateRecord.isSuccess && (
              <Button
                variant="contained"
                onClick={() => formRef.current?.requestSubmit()}
                loading={queryRecord.isLoading || mutateRecord.isPending}
              >
                Save
              </Button>
            )}
          </>
        }
        txError={mutateRecord.error}
        txReceipt={mutateRecord.data}
        disabledOwnerCheck
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit((v) => mutateRecord.mutate(v))}
        >
          {fields.map(({ key, label, abiType, FormComponent }) => {
            if (abiType.isArray) {
              return <div>Array type not supported</div>;
            }
            const isKey = table.key.includes(key);
            let helperText = "";
            if (!createRecord && isKey) {
              helperText = "Key fields cannot be modified";
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
                    disabled={
                      (isKey && !createRecord) ||
                      mutateRecord.isPending ||
                      mutateRecord.isSuccess
                    }
                  />
                )}
              </React.Fragment>
            );
          })}
        </form>
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogTableRecord);
