import React from "react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SystemIcon from "@mui/icons-material/Adjust";
import { GetCalcPathFromToResponse } from "@/api/evedatacore";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { shorten } from "@/tools";
import { enrichRoute, gameNotepadRoute } from "@/tools/route";

type RouteData = GetCalcPathFromToResponse["path"];

interface RoutePlannerRouteProps {
  data: RouteData;
}

const connectionTexts: Record<string, string> = {
  gate: "Game gate",
  jump: "Ship jump",
  smartgate: "Smart gate",
};

const connectionsLines: Record<keyof typeof connectionTexts, React.ReactNode> =
  {
    gate: (
      <svg
        height="48"
        width="16"
        style={{
          margin: "0 14px",
          position: "absolute",
          top: -4,
          left: 0,
        }}
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="48"
          style={{
            stroke: "#5fbe92",
            strokeWidth: 16,
          }}
        />
      </svg>
    ),
    jump: (
      <svg
        height="48"
        width="16"
        style={{
          margin: "0 14px",
          position: "absolute",
          top: -4,
          left: 0,
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="48"
          to="0"
          dur="4s"
          repeatCount="indefinite"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="48"
          style={{
            stroke: "#5fbe92",
            strokeWidth: 16,
            strokeDasharray: 4,
          }}
        />
      </svg>
    ),
    smartgate: (
      <svg
        height="48"
        width="16"
        style={{
          margin: "0 14px",
          position: "absolute",
          top: -4,
          left: 0,
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="42"
          to="0"
          dur="4s"
          repeatCount="indefinite"
        />
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="48"
          style={{
            stroke: "#5fbe92",
            strokeWidth: 5,
            strokeLinecap: "round",
            strokeDasharray: "4,10",
          }}
        />
      </svg>
    ),
  };

const RoutePlannerRoute: React.FC<RoutePlannerRouteProps> = ({ data }) => {
  const [copyError, setCopyError] = React.useState(false);
  const solarSystemsIndex = useSolarSystemsIndex();

  const { hops, distance, jumps, jumpsDistance, path } = React.useMemo(() => {
    if (!solarSystemsIndex)
      return { hops: 0, distance: 0, jumps: 0, jumpsDistance: 0, path: [] };
    return enrichRoute(solarSystemsIndex, data);
  }, [solarSystemsIndex, data]);

  const notepadRoute = React.useMemo(() => {
    return gameNotepadRoute(path);
  }, [path]);

  if (data.length === 0) return null;

  const copyRoute = (idx: number) => () => {
    setCopyError(false);
    const content = notepadRoute[idx];
    if (!content) {
      return;
    }
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopyError(false);
      })
      .catch(() => {
        setCopyError(true);
      });
  };

  return (
    <>
      {copyError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to copy to clipboard
        </Alert>
      )}
      <Box display="flex" alignItems="flex-start" mb={1}>
        <Box flexGrow={1}>
          <Typography variant="body1">
            {hops} hops {distance.toFixed(2)} Ly
          </Typography>
          {jumps > 0 && (
            <Typography variant="caption">
              Including {jumps} ship jumps {jumpsDistance.toFixed(2)} Ly
            </Typography>
          )}
        </Box>
        <Box>
          <Tooltip title="If you paste with EVE-Links into in-game notepad, you get clickable links">
            <ButtonGroup orientation="horizontal">
              <Button variant="outlined" size="small" onClick={copyRoute(0)}>
                {notepadRoute.length > 1
                  ? `Copy 1/${notepadRoute.length}`
                  : "Copy"}
              </Button>
              {notepadRoute.length > 1 &&
                notepadRoute.map((_, idx) => {
                  if (idx === 0) {
                    return null; // First part is already rendered
                  }
                  return (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={copyRoute(idx)}
                    >
                      {idx + 1}/{notepadRoute.length}
                    </Button>
                  );
                })}
            </ButtonGroup>
          </Tooltip>
        </Box>
      </Box>
      {path.map((step, idx) => {
        const key = `${step.from}-${step.to}`;
        const connectionText = connectionTexts[step.type] || "Unknown";
        const connectionLine =
          connectionsLines[step.type] || connectionsLines.gate;
        return (
          <React.Fragment key={key}>
            {idx === 0 && (
              <Typography variant="body1">
                <SystemIcon color="secondary" fontSize="large" />
                {step.fromName}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                position: "relative",
                height: "40px",
                paddingLeft: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {connectionLine}
              {connectionText}{" "}
              {step.type === "smartgate"
                ? `[${step.name || shorten(step.id)}]`
                : ""}{" "}
              {step.distance.toFixed(2)} Ly
              {step.type === "smartgate" && step.owner && (
                <>
                  <br />
                  Owner: {step.owner.name}
                </>
              )}
            </Typography>
            <Typography variant="body1">
              <SystemIcon color="secondary" fontSize="large" />
              {step.toName}
            </Typography>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default RoutePlannerRoute;
