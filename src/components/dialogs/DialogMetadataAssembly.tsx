import React from "react";
import {
  Button,
  DialogContentText,
  Grid2,
  Skeleton,
  TextField,
} from "@mui/material";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import { useMudWeb3 } from "@/contexts/AppContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import useValueChanged from "@/tools/useValueChanged";

interface DialogMetadataAssemblyProps {
  assemblyId: string;
  owner: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

const DialogMetadataAssembly: React.FC<DialogMetadataAssemblyProps> = ({
  assemblyId,
  owner,
  open,
  title,
  onClose,
}) => {
  const [{ name, dappURL, description }, setMetaData] = React.useState({
    name: "",
    dappURL: "",
    description: "",
  });
  const mudWeb3 = useMudWeb3();

  const queryMetadata = useQuery({
    queryKey: ["SmartAssemblyMetadata", assemblyId],
    queryFn: async () =>
      mudWeb3.assemblyGetMetadata({ assemblyId: BigInt(assemblyId) }),
    enabled: open,
  });

  const mutateState = useMutation({
    mutationFn: () => {
      return mudWeb3.assemblySetMetadata({
        assemblyId: BigInt(assemblyId),
        name,
        dappURL,
        description,
      });
    },
    retry: false,
  });

  useValueChanged((v) => {
    if (v) {
      queryMetadata.refetch();
      mutateState.reset();
    }
  }, open);

  React.useEffect(() => {
    if (queryMetadata.data) {
      setMetaData(queryMetadata.data);
    }
  }, [queryMetadata.data]);

  const isLoading = queryMetadata.isFetching || mutateState.isPending;

  return (
    <>
      <BaseWeb3Dialog
        title={title}
        open={open}
        owner={owner}
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
        actions={
          <>
            {!mutateState.isSuccess && (
              <Button
                variant="contained"
                onClick={() => mutateState.mutate()}
                loading={isLoading}
              >
                Save
              </Button>
            )}
          </>
        }
        txError={mutateState.error}
        txReceipt={mutateState.data}
        disabledOwnerCheck
      >
        <DialogContentText component="div" gutterBottom>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              {queryMetadata.isFetching ? (
                <Skeleton variant="rounded" sx={{ mt: 2 }} height={32} />
              ) : (
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => {
                    setMetaData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  disabled={mutateState.isPending || mutateState.isSuccess}
                  fullWidth
                />
              )}
            </Grid2>
            <Grid2 size={12}>
              {queryMetadata.isFetching ? (
                <Skeleton variant="rounded" sx={{ mt: 2 }} height={32} />
              ) : (
                <TextField
                  label="Dapp Url"
                  value={dappURL}
                  onChange={(e) => {
                    setMetaData((prev) => ({
                      ...prev,
                      dappURL: e.target.value,
                    }));
                  }}
                  disabled={mutateState.isPending || mutateState.isSuccess}
                  fullWidth
                />
              )}
            </Grid2>
            <Grid2 size={12}>
              {queryMetadata.isFetching ? (
                <Skeleton variant="rounded" sx={{ mt: 2 }} height={193} />
              ) : (
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => {
                    setMetaData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                  disabled={mutateState.isPending || mutateState.isSuccess}
                  rows={8}
                  multiline
                  fullWidth
                />
              )}
            </Grid2>
          </Grid2>
        </DialogContentText>
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogMetadataAssembly);
