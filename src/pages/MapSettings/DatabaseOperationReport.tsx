import React from "react";
import {
  Typography,
  Paper,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { ImportStrategyRecordChange, ImportStrategyResult } from "@/api/userdata";
import { useSolarSystemsIndex } from "@/contexts/AppContext";

export interface DatabaseOperationReportProps {
  result: ImportStrategyResult;
}

export interface SystemNameProps {
  name: string;
  change: ImportStrategyRecordChange;
}

const ChangeColor: Partial<Record<ImportStrategyRecordChange, string>> = {
  u: "orange",
  d: "red",
};

const SystemName: React.FC<SystemNameProps> = ({ name, change }) => {
  return (
    <Typography component="span" sx={{ color: ChangeColor[change] }}>
      {name}
    </Typography>
  );
};

const DatabaseOperationReport: React.FC<DatabaseOperationReportProps> = ({
  result,
}) => {
  const theme = useTheme();
  const solarSystemsIndex = useSolarSystemsIndex();

  return (
    <Paper>
      <Box borderBottom={`2px dashed ${theme.palette.divider}`} px={1} py={0.5}>
        <SystemName name={`${result.created} created`} change="c" />
        {", "}
        <SystemName name={`${result.updated} updated`} change="u" />
        {", "}
        <SystemName name={`${result.deleted} deleted`} change="d" />
      </Box>
      <Box p={1} sx={{ maxHeight: "50vh", overflow: "auto" }}>
        {!solarSystemsIndex && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            py={3}
          >
            <CircularProgress />
          </Box>
        )}
        {solarSystemsIndex &&
          Array.from(result.details.entries()).map(([id, change], index) => {
            const name = solarSystemsIndex.getById(id)?.solarSystemName;
            if (!name) return null;
            return (
              <React.Fragment key={id}>
                {index > 0 && <>, </>}
                <SystemName name={name} change={change} />
              </React.Fragment>
            );
          })}
      </Box>
    </Paper>
  );
};

export default DatabaseOperationReport;
