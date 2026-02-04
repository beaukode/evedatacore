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
import { useQueryClient } from "@tanstack/react-query";
import { lyDistance, Location, tsToDateTime, metersToLy } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import ButtonAssembly from "./buttons/ButtonAssembly";
import ButtonSolarsystem from "./buttons/ButtonSolarsystem";
import PaperLevel1 from "./ui/PaperLevel1";
import DisplayAssemblyIcon from "./DisplayAssemblyIcon";
import DialogGateLink from "./dialogs/DialogGateLink";
import ConditionalMount from "./ui/ConditionalMount";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";
import { getCharacterIdAssemblies } from "@/api/evedatacore-v2";

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

  const query = usePaginatedQuery({
    queryKey: ["AssembliesByOwner", owner],
    queryFn: async ({ pageParam }) => {
      if (!owner) return { items: [] };
      const r = await getCharacterIdAssemblies({
        path: { id: owner },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
    enabled: !!owner,
  });

  const currentGate = React.useMemo(() => {
    if (!query.data) return undefined;
    return query.data.find((a) => a.id === currentGateId);
  }, [query.data, currentGateId]);

  const gates = React.useMemo(() => {
    if (!query.data) return undefined;
    return query.data
      .filter(
        (a) =>
          a.assemblyType == "SG" &&
          a.id !== currentGateId &&
          (a.currentState === 2 || a.currentState === 3)
      )
      .map((gate) => {
        const ly =
          currentGateLocation && gate.x && gate.y && gate.z
            ? lyDistance(currentGateLocation, [gate.x, gate.y, gate.z])
            : undefined;
        const distance = ly
          ? {
              ly,
              inRange: ly < metersToLy(currentGate?.maxDistance || "0"),
            }
          : undefined;
        return {
          ...gate,
          distance,
        };
      });
  }, [query.data, currentGateId, currentGateLocation, currentGate]);

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
      {currentGate && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Current gate max distance:{" "}
          {metersToLy(currentGate.maxDistance || "0").toFixed(0)}Ly
        </Typography>
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
                        stateId={gate.currentState}
                        sx={{ mr: 1 }}
                        tooltip
                      />
                      <ButtonAssembly id={gate.id} name={gate.name} />{" "}
                      <ButtonWeb3Interaction
                        title="Link this gate"
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
