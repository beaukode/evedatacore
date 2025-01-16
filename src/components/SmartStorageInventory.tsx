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
import DisplayItem from "./DisplayItem";
import { bigPercentage, formatCrypto, formatLargeNumber } from "@/tools";

interface SmartStorageInventoryProps {
  id: string;
}

const SmartStorageInventory: React.FC<SmartStorageInventoryProps> = ({
  id,
}) => {
  const mudSql = useMudSql();
  const typesIndex = useTypesIndex();

  const query = useQuery({
    queryKey: ["SmartStorageInventory", id],
    queryFn: async () => mudSql.getStorageInventory(id),
  });

  const data = query.data;

  const items = React.useMemo(() => {
    if (!(data && typesIndex)) return [];
    return data.items.map((i) => {
      const type = typesIndex.getBySmartItemId(i.itemId);
      return {
        ...i,
        id: type?.id || "0",
        name: type?.name || "Unknown item",
        image: type?.image,
      };
    });
  }, [data, typesIndex]);

  return (
    <PaperLevel1
      title="Storage"
      loading={query.isLoading || !typesIndex}
      sx={{ pt: 0 }}
    >
      {data && (
        <>
          <Box
            p={1}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Box>&nbsp;</Box>
            <Box sx={{ textWrap: "nowrap", ml: 2 }}>
              <Typography variant="caption">
                Usage: {formatLargeNumber(formatCrypto(data.used, 0))} of{" "}
                {formatLargeNumber(formatCrypto(data.total, 0))} (
                {bigPercentage(data.used, data.total)}%)
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
              {items.map((i) => (
                <TableRow key={i.itemId}>
                  <TableCell>
                    <DisplayItem name={i.name} typeId={i.id} image={i.image} />
                  </TableCell>
                  <TableCell>{i.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </PaperLevel1>
  );
};

export default SmartStorageInventory;
