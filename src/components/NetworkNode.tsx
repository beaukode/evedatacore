import React from "react";
import {
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { tsToDateTime } from "@/tools";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";
import DisplayAssemblyIcon from "./DisplayAssemblyIcon";
import ButtonAssembly from "./buttons/ButtonAssembly";
import { getAssemblyIdNetwork } from "@/api/evedatacore-v2";
import { assemblyTypeMap } from "@/api/mudsql";

interface NetworkNodeProps {
  id: string;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ["NetworkNode", id],
    queryFn: async () => {
      const r = await getAssemblyIdNetwork({ path: { id } });
      if (!r.data) return null;
      return r.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const data = query.data;
  const unknown = !data && !query.isFetching;

  return (
    <>
      <PaperLevel1 title="Network" loading={query.isFetching}>
        {unknown && <Typography variant="body1">Unknown</Typography>}
        {data && (
          <>
            <List
              sx={{ width: "100%", overflow: "hidden", pb: 2 }}
              disablePadding
            >
              <BasicListItem
                title="Energy (reserved / produced / max)"
                disableGutters
              >
                {data.totalReservedEnergy} / {data.energyProduced} /{" "}
                {data.maxEnergyCapacity}
              </BasicListItem>
            </List>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell width={250}>Anchored At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((sa) => {
                  return (
                    <TableRow key={sa.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DisplayAssemblyIcon
                            typeId={
                              assemblyTypeMap[
                                sa.assemblyType as keyof typeof assemblyTypeMap
                              ]
                            }
                            stateId={sa.currentState}
                            sx={{ mr: 1 }}
                            tooltip
                          />
                          <ButtonAssembly id={sa.id} name={sa.name} />
                        </Box>
                      </TableCell>
                      <TableCell>{tsToDateTime(sa.anchoredAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </PaperLevel1>
    </>
  );
};

export default NetworkNode;
