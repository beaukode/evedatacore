import React from "react";
import {
  Box,
  IconButton,
  LinearProgress,
  TableCell,
  TextField,
} from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopy";
import ColorIcon from "@mui/icons-material/Square";
import { useQuery } from "@tanstack/react-query";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { filterInProps, tsToLocaleString } from "@/tools";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import { columnWidths } from "@/constants";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import { SystemRecord } from "@/api/userdata";
import { useSystemDataCopy } from "@/map/hooks/useSystemDataCopy";
import useQuerySearch from "@/tools/useQuerySearch";
import { useUserDataContext } from "@/contexts/UserDataContext";

const columns: DataTableColumn<SystemRecord>[] = [
  {
    label: "Solar system",
    width: columnWidths.solarSystemWithMap,
  },
  {
    label: "Points of interest",
    width: columnWidths.common,
    grow: true,
  },
  {
    label: "Notes",
    width: columnWidths.common / 2,
  },
  {
    label: "Last update",
    width: columnWidths.datetime - 40,
  },
  {
    label: " ",
    width: 80,
  },
];

const MapUserData: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });
  const { userDatabase } = useUserDataContext();
  const solarSystemIndex = useSolarSystemsIndex();
  const systemDataCopy = useSystemDataCopy();
  const query = useQuery({
    queryKey: ["SolarsystemUserData"],
    queryFn: async () => {
      const records = userDatabase.listSystems();
      return (await records).map((r) => ({
        ...r,
        textContent: r.content?.join(", ") ?? "",
        name: solarSystemIndex?.getById(r.id)?.name ?? "",
      }));
    },
  });

  const rows = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text.toLowerCase(), [
      "name",
      "textContent",
      "notes",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, r: SystemRecord) => {
      const updatedAt = tsToLocaleString(r.updatedAt, { time: true });
      return (
        <React.Fragment key={r.id}>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ColorIcon htmlColor={r.color ?? "primary"} />
              <ButtonSolarsystem solarSystemId={r.id} showMapLink />
            </Box>
          </TableCell>
          <TableCell colSpan={2}>{r.content?.join(", ")}</TableCell>
          <TableCell>{r.notes}</TableCell>
          <TableCell>{updatedAt}</TableCell>
          <TableCell>
            <IconButton
              color="primary"
              size="small"
              onClick={async () => {
                await systemDataCopy.copy(r);
              }}
            >
              <CopyIcon />
            </IconButton>
          </TableCell>
        </React.Fragment>
      );
    },
    [systemDataCopy]
  );

  return (
    <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
      <LinearProgress
        sx={{
          visibility: query.isFetching ? "visible" : "hidden",
        }}
      />
      <Box display="flex" px={2}>
        <TextField
          sx={{ minWidth: 200 }}
          fullWidth
          label="Search"
          value={search.text}
          onChange={(e) =>
            setSearch("text", e.currentTarget.value.substring(0, 255))
          }
        />
      </Box>
      <Box flexGrow={1} p={2}>
        <DataTable data={rows} columns={columns} itemContent={itemContent} />
      </Box>
    </Box>
  );
};

export default MapUserData;
