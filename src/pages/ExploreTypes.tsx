import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  TableCell,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import { getTypes } from "@/api/stillness";
import { filterInProps } from "@/tools";
import DisplayItem from "@/components/DisplayItem";
import useQuerySearch from "@/tools/useQuerySearch";

const columns = ["Name", "Category", "Group"];

type Category = {
  name: string;
  groups: Record<number, string>;
};

const ExploreTypes: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    categoryId: "0",
    groupId: "0",
  });

  const query = useQuery({
    queryKey: ["Types"],
    queryFn: async () =>
      await getTypes().then((r) => {
        const categories: Record<number, Category> = {};
        const types = Object.entries(r.data || {})
          .map(([k, v]) => {
            let groupId: number = 0;
            let groupName: string = "";
            let categoryId: number = 0;
            let categoryName: string = "";
            if (Array.isArray(v.attributes)) {
              for (const o of v.attributes) {
                if (
                  o &&
                  typeof o === "object" &&
                  "trait_type" in o &&
                  "value" in o
                ) {
                  if (o.trait_type === "groupID") {
                    groupId = o.value as unknown as number;
                  } else if (o.trait_type === "groupName") {
                    groupName = o.value as unknown as string;
                  } else if (o.trait_type === "categoryID") {
                    categoryId = o.value as unknown as number;
                  } else if (o.trait_type === "categoryName") {
                    categoryName = o.value as unknown as string;
                  }
                }
              }
            }
            if (!categories[categoryId]) {
              categories[categoryId] = {
                name: categoryName,
                groups: { [groupId]: groupName },
              };
            } else {
              categories[categoryId].groups[groupId] = groupName;
            }
            return {
              id: k,
              name: v.name,
              smartItemId: v.smartItemId,
              groupId,
              groupName,
              categoryId,
              categoryName,
            };
          })
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        return { types, categories };
      }),
  });

  const types = React.useMemo(() => {
    if (!query.data) return [];
    const iCategoryId = parseInt(search.categoryId, 10);
    const iGroupId = parseInt(search.groupId, 10);
    return filterInProps(
      query.data.types,
      debouncedSearch.text,
      ["id", "name", "smartItemId"],
      (type) =>
        (iCategoryId === 0 || type.categoryId === iCategoryId) &&
        (iGroupId === 0 || type.groupId === iGroupId)
    );
  }, [query.data, search.categoryId, search.groupId, debouncedSearch.text]);

  const categories = query.data?.categories;

  const categorySelect = React.useMemo(() => {
    if (!categories) return null;
    return (
      <FormControl variant="standard" sx={{ width: 160, ml: 2 }}>
        <InputLabel id="select-category-label">Category</InputLabel>
        <Select
          labelId="select-category-label"
          id="select-category"
          value={search.categoryId}
          variant="standard"
          onChange={(e) => {
            setSearch("categoryId", e.target.value);
            setSearch("groupId", "0");
          }}
          label="Category"
          fullWidth
        >
          <MenuItem value="0">All</MenuItem>
          {Object.entries(categories).map(([id, { name }]) => (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }, [categories, search.categoryId, setSearch]);

  const groupSelect = React.useMemo(() => {
    if (!categories) return null;
    const iCategoryId = parseInt(search.categoryId, 10);
    if (!categories[iCategoryId]) {
      return (
        <FormControl variant="standard" sx={{ width: 200, ml: 2 }}>
          <InputLabel id="select-group-label">Group</InputLabel>
          <Select
            labelId="select-group-label"
            id="select-group"
            value="0"
            variant="standard"
            label="Group"
            disabled
            fullWidth
          >
            <MenuItem value="0">All</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <FormControl variant="standard" sx={{ width: 220, ml: 2 }}>
        <InputLabel id="select-group-label">Group</InputLabel>
        <Select
          labelId="select-group-label"
          id="select-group"
          value={search.groupId}
          variant="standard"
          onChange={(e) => {
            setSearch("groupId", e.target.value);
          }}
          label="Group"
          fullWidth
        >
          <MenuItem value="0">All</MenuItem>
          {Object.entries(categories[iCategoryId].groups).map(([id, name]) => (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }, [categories, search.categoryId, search.groupId, setSearch]);

  const itemContent = React.useCallback(
    (_: number, type: (typeof types)[number]) => {
      return (
        <React.Fragment key={type.id}>
          <TableCell>
            <DisplayItem
              item={{
                name: type.name || "",
                itemId: type.smartItemId || "",
                typeId: type.id,
              }}
            />
          </TableCell>
          <TableCell>{type.categoryName}</TableCell>
          <TableCell>{type.groupName}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Types</title>
      </Helmet>
      <Box p={2} flexGrow={1} overflow="hidden">
        <Paper
          elevation={1}
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="flex" alignItems="flex-end">
            <TextField
              label="Search"
              value={search.text}
              onChange={(e) => {
                setSearch(
                  "text",
                  e.currentTarget.value.substring(0, 255).toLowerCase()
                );
              }}
            />
            {categorySelect}
            {groupSelect}
            <Box flexGrow={1} textAlign="right">
              <Typography variant="caption" color="textPrimary">
                {types.length} types
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <LinearProgress
              sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
            />
          </Box>
          <DataTable
            data={types}
            columns={columns}
            itemContent={itemContent}
            rememberScroll
          />
        </Paper>
      </Box>
    </>
  );
};

export default ExploreTypes;
