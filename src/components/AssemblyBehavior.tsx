import React from "react";
import { Alert, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";
import ButtonSystem from "./buttons/ButtonSystem";
import ButtonCharacter from "./buttons/ButtonCharacter";
import ButtonNamespace from "./buttons/ButtonNamespace";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";
import DialogSystemAssembly from "./dialogs/DialogSystemAssembly";
import ConditionalMount from "./ui/ConditionalMount";
import { getSystemId } from "@/api/evedatacore-v2";

interface AssemblyBehaviorProps {
  systemId?: string;
  assemblyId: string;
  owner: string;
  type: "gate" | "turret";
  onChange: () => void;
}

const AssemblyBehavior: React.FC<AssemblyBehaviorProps> = ({
  systemId,
  assemblyId,
  owner,
  type,
  onChange,
}) => {
  const [editSystemOpen, setEditSystemOpen] = React.useState(false);

  systemId =
    systemId ??
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  const isDefaultSystem =
    systemId ===
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  const query = useQuery({
    queryKey: ["System", systemId],
    queryFn: async () => {
      const r = await getSystemId({ path: { id: systemId } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !isDefaultSystem,
  });

  const data = query.data;

  return (
    <PaperLevel1 title="Behavior" loading={query.isFetching}>
      <ConditionalMount mount={editSystemOpen} keepMounted>
        <DialogSystemAssembly
          open={editSystemOpen}
          assemblyId={assemblyId}
          owner={owner}
          type={type}
          title="Edit linked system"
          onClose={() => {
            setEditSystemOpen(false);
            onChange();
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
          {systemId}
        </BasicListItem>
        {data && (
          <>
            <BasicListItem title="System name" disableGutters>
              <ButtonSystem id={data.id} name={data.name} />
            </BasicListItem>
            <BasicListItem title="System namespace" disableGutters>
              <ButtonNamespace id={data.namespaceId} name={data.namespace} />
            </BasicListItem>
            <BasicListItem title="System owner" disableGutters>
              <ButtonCharacter address={data.account} name={data.ownerName} />
            </BasicListItem>
          </>
        )}
      </List>
      {!isDefaultSystem && !data && query.isFetched && (
        <Alert severity="warning">
          System not found: This smart assembly may not works or use the default
          game behavior
        </Alert>
      )}
    </PaperLevel1>
  );
};

export default AssemblyBehavior;
