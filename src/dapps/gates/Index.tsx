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
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { keyBy } from "lodash-es";
import { useSmartCharacter } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonAssembly from "@/components/buttons/ButtonAssembly";
import SolarsystemName from "@/components/ui/SolarsystemName";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import { Assembly, isGateManaged } from "./lib/utils";
import { getCharacterIdAssemblies } from "@/api/evedatacore-v2";
import { AssemblyState, assemblyTypeMap } from "@/api/mudsql";

const Index: React.FC = () => {
  const smartCharacter = useSmartCharacter();

  const owner = smartCharacter.isConnected
    ? smartCharacter.address.toLowerCase()
    : undefined;

  const query = usePaginatedQuery({
    queryKey: ["GatesDapp", "Smartgates", owner],
    queryFn: async ({ pageParam }) => {
      if (!owner) return { items: [] };
      const r = await getCharacterIdAssemblies({
        path: { id: owner },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [] };
      return r.data;
    },
    staleTime: 1000 * 60,
  });

  const gates = React.useMemo(() => {
    if (!query.data) return null;
    return query.data.filter(
      (gate) =>
        gate.assemblyType === "SG" &&
        (gate.currentState === AssemblyState.Online ||
          gate.currentState === AssemblyState.Anchored)
    );
  }, [query.data]);
  const gatesById = keyBy(gates, "id");

  function getGateDestination(gate: Assembly) {
    if (gate.linkedGateId) {
      const destination = gatesById[gate.linkedGateId];
      if (!destination) {
        return "Not found";
      }
      return <SolarsystemName solarSystemId={destination.solarSystemId} />;
    }
    return "-";
  }

  return (
    <Box m={2}>
      <PaperLevel1 title="Select a gate to manage" loading={query.isFetching}>
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
              {gates.map((gate) => (
                <TableRow key={gate.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DisplayAssemblyIcon
                        typeId={
                          assemblyTypeMap[
                            gate.assemblyType as keyof typeof assemblyTypeMap
                          ]
                        }
                        stateId={gate.currentState}
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
                    {isGateManaged(gate) && gate.datacoreGate ? (
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
