import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
} from "@mui/material";
import ContinueIcon from "@mui/icons-material/Send";
import DisableIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Web3SuccessAlert } from "@/components/web3/Web3SuccessAlert";
import { Web3ErrorAlert } from "@/components/web3/Web3ErrorAlert";
import { Assembly } from "@/api/evedatacore-v2";
import { useMudWeb3, usePushTrackingEvent } from "@/contexts/AppContext";
import { getDappUrl, getSsuSystemId } from "../lib/utils";
import {
  getContractAddress,
  isSystemAllowed,
  setupDappURL,
  setupDelegation,
} from "../lib/web3";

interface ConfigureProps {
  ssu: Assembly;
}

const Configure: React.FC<ConfigureProps> = ({ ssu }) => {
  const [allow, setAllow] = React.useState<"put" | "take">();
  const pushTrackingEvent = usePushTrackingEvent();
  const mudWeb3 = useMudWeb3();

  const queryOnchainState = useQuery({
    queryKey: ["SsuDapp", "OnchainState", ssu.id],
    queryFn: async () => {
      const isAllowed = await isSystemAllowed(mudWeb3, {
        ssuId: BigInt(ssu.id),
        ssuSystemId: getSsuSystemId(),
      });
      return isAllowed ? "take" : "put";
    },
  });

  React.useEffect(() => {
    if (queryOnchainState.isSuccess) {
      setAllow(queryOnchainState.data);
    }
  }, [queryOnchainState.isSuccess, queryOnchainState.data]);

  const updateMutation = useMutation({
    mutationFn: async (allow: boolean) => {
      const contractAddress = await getContractAddress(mudWeb3, {
        ssuSystemId: getSsuSystemId(),
      });
      const receipt = await setupDelegation(mudWeb3, {
        ssuId: BigInt(ssu.id),
        allow,
        contractAddress,
      });

      return receipt;
    },
    onSuccess(_, allow) {
      queryOnchainState.refetch();
      pushTrackingEvent(`web3://dapp.ssu/take.${allow ? "allow" : "revoke"}`);
    },
    retry: false,
  });

  const uninstallMutation = useMutation({
    mutationFn: async () => {
      return setupDappURL(mudWeb3, {
        ssuId: BigInt(ssu.id),
        dappUrl: getDappUrl(),
      });
    },
    onSuccess() {
      pushTrackingEvent(`web3://dapp.ssu/uninstall`);
    },
    retry: false,
  });

  if (allow === undefined) {
    return (
      <Box p={2}>
        <LinearProgress />
      </Box>
    );
  }

  console.log(queryOnchainState.data, allow, queryOnchainState.data === allow);

  return (
    <Box p={2}>
      <FormControl>
        <FormLabel id="group-label">Tribes members are allowed to:</FormLabel>
        <RadioGroup
          aria-labelledby="group-label"
          value={allow}
          onChange={(e) => {
            setAllow(e.target.value as "put" | "take");
          }}
        >
          <FormControlLabel
            value="put"
            control={<Radio />}
            label="Put items into your inventory"
            disabled={
              uninstallMutation.isPending ||
              updateMutation.isPending ||
              uninstallMutation.isSuccess
            }
          />
          <FormControlLabel
            value="take"
            control={<Radio />}
            label="Take & put items from your inventory"
            disabled={
              uninstallMutation.isPending ||
              updateMutation.isPending ||
              uninstallMutation.isSuccess
            }
          />
        </RadioGroup>
      </FormControl>
      <Web3ErrorAlert sx={{ mt: 2 }} error={uninstallMutation.error} />
      <Web3SuccessAlert sx={{ mt: 2 }} receipt={uninstallMutation.data} />
      <Web3ErrorAlert sx={{ mt: 2 }} error={updateMutation.error} />
      <Web3SuccessAlert sx={{ mt: 2 }} receipt={updateMutation.data} />
      {!uninstallMutation.isSuccess && (
        <>
          <Box sx={{ display: "flex", mt: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<SaveIcon />}
              onClick={() => {
                uninstallMutation.reset();
                updateMutation.mutate(allow === "take");
              }}
              loading={updateMutation.isPending}
              disabled={queryOnchainState.data === allow}
            >
              Save
            </Button>
          </Box>
          {queryOnchainState.data === "put" && (
            <Box sx={{ display: "flex", mt: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DisableIcon />}
                loading={uninstallMutation.isPending}
                disabled={updateMutation.isPending}
                onClick={() => {
                  updateMutation.reset();
                  uninstallMutation.mutate();
                }}
              >
                Uninstall
              </Button>
            </Box>
          )}
        </>
      )}
      {uninstallMutation.isSuccess && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ContinueIcon />}
            onClick={() => {
              window.location.replace(getDappUrl());
            }}
          >
            Continue
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Configure;
