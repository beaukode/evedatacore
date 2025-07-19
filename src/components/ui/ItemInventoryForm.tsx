import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { InventoryItem } from "@/tools/typesIndex";

interface ItemInventoryFormProps {
  items?: InventoryItem[];
  quantities: Record<string, number>;
  onQuantityChange: (itemId: string, quantity: number) => void;
  disabled?: boolean;
}

const ItemInventoryForm: React.FC<ItemInventoryFormProps> = ({
  items,
  quantities,
  onQuantityChange,
  disabled,
}) => {
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell width={250} sx={{ textAlign: "right" }}>
            Quantity to transfer
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!items && (
          <TableRow>
            <TableCell colSpan={2}>
              <LinearProgress />
            </TableCell>
          </TableRow>
        )}
        {items &&
          items.map(({ smartItemId, name, image, quantity }) => (
            <TableRow key={smartItemId}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {image && (
                    <Avatar
                      alt={name}
                      sx={{ bgcolor: "black", color: "silver", mr: 1 }}
                      src={image}
                      variant="rounded"
                    />
                  )}
                  {name}
                </Box>
              </TableCell>
              <TableCell>
                <TextField
                  value={quantities[smartItemId] || 0}
                  type="number"
                  size="small"
                  variant="outlined"
                  onChange={(e) => onQuantityChange(smartItemId, Number(e.target.value))}
                  slotProps={{
                    htmlInput: {
                      sx: { textAlign: "right" },
                      min: 0,
                      max: Number(quantity),
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="primary">
                            /{quantity}
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  disabled={disabled}
                  fullWidth
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default ItemInventoryForm;
