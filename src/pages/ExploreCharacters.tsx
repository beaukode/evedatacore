import React from "react";
import { Box, TextField, Avatar, TableCell } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps, tsToDateTime } from "@/tools";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common, grow: true },
  { label: "Address", width: columnWidths.address },
  { label: "Created At", width: columnWidths.datetime },
];

const ExploreCharacters: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async () => mudSql.listCharacters(),
    staleTime: 1000 * 60 * 15,
  });

  const smartcharacters = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      ["address", "name", "id"],
      (sm) => sm.address !== "0x0000000000000000000000000000000000000000"
    );
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (
      _: number,
      sm: (typeof smartcharacters)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={sm.address}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <Avatar
                alt={sm.name}
                sx={{ bgcolor: "black", color: "silver", mr: 1 }}
                src="https://images.dev.quasar.reitnorf.com/Character/123456789_256.jpg"
                variant="rounded"
              />
              <ButtonCharacter
                name={sm.name}
                address={sm.address}
                fastRender={context.isScrolling}
              />
            </Box>
          </TableCell>
          <TableCell>{sm.address}</TableCell>
          <TableCell>{tsToDateTime(sm.createdAt)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <DataTableLayout
      title="Characters"
      columns={columns}
      data={smartcharacters}
      itemContent={itemContent}
    >
      <TextField
        label="Search"
        value={search.text}
        onChange={(e) =>
          setSearch(
            "text",
            e.currentTarget.value.substring(0, 255).toLowerCase()
          )
        }
        fullWidth
      />
    </DataTableLayout>
  );
};

export default ExploreCharacters;
