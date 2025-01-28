import React from "react";
import { Button, DialogContentText, Skeleton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Settings";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import { useMudWeb3 } from "@/contexts/AppContext";
import { smartAssemblyStates } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";

interface DialogOnOffAssemblyProps {
  assemblyId: string;
  owner: string;
  title: string;
  onClose?: () => void;
}

const DialogOnOffAssembly: React.FC<DialogOnOffAssemblyProps> = ({
  assemblyId,
  owner,
  title,
  onClose,
}) => {
  const openRef = React.useRef(false);
  const [open, setOpen] = React.useState(false);
  const [mount, setMount] = React.useState(false);
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

  React.useEffect(() => {
    if (openRef.current !== open) {
      openRef.current = open;
      if (open) {
        setMount(true);
        mutateState.reset();
      }
    }
  }, [open, mutateState]);

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
      <Button
        color="warning"
        variant="contained"
        size="small"
        title="Edit assembly state"
        onClick={() => {
          setOpen(true);
        }}
        sx={{ minWidth: 0 }}
      >
        <EditIcon fontSize="small" style={{ marginRight: 0 }} />
      </Button>
      {mount && (
        <BaseWeb3Dialog
          title={title}
          open={open}
          owner={owner}
          onClose={() => {
            setOpen(false);
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
            {stateText ? (
              <Typography color="primary" component="span">
                {stateText}
              </Typography>
            ) : (
              <Skeleton width={60} sx={{ display: "inline-block" }} />
            )}
          </DialogContentText>
        </BaseWeb3Dialog>
      )}
    </>
  );
};

export default React.memo(DialogOnOffAssembly);
