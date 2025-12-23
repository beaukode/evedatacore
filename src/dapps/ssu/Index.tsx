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
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { useSmartCharacter } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonAssembly from "@/components/buttons/ButtonAssembly";
import SolarsystemName from "@/components/ui/SolarsystemName";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import { getCharacterIdAssemblies } from "@/api/evedatacore-v2";
import { isDappUrlSet } from "./lib/utils";

const Index: React.FC = () => {
  const smartCharacter = useSmartCharacter();

  const owner = smartCharacter.isConnected
    ? smartCharacter.address.toLowerCase()
    : undefined;

  const query = usePaginatedQuery({
    queryKey: ["SsuDapp", "SmartStorages", owner],
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

  const queryState = useQuery({
    queryKey: ["SsuDapp", "SmartStoragesState", owner],
    queryFn: async () => {
      if (!query.data) return null;
      return query.data.filter(
        (ssu) =>
          ssu.assemblyType === "storage" &&
          (ssu.currentState === 3 || ssu.currentState === 2)
      );
    },
    enabled: !!query.data,
  });

  const ssus = queryState.data;

  return (
    <Box m={2}>
      <PaperLevel1 title="Select a SSU to configure" loading={query.isFetching}>
        {ssus && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width={250}>Location</TableCell>
                <TableCell width={250}>Enabled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ssus.map((ssu) => (
                <TableRow key={ssu.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DisplayAssemblyIcon
                        typeId={ssu.typeId}
                        stateId={ssu.currentState}
                        sx={{ mr: 1 }}
                        tooltip
                      />
                      <ButtonAssembly
                        name={ssu.name}
                        key={ssu.id}
                        id={ssu.id}
                        to={`/dapps/ssu/${ssu.id}?back=true`}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <SolarsystemName solarSystemId={ssu.solarSystemId} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {isDappUrlSet(ssu) ? (
                      <Typography variant="inherit">Yes</Typography>
                    ) : (
                      <Typography variant="inherit" color="warning">
                        No
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
