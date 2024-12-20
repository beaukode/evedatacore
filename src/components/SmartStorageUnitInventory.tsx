import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { types_InventoryModule } from "../api/stillness";
import DisplayOwner from "./DisplayOwner";
import DisplayItem from "./DisplayItem";

interface SmartStorageUnitInventoryProps {
  inventory?: types_InventoryModule;
}

const SmartStorageUnitInventory: React.FC<SmartStorageUnitInventoryProps> = ({
  inventory,
}) => {
  if (!inventory) return;

  return (
    <>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        Storage
      </Typography>
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Box
          p={1}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box>&nbsp;</Box>
          <Box sx={{ textWrap: "nowrap", ml: 2 }}>
            <Typography variant="caption">
              Usage: {inventory.usedCapacity as unknown as string}/
              {inventory.storageCapacity as unknown as string})
            </Typography>
          </Box>
        </Box>
        <Box p={2}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.storageItems.map((i) => (
                <TableRow key={i.itemId}>
                  <TableCell>
                    <DisplayItem item={i} />
                  </TableCell>
                  <TableCell>{i.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        Users storage
      </Typography>
      <Paper elevation={1} sx={{ mb: 2 }}>
        {inventory.ephemeralInventoryList.map((u) => (
          <React.Fragment key={u.ownerId}>
            <Box
              p={1}
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <DisplayOwner address={u.ownerId} name={u.ownerName} />
              <Box sx={{ textWrap: "nowrap", ml: 2 }}>
                <Typography variant="caption">
                  Usage: {u.usedCapacity as unknown as string}/
                  {u.storageCapacity as unknown as string})
                </Typography>
              </Box>
            </Box>
            <Box p={2}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {u.ephemeralInventoryItems?.map((i) => (
                    <TableRow key={i.itemId}>
                      <TableCell>
                        <DisplayItem item={i} />
                      </TableCell>
                      <TableCell>{i.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </React.Fragment>
        ))}
      </Paper>
    </>
  );
};

export default SmartStorageUnitInventory;
