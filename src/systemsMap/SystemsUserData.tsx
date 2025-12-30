import React from "react";
import { Box, IconButton, LinearProgress, TableCell } from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopy";
import CircleIcon from "@mui/icons-material/Circle";
import { useQuery } from "@tanstack/react-query";
import { tsToLocaleString } from "@/tools";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import { columnWidths } from "@/constants";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { listSystems, SystemRecord } from "./Database";
import { copySystemDataToClipboard } from "./common";

const columns: DataTableColumn<SystemRecord>[] = [
  {
    label: "Solar system",
    width: columnWidths.solarSystemWithMap,
  },
  {
    label: "Content",
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

const SystemsUserData: React.FC = () => {
  const solarSystemsIndex = useSolarSystemsIndex();

  const query = useQuery({
    queryKey: ["SolarsystemUserData"],
    queryFn: async () => listSystems(),
  });

  const itemContent = React.useCallback(
    (_: number, r: SystemRecord) => {
      const updatedAt = tsToLocaleString(r.updatedAt, { time: true });
      return (
        <React.Fragment key={r.id}>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircleIcon htmlColor={r.color ?? "primary"} />
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
                const name =
                  solarSystemsIndex?.getById(r.id)?.solarSystemName ?? "";
                await copySystemDataToClipboard(name, r);
              }}
            >
              <CopyIcon />
            </IconButton>
          </TableCell>
        </React.Fragment>
      );
    },
    [solarSystemsIndex]
  );

  return (
    <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
      <LinearProgress
        sx={{
          visibility: query.isFetching ? "visible" : "hidden",
        }}
      />
      <Box flexGrow={1} p={2}>
        <DataTable
          data={query.data ?? []}
          columns={columns}
          itemContent={itemContent}
        />
      </Box>
    </Box>
  );
};

export default SystemsUserData;
