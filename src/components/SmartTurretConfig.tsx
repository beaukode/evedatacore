import React from "react";
import { Alert, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";
import ButtonSystem from "./buttons/ButtonSystem";
import ButtonCharacter from "./buttons/ButtonCharacter";
import ButtonNamespace from "./buttons/ButtonNamespace";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";
import DialogSystemAssembly from "./dialogs/DialogSystemAssembly";
import ConditionalMount from "./ui/ConditionalMount";

interface SmartTurretConfigProps {
  turretId: string;
  owner: string;
}

const SmartTurretConfig: React.FC<SmartTurretConfigProps> = ({
  turretId,
  owner,
}) => {
  const [editSystemOpen, setEditSystemOpen] = React.useState(false);
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartTurretConfig", turretId],
    queryFn: async () => mudSql.getTurretConfig(turretId),
  });

  const data = query.data;
  const system = data?.system;

  return (
    <PaperLevel1 title="Behavior" loading={query.isFetching}>
      {data && (
        <>
          <ConditionalMount mount={editSystemOpen} keepMounted>
            <DialogSystemAssembly
              open={editSystemOpen}
              assemblyId={turretId}
              owner={owner}
              type="turret"
              title="Edit linked system"
              onClose={() => {
                setEditSystemOpen(false);
                query.refetch();
              }}
            />
          </ConditionalMount>
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem
              title={
                <>
                  System Id
                  <ButtonWeb3Interaction
                    title="Edit assembly system"
                    onClick={() => setEditSystemOpen(true)}
                  />
                </>
              }
            >
              {data.systemId}
            </BasicListItem>
            {!data.defaultSystem && system && (
              <>
                <BasicListItem title="System name" disableGutters>
                  <ButtonSystem id={system.systemId} name={system.name} />
                </BasicListItem>
                <BasicListItem title="System namespace" disableGutters>
                  <ButtonNamespace
                    id={system.namespaceId}
                    name={system.namespace}
                  />
                </BasicListItem>
                <BasicListItem title="System owner" disableGutters>
                  <ButtonCharacter
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

export default SmartTurretConfig;
