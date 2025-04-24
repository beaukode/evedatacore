import React from "react";
import { Alert, Box, Button } from "@mui/material";
import InteractIcon from "@mui/icons-material/Settings";
import ContinueIcon from "@mui/icons-material/Send";
import { useMutation } from "@tanstack/react-query";
import { Gate } from "@shared/mudsql";
import { useMudWeb3, usePushTrackingEvent } from "@/contexts/AppContext";
import { Web3ErrorAlert } from "@/components/web3/Web3ErrorAlert";
import { Web3SuccessAlert } from "@/components/web3/Web3SuccessAlert";
import { setupGate } from "../lib/setupGate";
import { getDappUrl, getAccessSystemId, getConfigSystemId } from "../lib/utils";

interface SetupProps {
  gate: Gate;
  onSuccess: () => void;
}

const Setup: React.FC<SetupProps> = ({ gate, onSuccess }) => {
  const pushTrackingEvent = usePushTrackingEvent();
  const mudWeb3 = useMudWeb3();

  const mutation = useMutation({
    mutationFn: () =>
      setupGate(mudWeb3, {
        gateId: BigInt(gate.id),
        dappUrl: getDappUrl(),
        accessSystemId: getAccessSystemId(),
        configSystemId: getConfigSystemId(),
      }),
    onSuccess() {
      pushTrackingEvent(`web3://dapp.gates/setup`);
    },
    retry: false,
  });

  return (
    <>
      {mutation.isIdle && (
        <Alert severity="info">
          To manage access to this gate, you need to setup your gate to use the
          DApp and the MUD system.
        </Alert>
      )}
      <Web3ErrorAlert error={mutation.error} />
      <Web3SuccessAlert receipt={mutation.data} />
      <Box display="flex" justifyContent="center" mt={2}>
        {!mutation.isSuccess && (
          <Button
            onClick={() => mutation.mutate()}
            variant="contained"
            color="warning"
            loading={mutation.isPending}
            startIcon={<InteractIcon />}
          >
            Setup
          </Button>
        )}
        {mutation.isSuccess && (
          <Button
            variant="contained"
            color="primary"
            endIcon={<ContinueIcon />}
            onClick={onSuccess}
          >
            Continue
          </Button>
        )}
      </Box>
    </>
  );
};

export default Setup;
