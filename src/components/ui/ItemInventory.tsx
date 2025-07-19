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
} from "@mui/material";
import { InventoryItem } from "@/tools/typesIndex";
import ButtonItem from "../buttons/ButtonItem";

interface Inventory {
  capacity: string;
  usedCapacity: string;
  items: InventoryItem[];
}

interface ItemInventoryProps {
  inventory: Inventory;
  header?: React.ReactNode;
}

const ItemInventory: React.FC<ItemInventoryProps> = ({ inventory, header }) => {
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
            Usage: {formatLargeNumber(formatCrypto(inventory.usedCapacity, 0))}{" "}
            of {formatLargeNumber(formatCrypto(inventory.capacity, 0))} (
            {bigPercentage(inventory.usedCapacity, inventory.capacity)}%)
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
          {inventory.items.map((i) => (
            <TableRow key={i.id}>
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
