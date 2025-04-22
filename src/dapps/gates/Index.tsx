import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useMudSql, useSmartCharacter } from "@/contexts/AppContext";
import ButtonAssembly from "@/components/buttons/ButtonAssembly";
import SolarsystemName from "@/components/ui/SolarsystemName";

const Index: React.FC = () => {
  const mudSql = useMudSql();
  const smartCharacter = useSmartCharacter();

  // const owner = smartCharacter.isConnected ? smartCharacter.address : undefined;
  const owner = "0x8e7bbf2dc8e3866201aa1171f0ada88b45eb5dd9";

  const query = useQuery({
    queryKey: ["GateAccess", "Smartgates", owner],
    queryFn: async () =>
      mudSql
        .listAssemblies({ owners: owner })
        .then((assemblies) =>
          assemblies.filter(
            (assembly) =>
              assembly.typeId === 84955 && [2, 3].includes(assembly.state)
          )
        ),
    enabled: !!owner,
  });

  const gates = query.data;

  return (
    <Box m={2}>
      <PaperLevel1 title="Select a gate to manage" loading={query.isLoading}>
        {gates && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width={250}>Solar system</TableCell>
                <TableCell width={250}>Access</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query.data?.map((gate) => (
                <TableRow key={gate.id}>
                  <TableCell>
                    <ButtonAssembly key={gate.id} id={gate.id} to={`/dapps/gateaccess/${gate.id}`} />
                  </TableCell>
                  <TableCell>
                    <SolarsystemName solarSystemId={gate.solarSystemId} />
                  </TableCell>
                  <TableCell>Unmanaged</TableCell>
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
