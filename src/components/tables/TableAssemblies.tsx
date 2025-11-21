import React from "react";
import {
  TableCell,
  Typography,
  Box,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import LPointLocation from "@/components/ui/LPointLocation";
import ButtonAssembly from "../buttons/ButtonAssembly";
import DisplayAssemblyIcon from "../DisplayAssemblyIcon";
import ButtonSolarsystem from "../buttons/ButtonSolarsystem";
import ButtonCharacter from "../buttons/ButtonCharacter";
import { tsToDateTime } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import {
  getCharacterIdAssemblies,
  getSolarsystemIdAssemblies,
  Assembly,
} from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";
import DataTable, { DataTableColumn } from "../DataTable";
import { columnWidths } from "@/constants";

interface TableAssembliesProps {
  owner?: string;
  solarSystemId?: string;
  onFetched?: () => void;
}

const TableAssemblies: React.FC<TableAssembliesProps> = ({
  owner,
  solarSystemId,
  onFetched,
}) => {
  const [showUnanchored, setShowUnanchored] = React.useState(false);

  const queryByOwner = usePaginatedQuery({
    queryKey: ["AssembliesByOwner", owner],
    queryFn: async ({ pageParam }) => {
      if (!owner) return { items: [] };
      const r = await getCharacterIdAssemblies({
        path: { id: owner },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
    enabled: !!owner,
  });

  const queryBySolarSystem = usePaginatedQuery({
    queryKey: ["AssembliesBySolarSystem", solarSystemId],
    queryFn: async ({ pageParam }) => {
      const r = await getSolarsystemIdAssemblies({
        path: { id: Number(solarSystemId) },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
    enabled: !!solarSystemId,
  });

  const query = owner ? queryByOwner : queryBySolarSystem;

  useNotify(query.isFetched, onFetched);

  const assemblies = React.useMemo(() => {
    if (!query.data) return undefined;
    if (showUnanchored) return query.data;
    return query.data.filter(
      (a) => a.currentState === 2 || a.currentState === 3
    );
  }, [query.data, showUnanchored]);

  const columns: DataTableColumn<Assembly>[] = React.useMemo(() => {
    const columns: DataTableColumn<Assembly>[] = [
      {
        label: "Assembly",
        width: columnWidths.common,
        grow: true,
        sort: (a, b) => {
          if (a.name && b.name) return a.name.localeCompare(b.name);
          if (a.name) return -1;
          if (b.name) return 1;
          return a.id.localeCompare(b.id);
        },
      },
    ];
    if (!owner)
      columns.push({
        label: "Owner",
        width: columnWidths.common,
        sort: (a, b) => a.ownerName?.localeCompare(b.ownerName ?? "") ?? 0,
      });
    if (!solarSystemId)
      columns.push({ label: "Solar system", width: columnWidths.solarSystem });
    columns.push({
      label: "L-Point",
      width: columnWidths.lpoint,
    });
    columns.push({
      label: "Anchored At",
      width: columnWidths.datetime,
      sort: (a, b) => (a.anchoredAt ?? 0) - (b.anchoredAt ?? 0),
      initialSort: "desc",
    });
    return columns;
  }, [owner, solarSystemId]);

  const itemContent = React.useCallback(
    (_: number, sa: Assembly) => {
      return (
        <React.Fragment key={sa.id}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <DisplayAssemblyIcon
                typeId={sa.typeId}
                stateId={sa.currentState}
                sx={{ mr: 1 }}
                tooltip
              />
              <ButtonAssembly id={sa.id} name={sa.name} />
            </Box>
          </TableCell>
          {!owner && (
            <TableCell>
              <ButtonCharacter address={sa.account} name={sa.ownerName} />
            </TableCell>
          )}
          {!solarSystemId && (
            <TableCell>
              <ButtonSolarsystem solarSystemId={sa.solarSystemId} />
            </TableCell>
          )}
          <TableCell>
            <LPointLocation
              lpoint={sa.lpoint}
              showDistance={sa.assemblyType !== "NWN"}
            />
          </TableCell>
          <TableCell>{tsToDateTime(sa.anchoredAt)}</TableCell>
        </React.Fragment>
      );
    },
    [owner, solarSystemId]
  );

  return (
    <PaperLevel1
      title="Assemblies"
      loading={query.isFetching}
      sx={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
      titleAdornment={
        <FormControlLabel
          control={
            <Switch
              value={showUnanchored}
              onChange={(e) => setShowUnanchored(e.target.checked)}
            />
          }
          label="Show Unanchored & Destroyed"
        />
      }
    >
      {query.isError && (
        <Alert severity="error">
          Error loading assemblies, contact me if the error is permanent for
          this user
        </Alert>
      )}
      {!assemblies && <Typography variant="body1">&nbsp;</Typography>}
      {assemblies && (
        <>
          {assemblies.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {assemblies.length > 0 && (
            <Box
              flexGrow={1}
              flexBasis={100}
              height="100%"
              minHeight={`min(50vh, ${37 + 50 * assemblies.length}px)`}
              overflow="hidden"
            >
              <DataTable
                data={assemblies}
                columns={columns}
                itemContent={itemContent}
              />
            </Box>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default TableAssemblies;
