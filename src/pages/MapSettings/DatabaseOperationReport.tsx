import React from "react";
import {
  Typography,
  Paper,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { StrategyOperationChange, StrategyResult } from "@/api/userdata";
import { useSolarSystemsIndex } from "@/contexts/AppContext";

export interface DatabaseOperationReportProps {
  result: StrategyResult;
}

export interface SystemNameProps {
  name: string;
  change: StrategyOperationChange;
}

const ChangeColor: Partial<Record<StrategyOperationChange, string>> = {
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

  const header = React.useMemo(() => {
    const components = [];
    if (result.created > 0) {
      components.push(
        <SystemName name={`${result.created} created`} change="c" />
      );
    }
    if (result.updated > 0) {
      components.push(
        <SystemName name={`${result.updated} updated`} change="u" />
      );
    }
    if (result.deleted > 0) {
      components.push(
        <SystemName name={`${result.deleted} deleted`} change="d" />
      );
    }
    if (result.exported > 0) {
      components.push(
        <SystemName name={`${result.exported} exported`} change="e" />
      );
    }

    if (components.length === 0) {
      return "Nothing to do";
    }
    return components;
  }, [result]);

  const entries = React.useMemo(() => {
    return Array.from(result.details.entries());
  }, [result]);

  return (
    <Paper>
      <Box borderBottom={`2px dashed ${theme.palette.divider}`} px={1} py={0.5}>
        {Array.isArray(header)
          ? header.map((component, index) => (
              <React.Fragment key={index}>
                {index > 0 && <>, </>}
                {component}
              </React.Fragment>
            ))
          : header}
      </Box>
      {entries.length > 0 && (
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
            entries.map(([id, change], index) => {
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
      )}
    </Paper>
  );
};

export default DatabaseOperationReport;
