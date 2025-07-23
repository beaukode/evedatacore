import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  TextField,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { filterInProps, tsToDateTime } from "@/tools";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import useQuerySearch from "@/tools/useQuerySearch";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { getAssembliesTypeState } from "@/api/evedatacore-v2";
import {
  AssemblyType,
  assemblyTypeMap,
  assemblyTypeReverseMap,
} from "@shared/mudsql";
import {
  columnWidths,
  smartAssembliesTypes,
  smartAssemblyStates,
} from "@/constants";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonAssembly from "@/components/buttons/ButtonAssembly";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
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
    type: AssemblyType.NetworkNode.toString(),
    state: "3",
  });

  const query = usePaginatedQuery({
    queryKey: ["Smartassemblies", search.type, search.state],
    queryFn: async ({ pageParam }) => {
      const r = await getAssembliesTypeState({
        path: {
          type: assemblyTypeReverseMap[
            Number.parseInt(search.type, 10) as AssemblyType
          ],
          state: Number.parseInt(search.state, 10),
        },
        query: {
          startKey: pageParam,
        },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
  });

  const smartassemblies = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "name",
      "id",
      "ownerName",
      "ownerId",
    ]);
  }, [query.data, debouncedSearch.text]);

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
                typeId={
                  assemblyTypeMap[
                    sa.assemblyType as keyof typeof assemblyTypeMap
                  ]
                }
                stateId={sa.currentState}
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
              address={sa.account}
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
    <>
      <Helmet>
        <title>Assemblies</title>
      </Helmet>
      <DataTableLayout
        title="Assemblies"
        columns={columns}
        data={smartassemblies}
        itemContent={itemContent}
        loading={query.isFetching}
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
        <FormControl
          variant="standard"
          sx={{ width: 220, flexShrink: 0, ml: 2 }}
        >
          <InputLabel id="select-type-label">Type</InputLabel>
          <Select
            labelId="select-type-label"
            id="select-type"
            value={search.type}
            variant="standard"
            onChange={(e) => {
              setSearch("type", e.target.value);
            }}
            label="Type"
            fullWidth
          >
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
            value={search.state}
            variant="standard"
            onChange={(e) => {
              setSearch("state", e.target.value);
            }}
            label="State"
            fullWidth
          >
            {Object.entries(smartAssemblyStates).map(([id, name]) => (
              <MenuItem value={`${id}`} key={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DataTableLayout>
    </>
  );
};

export default ExploreAssemblies;
