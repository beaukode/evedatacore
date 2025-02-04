import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import ButtonAssembly from "./buttons/ButtonAssembly";
import ButtonSolarsystem from "./buttons/ButtonSolarsystem";
import PaperLevel1 from "./ui/PaperLevel1";
import { lyDistance, Location, tsToDateTime } from "@/tools";
import DisplayAssemblyIcon from "./DisplayAssemblyIcon";
import DialogGateLink from "./dialogs/DialogGateLink";
import ConditionalMount from "./ui/ConditionalMount";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";

interface SmartGateOtherProps {
  owner: string;
  currentGateId: string;
  currentGateLocation?: Location;
}

const SmartGateOther: React.FC<SmartGateOtherProps> = ({
  owner,
  currentGateId,
  currentGateLocation,
}) => {
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkDestinationId, setLinkDestinationId] = React.useState("");
  const queryClient = useQueryClient();
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["AssembliesByOwner", owner],
    queryFn: async () => mudSql.listAssemblies({ owners: owner }),
    staleTime: 1000 * 60,
    retry: false,
  });

  const gates = React.useMemo(() => {
    if (!query.data) return undefined;
    return query.data
      .filter(
        (a) =>
          a.typeId == 84955 &&
          a.id !== currentGateId &&
          (a.state === 2 || a.state === 3)
      )
      .map((gate) => {
        const ly =
          currentGateLocation && gate.location
            ? lyDistance(currentGateLocation, gate.location)
            : undefined;
        const distance = ly ? { ly, inRange: ly < 500 } : undefined;
        return {
          ...gate,
          distance,
        };
      });
  }, [query.data, currentGateId, currentGateLocation]);

  return (
    <PaperLevel1 title="User’s Other Gates" loading={query.isFetching}>
      <ConditionalMount mount={linkOpen} keepMounted>
        <DialogGateLink
          open={linkOpen}
          sourceGateId={currentGateId}
          destinationGateId={linkDestinationId}
          owner={owner}
          action="link"
          onClose={() => {
            setLinkOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["SmartGateLink", currentGateId],
            });
          }}
        />
      </ConditionalMount>
      {gates?.length === 0 && !query.isFetching && (
        <Typography variant="body1">None</Typography>
      )}
      {gates && (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell width={250}>Distance</TableCell>
              <TableCell width={250}>Solar system</TableCell>
              <TableCell width={250}>Anchored At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gates.map((gate) => {
              return (
                <TableRow key={gate.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DisplayAssemblyIcon
                        typeId={gate.typeId}
                        stateId={gate.state}
                        sx={{ mr: 1 }}
                        tooltip
                      />
                      <ButtonAssembly id={gate.id} name={gate.name} />{" "}
                      <ButtonWeb3Interaction
                        title="Unlink gates"
                        onClick={() => {
                          setLinkOpen(true);
                          setLinkDestinationId(gate.id);
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {gate.distance === undefined ? (
                      "Error"
                    ) : (
                      <Box
                        sx={{
                          color: gate.distance.inRange
                            ? "primary.main"
                            : "warning.main",
                        }}
                        component="span"
                      >
                        {gate.distance.ly.toFixed(2)}Ly
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <ButtonSolarsystem solarSystemId={gate.solarSystemId} />
                  </TableCell>
                  <TableCell>{tsToDateTime(gate.anchoredAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </PaperLevel1>
  );
};

export default SmartGateOther;
