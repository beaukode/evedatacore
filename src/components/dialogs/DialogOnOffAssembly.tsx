import React from "react";
import { Button, DialogContentText, Skeleton, Typography } from "@mui/material";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import { useMudWeb3 } from "@/contexts/AppContext";
import { smartAssemblyStates } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import useValueChanged from "@/tools/useValueChanged";

interface DialogOnOffAssemblyProps {
  assemblyId: string;
  owner: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

const DialogOnOffAssembly: React.FC<DialogOnOffAssemblyProps> = ({
  assemblyId,
  owner,
  title,
  open,
  onClose,
}) => {
  const mudWeb3 = useMudWeb3();

  const queryState = useQuery({
    queryKey: ["SmartAssemblyState", assemblyId],
    queryFn: async () =>
      mudWeb3
        .getDeployableState(BigInt(assemblyId))
        .then(({ currentState }) => currentState),
    enabled: open,
  });

  const mutateState = useMutation({
    mutationFn: (online: boolean) => {
      if (!mudWeb3.wallet) {
        throw new Error("Wallet error, please refresh the page and try again");
      }
      if (online) {
        return mudWeb3.wallet.bringOnline(BigInt(assemblyId));
      } else {
        return mudWeb3.wallet.bringOffline(BigInt(assemblyId));
      }
    },
    onSettled() {
      queryState.refetch();
    },
    retry: false,
  });

  useValueChanged((v) => {
    if (v) {
      queryState.refetch();
      mutateState.reset();
    }
  }, open);

  const stateText = React.useMemo(() => {
    if (queryState.isFetching || queryState.data === undefined) return "";
    const text =
      smartAssemblyStates[
        queryState.data as keyof typeof smartAssemblyStates
      ] || "Unknown";
    return `${text} [${queryState.data}]`;
  }, [queryState.data, queryState.isFetching]);

  const isLoading = queryState.isFetching || mutateState.isPending;

  const actionButton = React.useMemo(() => {
    if (queryState.data === 2) {
      return (
        <Button
          variant="contained"
          onClick={() => mutateState.mutate(true)}
          loading={isLoading}
        >
          Bring online
        </Button>
      );
    } else if (queryState.data === 3) {
      return (
        <Button
          variant="contained"
          onClick={() => mutateState.mutate(false)}
          loading={isLoading}
        >
          Bring offline
        </Button>
      );
    } else if (queryState.data === undefined) {
      return (
        <Button variant="contained" loading>
          Loading...
        </Button>
      );
    } else {
      return (
        <Button variant="contained" disabled>
          Bring online
        </Button>
      );
    }
  }, [queryState.data, mutateState, isLoading]);

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
        actions={actionButton}
        txError={mutateState.error}
        txReceipt={mutateState.data}
      >
        <DialogContentText gutterBottom>
          Current state is:{" "}
          {queryState.isFetching ? (
            <Skeleton width={60} sx={{ display: "inline-block" }} />
          ) : (
            <Typography color="primary" component="span">
              {stateText}
            </Typography>
          )}
        </DialogContentText>
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogOnOffAssembly);
