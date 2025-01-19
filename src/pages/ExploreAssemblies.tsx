import React from "react";
import {
  Box,
  TextField,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonAssembly from "@/components/buttons/ButtonAssembly";
import { ensureArray, filterInProps, tsToDateTime } from "@/tools";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import useQuerySearch from "@/tools/useQuerySearch";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import {
  columnWidths,
  smartAssembliesTypes,
  SmartAssemblyState,
  smartAssemblyStates,
} from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";

const columns: DataTableColumn[] = [
  { label: "Assembly", width: columnWidths.common, grow: true },
  { label: "Owner", width: columnWidths.common },
  { label: "Solar system", width: columnWidths.common },
  { label: "Anchored At", width: columnWidths.datetime },
];

const ExploreAssemblies: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    typeId: "0",
    stateId: "2-3",
  });
  const mudSql = useMudSql();

  const { selectedStates, iSelectedState } = React.useMemo(() => {
    const selectedStates = search.stateId.split("-").filter((v) => v !== "");
    const iSelectedState = selectedStates.map((v) => Number.parseInt(v, 10));
    return { selectedStates, iSelectedState };
  }, [search.stateId]);

  const query = useQuery({
    queryKey: ["Smartassemblies"],
    queryFn: async () => mudSql.listAssemblies(),
    staleTime: 1000 * 60,
  });

  const smartassemblies = React.useMemo(() => {
    if (!query.data) return [];
    const iTypeId = parseInt(search.typeId, 10);
    return filterInProps(
      query.data,
      debouncedSearch.text,
      ["name", "id", "ownerName", "ownerId"],
      (sa) => {
        return (
          (sa.typeId === iTypeId || iTypeId === 0) &&
          iSelectedState.includes(sa.state)
        );
      }
    );
  }, [query.data, debouncedSearch.text, search.typeId, iSelectedState]);

  const itemContent = React.useCallback(
    (
      _: number,
      sa: (typeof smartassemblies)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={sa.id}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <DisplayAssemblyIcon
                typeId={sa.typeId}
                stateId={sa.state}
                sx={{ mr: 1 }}
                tooltip={!context.isScrolling}
              />
              <ButtonAssembly
                name={sa.name}
                id={sa.id}
                fastRender={context.isScrolling}
              />
            </Box>
          </TableCell>
          <TableCell>
            <ButtonCharacter
              name={sa.ownerName}
              address={sa.ownerId}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonSolarsystem
              solarSystemId={sa.solarSystemId}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>{tsToDateTime(sa.anchoredAt)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );

  return (
    <DataTableLayout
      title="Assemblies"
      columns={columns}
      data={smartassemblies}
      itemContent={itemContent}
    >
      <TextField
        sx={{ minWidth: 200 }}
        fullWidth
        label="Search"
        value={search.text}
        onChange={(e) =>
          setSearch(
            "text",
            e.currentTarget.value.substring(0, 255).toLowerCase()
          )
        }
      />
      <FormControl variant="standard" sx={{ width: 220, flexShrink: 0, ml: 2 }}>
        <InputLabel id="select-type-label">Type</InputLabel>
        <Select
          labelId="select-type-label"
          id="select-type"
          value={search.typeId}
          variant="standard"
          onChange={(e) => {
            setSearch("typeId", e.target.value);
          }}
          label="Type"
          fullWidth
        >
          <MenuItem value="0">All</MenuItem>
          {Object.entries(smartAssembliesTypes).map(([id, name]) => (
            <MenuItem value={`${id}`} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="standard"
        sx={{ minWidth: 150, flexShrink: 0, ml: 2 }}
      >
        <InputLabel id="select-state-label">State</InputLabel>
        <Select
          labelId="select-state-label"
          id="select-state"
          value={selectedStates.map((v) => `${v}`)}
          variant="standard"
          renderValue={(selected) =>
            selected
              .map((v) => smartAssemblyStates[Number(v) as SmartAssemblyState])
              .join(", ")
          }
          onChange={(e) => {
            const value = ensureArray(e.target.value).sort();
            setSearch("stateId", value.join("-"));
          }}
          label="State"
          multiple
          fullWidth
        >
          {Object.entries(smartAssemblyStates).map(([id, name]) => (
            <MenuItem value={`${id}`} key={id}>
              <Checkbox checked={selectedStates.includes(id)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </DataTableLayout>
  );
};

export default ExploreAssemblies;
