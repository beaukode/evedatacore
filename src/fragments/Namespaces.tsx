import React from "react";
import { useMudSqlIndexer } from "../mud/MudContext";
import {
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

interface NamespacesProps {
  owner: string;
}

const Namespaces: React.FC<NamespacesProps> = ({ owner }) => {
  const { listNamespaces } = useMudSqlIndexer();

  const query = useQuery({
    queryKey: ["Namespaces", owner],
    queryFn: async () => await listNamespaces({ owners: owner }),
  });

  const namespaces = query.data || [];

  return (
    <>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        Namespaces{" "}
        <Chip
          label="Mud"
          size="small"
          sx={{
            backgroundColor: "#ff7612",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Typography>
      <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
        <LinearProgress
          sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
        />
        {namespaces.length === 0 && (
          <Typography variant="body1">None</Typography>
        )}
        {namespaces.length > 0 && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Id</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {namespaces.map((ns) => {
                return (
                  <TableRow key={ns.namespaceId}>
                    <TableCell>{ns.name}</TableCell>
                    <TableCell>{ns.namespaceId}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </>
  );
};

export default Namespaces;
