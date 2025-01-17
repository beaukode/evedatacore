import React from "react";
import { Alert, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";
import DisplaySystem from "./DisplaySystem";
import DisplayOwner from "./DisplayOwner";
import DisplayNamespace from "./DisplayNamespace";

interface SmartGateConfigProps {
  gateId: string;
}

const SmartGateConfig: React.FC<SmartGateConfigProps> = ({ gateId }) => {
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartGateConfig", gateId],
    queryFn: async () => mudSql.getGateConfig(gateId),
  });

  const data = query.data;
  const system = data?.system;

  return (
    <PaperLevel1 title="Behavior" loading={query.isFetching}>
      {data && (
        <>
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="System Id">{data.systemId}</BasicListItem>
            {!data.defaultSystem && system && (
              <>
                <BasicListItem title="System name" disableGutters>
                  <DisplaySystem id={system.systemId} name={system.name} />
                </BasicListItem>
                <BasicListItem title="System namespace" disableGutters>
                  <DisplayNamespace
                    id={system.namespaceId}
                    name={system.namespace}
                  />
                </BasicListItem>
                <BasicListItem title="System owner" disableGutters>
                  <DisplayOwner
                    address={system.namespaceOwner}
                    name={system.namespaceOwnerName}
                  />
                </BasicListItem>
              </>
            )}
          </List>
          {!data.defaultSystem && !system && (
            <Alert severity="warning">
              System not found: This smart assembly may not works or use the
              default game behavior
            </Alert>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default SmartGateConfig;
