import React from "react";
import { Alert, Box, Button } from "@mui/material";
import InteractIcon from "@mui/icons-material/Settings";
import ContinueIcon from "@mui/icons-material/Send";
import { useMutation } from "@tanstack/react-query";
import { Web3SuccessAlert } from "@/components/web3/Web3SuccessAlert";
import { Web3ErrorAlert } from "@/components/web3/Web3ErrorAlert";
import { Assembly } from "@/api/evedatacore-v2";
import { useMudWeb3, usePushTrackingEvent } from "@/contexts/AppContext";
import { computeDappUrl } from "../lib/utils";
import { setupDappURL } from "../lib/web3";

interface SetupProps {
  ssu: Assembly;
}

const Setup: React.FC<SetupProps> = ({ ssu }) => {
  const pushTrackingEvent = usePushTrackingEvent();
  const mudWeb3 = useMudWeb3();

  const configureMutation = useMutation({
    mutationFn: async () => {
      const receipt = await setupDappURL(mudWeb3, {
        ssuId: BigInt(ssu.id),
        dappUrl: computeDappUrl(ssu.id),
      });
      // Wait 9 seconds to let the api cache expire
      await new Promise((resolve) => setTimeout(resolve, 9000));
      return receipt;
    },
    onSuccess() {
      pushTrackingEvent(`web3://dapp.ssu/setup`);
    },
    retry: false,
  });

  return (
    <Box p={2}>
      <Alert severity="info">
        <p style={{ marginTop: 0 }}>
          You need to configure your SSU to use this dApp.
        </p>
        <p>Click the button below to configure your SSU to set the dApp URL.</p>
      </Alert>
      <Web3ErrorAlert sx={{ mt: 2 }} error={configureMutation.error} />
      <Web3SuccessAlert sx={{ mt: 2 }} receipt={configureMutation.data} />
      {!configureMutation.isSuccess && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            onClick={() => configureMutation.mutate()}
            variant="contained"
            color="warning"
            loading={configureMutation.isPending}
            startIcon={<InteractIcon />}
          >
            Setup
          </Button>
        </Box>
      )}
      {configureMutation.isSuccess && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ContinueIcon />}
            onClick={() => {
              window.location.replace(computeDappUrl(ssu.id));
            }}
          >
            Continue
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Setup;
