import React from "react";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Hex } from "viem";
import { useTypesIndex } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";
import DialogTransfertItems from "./dialogs/DialogTransfertItems";
import ConditionalMount from "./ui/ConditionalMount";
import ItemInventory from "./ui/ItemInventory";
import ButtonCharacter from "./buttons/ButtonCharacter";
import { getAssemblyIdInventories } from "@/api/evedatacore-v2";

interface SmartStorageInventoryProps {
  id: string;
  owner: Hex;
}

type SelectedInventory = {
  owner: Hex;
  type: "inventory" | "ephemeral";
};

const SmartStorageInventory: React.FC<SmartStorageInventoryProps> = ({
  id,
  owner,
}) => {
  const [transfertItemsOpen, setTransfertItemsOpen] = React.useState(false);
  const [selectedInventory, setSelectedInventory] =
    React.useState<SelectedInventory>();
  const typesIndex = useTypesIndex();
  const query = useQuery({
    queryKey: ["SmartStorageInventory", id],
    queryFn: async () => {
      const r = await getAssemblyIdInventories({
        path: { id },
      });
      return r.data;
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

  const inventories = React.useMemo(() => {
    if (!query.data || !typesIndex) return [];
    return Object.entries(query.data.inventories || {})
      .map(([key, value]) => {
        if (key === "main") return undefined;
        return {
          account: key as Hex,
          ...value,
          items: typesIndex?.inventoryItemsToArray(value.items),
        };
      })
      .filter((i) => i !== undefined);
  }, [query.data, typesIndex]);

  const storageUsers = React.useMemo(() => {
    if (!query.data) return [];
    return [owner, ...Object.keys(query.data.inventories || {})] as Hex[];
  }, [owner, query.data]);

  const dialogTitle = React.useMemo(() => {
    if (!selectedInventory) return "";
    if (selectedInventory.type === "inventory")
      return "Transfer items to user storage";
    return "Transfer items to assembly storage";
  }, [selectedInventory]);

  const data = query.data;

  return (
    <>
      <PaperLevel1
        title="Storage"
        loading={query.isFetching || !typesIndex}
        sx={{ pt: 0 }}
      >
        {data && (
          <>
            <ConditionalMount mount={transfertItemsOpen} keepMounted>
              <DialogTransfertItems
                storageId={id}
                open={transfertItemsOpen}
                owner={selectedInventory?.owner || "0x"}
                transfertFrom={selectedInventory?.type || "inventory"}
                storageUsers={storageUsers}
                title={dialogTitle}
                onClose={() => {
                  setTransfertItemsOpen(false);
                  query.refetch();
                }}
              />
            </ConditionalMount>
            <ItemInventory
              inventory={mainInventory}
              header={
                <ButtonWeb3Interaction
                  title="Item transfer"
                  onClick={() => {
                    setSelectedInventory({ owner, type: "inventory" });
                    setTransfertItemsOpen(true);
                  }}
                />
              }
            />
          </>
        )}
      </PaperLevel1>
      <PaperLevel1
        title="Users storage"
        loading={query.isFetching || !typesIndex}
        sx={{ pt: inventories && inventories.length > 0 ? 0 : undefined }}
      >
        {inventories && inventories.length === 0 && (
          <Typography variant="body1">None</Typography>
        )}
        {inventories &&
          inventories.map((inv) => (
            <Box key={inv.ownerId} sx={{ mb: 2 }}>
              <ItemInventory
                inventory={inv}
                header={
                  <>
                    <ButtonCharacter
                      address={inv.ownerId}
                      name={inv.ownerName}
                    />
                    <ButtonWeb3Interaction
                      title="Item transfer"
                      onClick={() => {
                        setSelectedInventory({
                          owner: inv.account,
                          type: "ephemeral",
                        });
                        setTransfertItemsOpen(true);
                      }}
                    />
                  </>
                }
              />
            </Box>
          ))}
      </PaperLevel1>
    </>
  );
};

export default SmartStorageInventory;
