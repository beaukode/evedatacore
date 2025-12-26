import React from "react";
import { Alert, Box, Button, LinearProgress, Tab, Tabs } from "@mui/material";
import Upload from "@mui/icons-material/Upload";
import Download from "@mui/icons-material/Download";
import { NavLink, useLocation } from "react-router";
import { Assembly, getAssemblyIdInventories } from "@/api/evedatacore-v2";
import {
  useMudWeb3,
  useSmartCharacter,
  useTypesIndex,
} from "@/contexts/AppContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import ItemInventoryForm from "@/components/ui/ItemInventoryForm";
import { giveItems, isSystemAllowed, takeItems } from "../lib/web3";
import { getSsuSystemId } from "../lib/utils";
import { Hex } from "viem";
import { Web3SuccessAlert } from "@/components/web3/Web3SuccessAlert";
import { Web3ErrorAlert } from "@/components/web3/Web3ErrorAlert";

interface InventoryProps {
  ssu: Assembly;
}

const Inventory: React.FC<InventoryProps> = ({ ssu }) => {
  const mudWeb3 = useMudWeb3();
  const smartCharacter = useSmartCharacter();
  const currentCharacter = smartCharacter.isConnected
    ? (smartCharacter.address.toLowerCase() as Hex)
    : undefined;
  const location = useLocation();

  const [userQuantities, setUserQuantities] = React.useState<
    Record<string, number>
  >({});
  const [mainQuantities, setMainQuantities] = React.useState<
    Record<string, number>
  >({});

  const currentTab = location.pathname.endsWith("/take") ? 1 : 0;

  const typesIndex = useTypesIndex();
  const query = useQuery({
    queryKey: ["SsuDapp", "SmartStorageInventory", ssu.id],
    queryFn: async () => {
      const r = await getAssemblyIdInventories({
        path: { id: ssu.id },
      });
      return r.data;
    },
  });

  const queryOnchainState = useQuery({
    queryKey: ["SsuDapp", "OnchainState", ssu.id],
    queryFn: async () => {
      if (!ssu.ownerId) {
        return { takeAllowed: false, isSameTribe: false };
      }
      if (!smartCharacter.isConnected || !smartCharacter.characterId) {
        return { takeAllowed: false, isSameTribe: false };
      }
      const [takeAllowed, ownerTribeId, currentTribeId] = await Promise.all([
        isSystemAllowed(mudWeb3, {
          ssuId: BigInt(ssu.id),
          ssuSystemId: getSsuSystemId(),
        }),
        mudWeb3.characterGetTribeId({
          smartObjectId: BigInt(ssu.ownerId),
        }),
        mudWeb3.characterGetTribeId({
          smartObjectId: BigInt(smartCharacter.characterId),
        }),
      ]);
      return {
        takeAllowed,
        isSameTribe:
          ownerTribeId && currentTribeId && ownerTribeId === currentTribeId,
      };
    },
  });

  const mainInventory = React.useMemo(() => {
    const main = query.data?.inventories?.["main"];
    if (!main || !typesIndex)
      return {
        capacity: "0",
        usedCapacity: "0",
        items: [],
      };
    return {
      capacity: main.capacity,
      usedCapacity: main.usedCapacity,
      items: typesIndex?.inventoryItemsToArray(main.items),
    };
  }, [query.data, typesIndex]);

  const userInventory = React.useMemo(() => {
    if (!currentCharacter)
      return {
        capacity: "0",
        usedCapacity: "0",
        items: [],
      };
    const inventory = query.data?.inventories?.[currentCharacter];
    if (!inventory || !typesIndex)
      return {
        capacity: "0",
        usedCapacity: "0",
        items: [],
      };
    return {
      capacity: inventory.capacity,
      usedCapacity: inventory.usedCapacity,
      items: typesIndex?.inventoryItemsToArray(inventory.items),
    };
  }, [query.data, typesIndex, currentCharacter]);

  const takeMutation = useMutation({
    mutationFn: async () => {
      if (!currentCharacter) {
        throw new Error("Please connect your wallet");
      }
      return takeItems(mudWeb3, {
        ssuId: BigInt(ssu.id),
        ssuSystemId: getSsuSystemId(),
        to: currentCharacter,
        transferts: Object.entries(mainQuantities).map(
          ([itemId, quantity]) => ({
            inventoryItemId: BigInt(itemId),
            quantity: BigInt(quantity),
          })
        ),
      });
    },
    onSuccess() {
      query.refetch();
      setMainQuantities({});
    },
    retry: false,
  });

  const giveMutation = useMutation({
    mutationFn: async () => {
      if (!currentCharacter) {
        throw new Error("Please connect your wallet");
      }
      return giveItems(mudWeb3, {
        ssuId: BigInt(ssu.id),
        ssuSystemId: getSsuSystemId(),
        from: currentCharacter,
        transferts: Object.entries(userQuantities).map(
          ([itemId, quantity]) => ({
            inventoryItemId: BigInt(itemId),
            quantity: BigInt(quantity),
          })
        ),
      });
    },
    onSuccess() {
      query.refetch();
      setUserQuantities({});
    },
    retry: false,
  });

  const isLoading =
    query.isLoading || !typesIndex || queryOnchainState.isLoading;

  if (queryOnchainState.data?.isSameTribe === false) {
    return (
      <Box p={2}>
        <Alert severity="error">Access is restricted to tribe members.</Alert>
      </Box>
    );
  }

  return (
    <>
      <Tabs value={currentTab} variant="fullWidth" scrollButtons>
        <Tab
          label="Give"
          component={NavLink}
          to={`/dapps/ssu-tribe/${ssu.id}`}
          disabled={isLoading}
        />
        <Tab
          label="Take"
          component={NavLink}
          to={`/dapps/ssu-tribe/${ssu.id}/take`}
          disabled={isLoading}
        />
      </Tabs>
      {currentTab === 0 && (
        <Box p={2}>
          <LinearProgress
            sx={{ visibility: isLoading ? "visible" : "hidden" }}
          />
          <ItemInventoryForm
            items={userInventory.items}
            quantities={userQuantities}
            onQuantityChange={(itemId, quantity) =>
              setUserQuantities({ ...userQuantities, [itemId]: quantity })
            }
            disabled={isLoading || giveMutation.isPending}
          />
          <Web3ErrorAlert sx={{ mt: 2 }} error={giveMutation.error} />
          <Web3SuccessAlert sx={{ mt: 2 }} receipt={giveMutation.data} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<Upload />}
              onClick={() => {
                takeMutation.reset();
                giveMutation.mutate();
              }}
              disabled={isLoading || takeMutation.isPending}
              loading={giveMutation.isPending}
            >
              Give items
            </Button>
          </Box>
        </Box>
      )}
      {currentTab === 1 && (
        <Box p={2}>
          <LinearProgress
            sx={{ visibility: isLoading ? "visible" : "hidden" }}
          />
          {queryOnchainState.data?.takeAllowed ? (
            <>
              <ItemInventoryForm
                items={mainInventory.items}
                quantities={mainQuantities}
                onQuantityChange={(itemId, quantity) =>
                  setMainQuantities({ ...mainQuantities, [itemId]: quantity })
                }
                disabled={isLoading || takeMutation.isPending}
              />
              <Web3ErrorAlert sx={{ mt: 2 }} error={takeMutation.error} />
              <Web3SuccessAlert sx={{ mt: 2 }} receipt={takeMutation.data} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Download />}
                  onClick={() => {
                    giveMutation.reset();
                    takeMutation.mutate();
                  }}
                  disabled={isLoading || giveMutation.isPending}
                  loading={takeMutation.isPending}
                >
                  Take items
                </Button>
              </Box>
            </>
          ) : (
            <Alert severity="error">
              The SSU owner do not allow you to take items.
            </Alert>
          )}
        </Box>
      )}
    </>
  );
};

export default Inventory;
