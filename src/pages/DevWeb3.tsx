import React from "react";
import { Alert, Box, Button } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { chainId, worldAddress } from "@/constants";
import { Table, GetRecordOptions, getRecord } from "@latticexyz/store/internal";
import { Client } from "viem";
import { defineWorld } from "@latticexyz/world";
import { useClient } from "wagmi";

const eveworld = defineWorld({
  enums: {
    State: ["NULL", "UNANCHORED", "ANCHORED", "ONLINE", "DESTROYED"],
    SmartAssemblyType: ["SMART_STORAGE_UNIT", "SMART_TURRET", "SMART_GATE"],
    KillMailLossType: ["SHIP", "POD"],
  },
  userTypes: {
    ResourceId: {
      type: "bytes32",
      filePath: "@latticexyz/store/src/ResourceId.sol",
    },
  },
  namespaces: {
    eveworld: {
      tables: {
        DeployableState: {
          schema: {
            smartObjectId: "uint256",
            createdAt: "uint256",
            previousState: "State",
            currentState: "State",
            isValid: "bool",
            anchoredAt: "uint256",
            updatedBlockNumber: "uint256",
            updatedBlockTime: "uint256",
          },
          key: ["smartObjectId"],
        },
      },
    },
  },
});

// Extend the viem client with a custom method
function createClient(baseClient: Client) {
  return baseClient
    .extend((client) => ({
      async getRecord<table extends Table>(options: GetRecordOptions<table>) {
        return getRecord<table>(client, options);
      },
    }))
    .extend((client) => ({
      async getDeployableState(id: bigint) {
        return client.getRecord({
          address: worldAddress,
          table: eveworld.tables.eveworld__DeployableState,
          key: { smartObjectId: id },
        });
      },
    }));
}

const DevWeb3: React.FC = () => {
  const [result, setResult] = React.useState<unknown>();
  const [error, setError] = React.useState<unknown>();

  const client = useClient({ chainId });

  const worldClient = React.useMemo(() => {
    if (!client) {
      throw new Error(`Unable to retrieve Viem client for chain ${chainId}.`);
    }
    return createClient(client);
  }, [client]);

  const handleWeb3Click = () => {
    setError(undefined);
    setResult(undefined);
    worldClient
      .getDeployableState(
        14734588351472462921708363627364304419413383262236155234797503516055800569n // Smart assembly ID
      )
      .then(setResult)
      .catch(setError);
  };

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <PaperLevel1 title="Web3">
        <Button onClick={handleWeb3Click} variant="contained">
          Test
        </Button>
        {!!error && (
          <Alert severity="error">
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Alert>
        )}
        {!!result && (
          <pre>
            {JSON.stringify(
              result,
              (_, value) =>
                typeof value === "bigint" ? value.toString() : value,
              2
            )}
          </pre>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default DevWeb3;
