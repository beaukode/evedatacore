import React from "react";
import { formatLargeNumber, formatCrypto, bigPercentage } from "@/tools";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@mui/material";
import { Inventory } from "@/api/mudsql";
import { useTypesIndex } from "@/contexts/AppContext";
import ButtonItem from "../buttons/ButtonItem";

interface ItemInventoryProps {
  inventory: Inventory;
  header?: React.ReactNode;
}

const ItemInventory: React.FC<ItemInventoryProps> = ({ inventory, header }) => {
  const typesIndex = useTypesIndex();

  const itemsWithType = React.useMemo(() => {
    return typesIndex?.mergeSmartItemAndType(inventory.items);
  }, [inventory.items, typesIndex]);

  return (
    <Box>
      <Box
        p={1}
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Box>{header}</Box>
        <Box sx={{ textWrap: "nowrap", ml: 2 }}>
          <Typography variant="caption">
            Usage: {formatLargeNumber(formatCrypto(inventory.used, 0))} of{" "}
            {formatLargeNumber(formatCrypto(inventory.total, 0))} (
            {bigPercentage(inventory.used, inventory.total)}%)
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
          {!itemsWithType && (
            <TableRow>
              <TableCell colSpan={2}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          )}
          {itemsWithType &&
            itemsWithType.map((i) => (
              <TableRow key={i.itemId}>
                <TableCell>
                  <ButtonItem name={i.name} typeId={i.id} image={i.image} />
                </TableCell>
                <TableCell>{i.quantity}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ItemInventory;
