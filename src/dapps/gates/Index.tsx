import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash-es";
import { AssemblyType, AssemblyState, Gate } from "@shared/mudsql";
import { useMudSql, useSmartCharacter } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonAssembly from "@/components/buttons/ButtonAssembly";
import SolarsystemName from "@/components/ui/SolarsystemName";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import { isGateManaged } from "./lib/utils";

const Index: React.FC = () => {
  const mudSql = useMudSql();
  const smartCharacter = useSmartCharacter();

  const owner = smartCharacter.isConnected ? smartCharacter.address : undefined;

  const query = useQuery({
    queryKey: ["GatesDapp", "Smartgates", owner],
    queryFn: async () =>
      mudSql.listGates({
        owners: owner,
        types: AssemblyType.Gate,
        states: [AssemblyState.Anchored, AssemblyState.Online],
      }),
    enabled: !!owner,
  });

  const gates = query.data;
  const gatesById = keyBy(gates, "id");

  function getGateDestination(gate: Gate) {
    if (gate.isLinked && gate.destinationId) {
      const destination = gatesById[gate.destinationId];
      if (!destination) {
        return "Not found";
      }
      return <SolarsystemName solarSystemId={destination.solarSystemId} />;
    }
    return "-";
  }

  return (
    <Box m={2}>
      <PaperLevel1 title="Select a gate to manage" loading={query.isLoading}>
        {gates && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width={250}>Location</TableCell>
                <TableCell width={250}>Destination</TableCell>
                <TableCell width={250}>Access</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query.data?.map((gate) => (
                <TableRow key={gate.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DisplayAssemblyIcon
                        typeId={gate.typeId}
                        stateId={gate.state}
                        sx={{ mr: 1 }}
                        tooltip
                      />
                      <ButtonAssembly
                        name={gate.name}
                        key={gate.id}
                        id={gate.id}
                        to={`/dapps/gates/${gate.id}`}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <SolarsystemName solarSystemId={gate.solarSystemId} />
                  </TableCell>
                  <TableCell>{getGateDestination(gate)}</TableCell>
                  <TableCell>
                    {isGateManaged(gate) ? (
                      <Typography variant="inherit">Managed</Typography>
                    ) : (
                      <Typography variant="inherit" color="warning">
                        Not managed
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default Index;
