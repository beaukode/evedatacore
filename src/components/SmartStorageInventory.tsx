import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useMudSql, useTypesIndex } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";

import ItemInventory from "./ui/ItemInventory";
import { Typography } from "@mui/material";
import ButtonCharacter from "./buttons/ButtonCharacter";

interface SmartStorageInventoryProps {
  id: string;
  owner: string;
}

const SmartStorageInventory: React.FC<SmartStorageInventoryProps> = ({
  id,
}) => {
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

  const data = query.data;
  const inventories = queryUsers.data;

  return (
    <>
      <PaperLevel1
        title="Storage"
        loading={query.isLoading || !typesIndex}
        sx={{ pt: 0 }}
      >
        {data && (
          <>
            <ItemInventory inventory={data} />
          </>
        )}
      </PaperLevel1>
      <PaperLevel1
        title="Users storage"
        loading={query.isLoading || !typesIndex}
        sx={{ pt: inventories && inventories.length > 0 ? 0 : undefined }}
      >
        {inventories && inventories.length === 0 && (
          <Typography variant="body1">None</Typography>
        )}
        {inventories &&
          inventories.map((inv) => (
            <ItemInventory
              inventory={inv}
              header={
                <>
                  <ButtonCharacter address={inv.ownerId} name={inv.ownerName} />
                </>
              }
            />
          ))}
      </PaperLevel1>
    </>
  );
};

export default SmartStorageInventory;
