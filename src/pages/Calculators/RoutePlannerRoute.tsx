import { GetPathResponse } from "@/api/shish";
import { Alert, Box, Button, Tooltip, Typography } from "@mui/material";
import SystemIcon from "@mui/icons-material/Adjust";
import React from "react";

type RouteData = GetPathResponse["data"];

interface RoutePlannerRouteProps {
  data: RouteData;
}

const connectionTexts: Record<string, string> = {
  npc_gate: "Game gate",
  jump: "Ship jump",
  smart_gate: "Smart gate",
};

const connectionsLines: Record<string, React.ReactNode> = {
  npc_gate: (
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
  smart_gate: (
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

function summarizeRoute(data: RouteData) {
  const summary = data.reduce(
    (acc, step) => {
      acc.distance += step.distance;
      if (step.conn_type === "jump") {
        acc.jumps += 1;
        acc.jumpsDistance += step.distance;
      }
      return acc;
    },
    {
      distance: 0,
      jumps: 0,
      jumpsDistance: 0,
      hops: data.length,
    }
  );
  return summary;
}

const RoutePlannerRoute: React.FC<RoutePlannerRouteProps> = ({ data }) => {
  const [copyError, setCopyError] = React.useState(false);
  const { hops, distance, jumps, jumpsDistance } = summarizeRoute(data);

  if (data.length === 0) return null;

  const copyRoute = () => {
    const content = data
      .reduce(
        (acc, step) => {
          const connectionText = connectionTexts[step.conn_type] || "Unknown";
          const { name, id } = step.to;
          acc.push(
            `${connectionText} to <a href="showinfo:5//${id}">${name}</a> ${step.distance.toFixed()}ly`
          );
          return acc;
        },
        [`${data[0].from.name} → ${data[data.length - 1].to.name}`, ""]
      )
      .join("\n");

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
            <Button variant="outlined" size="small" onClick={copyRoute}>
              Copy with EVE-Links
            </Button>
          </Tooltip>
        </Box>
      </Box>
      {data.map((step, idx) => {
        const key = `${step.from.id}-${step.to.id}`;
        const connectionText = connectionTexts[step.conn_type] || "Unknown";
        const connectionLine =
          connectionsLines[step.conn_type] || connectionsLines["npc_gate"];
        return (
          <React.Fragment key={key}>
            {idx === 0 && (
              <Typography variant="body1">
                <SystemIcon color="secondary" fontSize="large" />
                {step.from.name}
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
              {connectionText} {step.distance.toFixed(2)} Ly
            </Typography>
            <Typography variant="body1">
              <SystemIcon color="secondary" fontSize="large" />
              {step.to.name}
            </Typography>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default RoutePlannerRoute;
