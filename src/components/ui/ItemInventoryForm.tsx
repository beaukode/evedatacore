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
import { Inventory } from "@/api/mudsql";
import { useTypesIndex } from "@/contexts/AppContext";

interface ItemInventoryFormProps {
  inventory: Inventory;
  quantities: Record<string, number>;
  onQuantityChange: (itemId: string, quantity: number) => void;
  disabled?: boolean;
}

const ItemInventoryForm: React.FC<ItemInventoryFormProps> = ({
  inventory,
  quantities,
  onQuantityChange,
  disabled,
}) => {
  const typesIndex = useTypesIndex();

  const itemsWithType = React.useMemo(() => {
    return typesIndex?.mergeSmartItemAndType(inventory.items);
  }, [inventory.items, typesIndex]);

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
        {!itemsWithType && (
          <TableRow>
            <TableCell colSpan={2}>
              <LinearProgress />
            </TableCell>
          </TableRow>
        )}
        {itemsWithType &&
          itemsWithType.map(({ itemId, name, image, quantity }) => (
            <TableRow key={itemId}>
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
                  value={quantities[itemId] || 0}
                  type="number"
                  size="small"
                  variant="outlined"
                  onChange={(e) =>
                    onQuantityChange(itemId, Number(e.target.value))
                  }
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
