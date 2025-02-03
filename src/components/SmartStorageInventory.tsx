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

const SmartStorageInventory: React.FC<SmartStorageInventoryProps> = ({
  id,
  owner,
}) => {
  const [transfertItemsOpen, setTransfertItemsOpen] = React.useState(false);
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
                owner={owner}
                storageUsers={storageUsers}
                title="Transfer items to user storage"
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
                  onClick={() => setTransfertItemsOpen(true)}
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
                      onClick={() => setTransfertItemsOpen(true)}
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
