import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { types_GateLinkModule } from "../api/stillness";
import DisplayOwner from "./DisplayOwner";
import DisplayAssembly from "./DisplayAssembly";
import DisplaySolarsystem from "./DisplaySolarsystem";
import DisplayAssemblyIcon from "./DisplayAssemblyIcon";

interface SmartGateLinkProps {
  gateLink?: types_GateLinkModule;
}

const SmartGateLink: React.FC<SmartGateLinkProps> = ({ gateLink }) => {
  const { linkStatus, linkedGate } = React.useMemo(() => {
    if (!gateLink?.isLinked) return { linkStatus: "Not linked" };
    const linkedGate = gateLink.gatesInRange.find(
      (g) => g.id === gateLink.destinationGate
    );
    if (!linkedGate) return { linkStatus: "Linked gate not found in range" };
    return { linkStatus: "Ok", linkedGate };
  }, [gateLink]);

  const gateInRange = gateLink?.gatesInRange || [];

  if (!gateLink) return;

  return (
    <>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        Destination
      </Typography>
      <Paper elevation={1} sx={{ mb: 2 }}>
        {!linkedGate && (
          <Typography variant="body1" padding={2}>
            {linkStatus}
          </Typography>
        )}
        {linkedGate && (
          <List sx={{ width: "100%", overflow: "hidden" }}>
            <ListItem sx={{ py: 0 }}>
              <ListItemText>
                Assembly:{" "}
                <DisplayAssembly
                  itemId={linkedGate.itemId}
                  id={linkedGate.id}
                  name={linkedGate.name}
                />
              </ListItemText>
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText>
                Owner:{" "}
                <DisplayOwner
                  address={linkedGate.ownerId}
                  name={linkedGate.ownerName}
                />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                State: {linkedGate.state} [{linkedGate.stateId}]
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Solar system:{" "}
                <DisplaySolarsystem
                  solarSystemId={linkedGate.solarSystem?.solarSystemId.toString()}
                />
              </ListItemText>
            </ListItem>
          </List>
        )}
      </Paper>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        Gates In Range
      </Typography>
      <Paper elevation={1}>
        {gateInRange.length === 0 && (
          <Typography variant="body1" padding={2}>
            None
          </Typography>
        )}
        {gateInRange.length > 0 && (
          <Box p={2}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Solar system</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gateInRange.map((g) => (
                  <TableRow key={g.itemId}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <DisplayAssemblyIcon
                          typeId={g.typeId}
                          stateId={g.stateId}
                          tooltip
                        />
                        <DisplayAssembly
                          id={g.id}
                          itemId={g.itemId}
                          name={g.name}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <DisplaySolarsystem
                        solarSystemId={g.solarSystem?.solarSystemId.toString()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default SmartGateLink;
