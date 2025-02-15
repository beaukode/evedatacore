import React from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FilterOptionsState,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Hex } from "viem";
import { useMutation, useQuery } from "@tanstack/react-query";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import { useMudSql, useMudWeb3 } from "@/contexts/AppContext";
import useValueChanged from "@/tools/useValueChanged";
import { Character } from "@/api/mudsql";
import { filterInProps, shorten } from "@/tools";
import { InventoryItemTransfert } from "@/api/mudweb3";
import ItemInventoryForm from "../ui/ItemInventoryForm";

interface DialogTransfertItemsProps {
  storageId: string;
  owner: Hex;
  storageUsers: Hex[];
  transfertFrom: "inventory" | "ephemeral";
  title: string;
  open: boolean;
  onClose: () => void;
}

type CharacterWithGroup = Character & { group: string };

const MAX_RESULTS = 500;
function filterOptions(
  options: CharacterWithGroup[],
  state: FilterOptionsState<CharacterWithGroup>
) {
  const filtered = filterInProps(options, state.inputValue, [
    "name",
    "address",
  ]);

  const limitedResults = filtered.slice(0, MAX_RESULTS);

  if (filtered.length > MAX_RESULTS) {
    limitedResults.push({
      address: "0x",
      name: "There are more results, be more specific",
      corpId: 0,
      group: "",
      id: "",
      createdAt: 0,
    });
  }

  return limitedResults;
}

const DialogTransfertItems: React.FC<DialogTransfertItemsProps> = ({
  storageId,
  owner,
  storageUsers,
  transfertFrom,
  title,
  open,
  onClose,
}) => {
  const [character, setCharacter] = React.useState<CharacterWithGroup | null>(
    null
  );
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    {}
  );
  const mudSql = useMudSql();
  const mudWeb3 = useMudWeb3();

  const queryKey =
    transfertFrom === "inventory"
      ? ["SmartStorageInventory", storageId]
      : ["SmartStorageUserInventory", storageId, owner];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (transfertFrom === "inventory") {
        return mudSql.getStorageInventory(storageId);
      } else {
        return mudSql.getUserInventory(storageId, owner);
      }
    },
  });

  const queryCharacters = useQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async () => mudSql.listCharacters(),
    enabled: transfertFrom === "inventory",
  });

  const characters = React.useMemo(() => {
    if (!queryCharacters.data) return [];
    const known: CharacterWithGroup[] = [];
    const others: CharacterWithGroup[] = [];

    for (const c of queryCharacters.data) {
      if (c.address === "0x0000000000000000000000000000000000000000") continue;
      if (storageUsers.includes(c.address)) {
        known.push({ ...c, group: "Storage users" });
      } else {
        others.push({ ...c, group: "Other users" });
      }
    }
    return [...known, ...others];
  }, [storageUsers, queryCharacters.data]);

  const mutate = useMutation({
    mutationFn: () => {
      const transferts = Object.entries(quantities).reduce(
        (acc, [inventoryItemId, quantity]) => {
          if (quantity > 0) {
            acc.push({
              inventoryItemId: BigInt(inventoryItemId),
              quantity: BigInt(quantity),
            });
          }
          return acc;
        },
        [] as InventoryItemTransfert[]
      );

      if (transferts.length === 0) {
        throw new Error("Please select at least one item to transfer");
      }

      if (transfertFrom === "inventory") {
        if (!character) {
          throw new Error("Please select a character");
        }

        return mudWeb3.storageInventoryToEphemeral({
          storageId: BigInt(storageId),
          to: character.address,
          transferts,
        });
      } else {
        return mudWeb3.storageEphemeralToInventory({
          storageId: BigInt(storageId),
          transferts,
        });
      }
    },
    onSuccess() {
      query.refetch();
      setQuantities({});
    },
    retry: false,
  });

  useValueChanged((v) => {
    if (v) {
      query.refetch().then(() => {
        setQuantities({});
      });
      mutate.reset();
    }
  }, open);

  const isLoading = query.isFetching || queryCharacters.isFetching;

  return (
    <>
      <BaseWeb3Dialog
        title={title}
        open={open}
        owner={owner}
        size="md"
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
        actions={
          <Button
            variant="contained"
            onClick={() => mutate.mutate()}
            loading={isLoading || mutate.isPending}
          >
            Transfert
          </Button>
        }
        txError={mutate.error}
        txReceipt={mutate.data}
      >
        <LinearProgress
          sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
        />
        {query.data && (
          <Box mb={2}>
            <ItemInventoryForm
              inventory={query.data}
              quantities={quantities}
              onQuantityChange={(itemId, quantity) =>
                setQuantities({ ...quantities, [itemId]: quantity })
              }
              disabled={isLoading || mutate.isPending}
            />
          </Box>
        )}
        {transfertFrom === "inventory" && (
          <>
            <Autocomplete
              options={characters}
              value={character}
              getOptionLabel={(c) =>
                `${c.name} [Corp: ${c.corpId}] ${shorten(c.address)}`
              }
              groupBy={(option) => option.group}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, newValue) => setCharacter(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="To character" />
              )}
              getOptionDisabled={(c) => c.id === ""}
              renderOption={(props, c) => (
                <li
                  {...props}
                  key={c.id}
                  style={{
                    fontStyle: c.id === "" ? "italic" : "normal",
                  }}
                >
                  {c.id === ""
                    ? `${c.name}`
                    : `${c.name} [Corp: ${c.corpId}] ${shorten(c.address)}`}
                </li>
              )}
              disabled={isLoading || mutate.isPending}
              filterOptions={filterOptions}
              openOnFocus
              fullWidth
            />
            <Alert severity="warning" sx={{ mt: 2 }}>
              Double check the receiver before transferring items, this action
              is irreversible.
              <br />
              To get the item back the receiver will have to transfer it back to
              you.
            </Alert>
          </>
        )}
        {transfertFrom === "ephemeral" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Double check before transferring items, this action is irreversible.
            <br />
            To get the item back the storage owner will have to transfer it back
            to you.
          </Alert>
        )}
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogTransfertItems);
