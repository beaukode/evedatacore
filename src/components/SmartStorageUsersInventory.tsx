import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql, useTypesIndex } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";
import ButtonItem from "./buttons/ButtonItem";
import { bigPercentage, formatCrypto, formatLargeNumber } from "@/tools";
import ButtonCharacter from "./buttons/ButtonCharacter";

interface SmartStorageUsersInventoryProps {
  id: string;
}

const SmartStorageUsersInventory: React.FC<SmartStorageUsersInventoryProps> = ({
  id,
}) => {
  const mudSql = useMudSql();
  const typesIndex = useTypesIndex();

  const query = useQuery({
    queryKey: ["SmartStorageUsersInventory", id],
    queryFn: async () => mudSql.listStorageUsersInventory(id),
    retry: false,
  });

  const data = query.data;

  const inventories = React.useMemo(() => {
    if (!(data && typesIndex)) return undefined;
    return data.map((inv) => {
      return {
        ...inv,
        items: inv.items.map((i) => {
          const type = typesIndex.getBySmartItemId(i.itemId);
          return {
            ...i,
            id: type?.id || "0",
            name: type?.name || "Unknown item",
            image: type?.image,
          };
        }),
      };
    });
  }, [data, typesIndex]);

  return (
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
          <React.Fragment key={inv.ownerId}>
            <Box
              p={1}
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <ButtonCharacter address={inv.ownerId} name={inv.ownerName} />
              <Box sx={{ textWrap: "nowrap", ml: 2 }}>
                <Typography variant="caption">
                  Usage: {formatLargeNumber(formatCrypto(inv.used, 0))} of{" "}
                  {formatLargeNumber(formatCrypto(inv.total, 0))} (
                  {bigPercentage(inv.used, inv.total)}%)
                </Typography>
              </Box>
            </Box>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell width={120}>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inv.items.map((i) => (
                  <TableRow key={i.itemId}>
                    <TableCell>
                      <ButtonItem
                        name={i.name}
                        typeId={i.id}
                        image={i.image}
                      />
                    </TableCell>
                    <TableCell>{i.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        ))}
    </PaperLevel1>
  );
};

export default SmartStorageUsersInventory;
