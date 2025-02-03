import React from "react";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Hex } from "viem";
import { useMudSql, useTypesIndex } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";
import DialogTransfertItems from "./dialogs/DialogTransfertItems";
import ConditionalMount from "./ui/ConditionalMount";
import ItemInventory from "./ui/ItemInventory";
import ButtonCharacter from "./buttons/ButtonCharacter";

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
  const mudSql = useMudSql();
  const typesIndex = useTypesIndex(); // Only used for loading

  const query = useQuery({
    queryKey: ["SmartStorageInventory", id],
    queryFn: async () => mudSql.getStorageInventory(id),
  });

  const queryUsers = useQuery({
    queryKey: ["SmartStorageUsersInventories", id],
    queryFn: async () => mudSql.listStorageUsersInventory(id),
  });

  const storageUsers = React.useMemo(() => {
    if (!queryUsers.data) return [];
    return [owner, ...queryUsers.data.map((inv) => inv.ownerId)];
  }, [owner, queryUsers.data]);

  const dialogTitle = React.useMemo(() => {
    if (!selectedInventory) return "";
    if (selectedInventory.type === "inventory")
      return "Transfer items to user storage";
    return "Transfer items to assembly storage";
  }, [selectedInventory]);

  const data = query.data;
  const inventories = queryUsers.data;

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
                  queryUsers.refetch();
                }}
              />
            </ConditionalMount>
            <ItemInventory
              inventory={data}
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
        loading={queryUsers.isFetching || !typesIndex}
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
                          owner: inv.ownerId,
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
