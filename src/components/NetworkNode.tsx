import React from "react";
import { List, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";

interface NetworkNodeProps {
  id: string;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ id }) => {
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["NetworkNode", id],
    queryFn: async () => mudSql.getNetworkNode(id),
  });

  const data = query.data;
  const unknown = !data && !query.isFetching;

  return (
    <>
      <PaperLevel1 title="Network" loading={query.isFetching}>
        {unknown && <Typography variant="body1">Unknown</Typography>}
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem
              title="Energy (reserved / produced / max)"
              disableGutters
            >
              {data.reservedEnergy} / {data.producedEnergy} / {data.maxEnergy}
            </BasicListItem>
          </List>
        )}
      </PaperLevel1>
    </>
  );
};

export default NetworkNode;
