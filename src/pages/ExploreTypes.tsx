import React from "react";
import { Helmet } from "react-helmet";
import {
  TextField,
  TableCell,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { filterInProps } from "@/tools";
import ButtonItem from "@/components/buttons/ButtonItem";
import useQuerySearch from "@/tools/useQuerySearch";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { useTypesIndex } from "@/contexts/AppContext";
import { IndexedType } from "@/tools/typesIndex";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";

const columns: DataTableColumn<IndexedType>[] = [
  {
    label: "Id",
    width: 80,
    sort: (a, b) => Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10),
  },
  {
    label: "Name",
    width: 400,
    grow: true,
    sort: (a, b) => a.name.localeCompare(b.name ?? "") ?? 0,
    initialSort: "asc",
  },
  {
    label: "Category",
    width: 200,
    sort: (a, b) => a.categoryName.localeCompare(b.categoryName ?? "") ?? 0,
  },
  {
    label: "Group",
    width: 300,
    sort: (a, b) => a.groupName.localeCompare(b.groupName ?? "") ?? 0,
  },
];

const ExploreTypes: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    categoryId: "0",
    groupId: "0",
  });
  const typesIndex = useTypesIndex();

  const [allTypes, categories] = React.useMemo(() => {
    if (!typesIndex) return [[], null];
    const allTypes = typesIndex.getAll();
    const categories = typesIndex.getCatergories();
    return [allTypes, categories];
  }, [typesIndex]);

  const types = React.useMemo(() => {
    const iCategoryId = parseInt(search.categoryId, 10);
    const iGroupId = parseInt(search.groupId, 10);
    return filterInProps(
      allTypes,
      debouncedSearch.text,
      ["id", "name", "smartItemId"],
      (type) =>
        (iCategoryId === 0 || type.categoryId === iCategoryId) &&
        (iGroupId === 0 || type.groupId === iGroupId)
    );
  }, [allTypes, search.categoryId, search.groupId, debouncedSearch.text]);

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
    (_: number, type: (typeof types)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={type.id}>
          <TableCell>{type.id}</TableCell>
          <TableCell colSpan={2}>
            <ButtonItem
              typeId={type.id}
              name={type.name}
              fastRender={context.isScrolling}
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
      <DataTableLayout
        title="Types"
        columns={columns}
        data={types}
        itemContent={itemContent}
        loading={!typesIndex}
      >
        <TextField
          label="Search"
          value={search.text}
          onChange={(e) => {
            setSearch(
              "text",
              e.currentTarget.value.substring(0, 255).toLowerCase()
            );
          }}
          fullWidth
        />
        {categorySelect}
        {groupSelect}
      </DataTableLayout>
    </>
  );
};

export default ExploreTypes;
