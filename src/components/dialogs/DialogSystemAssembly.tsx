import React from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import {
  useMudSql,
  useMudWeb3,
  usePushTrackingEvent,
} from "@/contexts/AppContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import useValueChanged from "@/tools/useValueChanged";
import { Hex, isHex } from "viem";
import { System } from "@shared/mudsql";
import { shorten } from "@/tools";

interface DialogSystemAssemblyProps {
  assemblyId: string;
  title: string;
  owner: string;
  open: boolean;
  type: "gate" | "turret";
  onClose: () => void;
}

const excludeNamespaces = [
  "",
  "evefrontier",
  "sofaccess",
  "eveerc20",
  "metadata",
  "puppet",
];

const DialogSystemAssembly: React.FC<DialogSystemAssemblyProps> = ({
  assemblyId,
  owner,
  title,
  open,
  type,
  onClose,
}) => {
  const pushTrackingEvent = usePushTrackingEvent();
  const [selectedValue, setSelectedValue] = React.useState("default");
  const [currentSystemId, setCurrentrSystemId] = React.useState<System | null>(
    null
  );
  const [userSystemId, setUserSystemId] = React.useState<System | null>(null);
  const [customSystemId, setCustomSystemId] = React.useState("");
  const radioGroupId = React.useId();
  const mudSql = useMudSql();
  const mudWeb3 = useMudWeb3();

  const querySystems = useQuery({
    queryKey: ["Systems"],
    queryFn: () =>
      mudSql.listSystems().then((systems) =>
        systems.reduce(
          (acc, sys) => {
            if (excludeNamespaces.includes(sys.namespace)) return acc;
            if (sys.namespaceOwner === owner) {
              acc.currentUserSystems.push(sys);
            } else {
              acc.otherUsersSystems.push(sys);
            }
            return acc;
          },
          {
            currentUserSystems: [] as System[],
            otherUsersSystems: [] as System[],
          }
        )
      ),
  });

  const systems = querySystems.data;

  const querySystemId = useQuery({
    queryKey: ["SmartAssemblySystemId", assemblyId],
    queryFn: async () => {
      if (type === "gate") {
        return mudWeb3.gateGetSystem({ gateId: BigInt(assemblyId) });
      } else if (type === "turret") {
        mudWeb3.turretGetSystem({ turretId: BigInt(assemblyId) });
      } else {
        throw new Error(`Invalid type ${type}`);
      }
    },
    enabled: open,
  });

  const hydrate = React.useCallback(() => {
    if (systems && querySystemId.data) {
      const fromCurrentUser = systems.currentUserSystems.find(
        (s) => s.systemId === querySystemId.data
      );
      const fromOtherUsers = systems.otherUsersSystems.find(
        (s) => s.systemId === querySystemId.data
      );
      if (
        querySystemId.data ===
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        setSelectedValue("default");
      } else if (fromCurrentUser) {
        setSelectedValue("own");
        setCurrentrSystemId(fromCurrentUser);
      } else if (fromOtherUsers) {
        setSelectedValue("another");
        setUserSystemId(fromOtherUsers);
      } else {
        setSelectedValue("custom");
        setCustomSystemId(querySystemId.data);
      }
    }
  }, [systems, querySystemId.data]);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  const mutateState = useMutation({
    mutationFn: () => {
      let systemId: Hex =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      if (selectedValue === "custom") {
        const id = customSystemId.trim();
        if (!isHex(id)) {
          throw new Error("Invalid custom system Id");
        }
        if (id.length !== 66) {
          throw new Error("Invalid custom system Id length");
        }
        systemId = id;
      } else if (selectedValue === "own") {
        if (!currentSystemId) {
          throw new Error("Please select a system");
        }
        systemId = currentSystemId.systemId;
      } else if (selectedValue === "another") {
        if (!userSystemId) {
          throw new Error("Please select a system");
        }
        systemId = userSystemId.systemId;
      } else if (selectedValue === "default") {
        systemId =
          "0x0000000000000000000000000000000000000000000000000000000000000000";
      } else {
        throw new Error("Select a valid option");
      }
      if (type === "gate") {
        return mudWeb3.gateSetSystem({ gateId: BigInt(assemblyId), systemId });
      } else if (type === "turret") {
        return mudWeb3.turretSetSystem({
          turretId: BigInt(assemblyId),
          systemId,
        });
      } else {
        throw new Error(`Invalid type ${type}`);
      }
    },
    onSuccess() {
      pushTrackingEvent(`web3://assemblySystem`);
    },
    onSettled() {
      querySystemId.refetch();
    },
    retry: false,
  });

  useValueChanged((v) => {
    if (v) {
      querySystemId.refetch().then(() => hydrate());
      mutateState.reset();
    }
  }, open);

  const isLoading =
    querySystemId.isFetching ||
    mutateState.isPending ||
    querySystems.isFetching;

  return (
    <>
      <BaseWeb3Dialog
        title={title}
        open={open}
        owner={owner}
        size="md"
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
        actions={
          <>
            {!mutateState.isSuccess && (
              <Button
                variant="contained"
                onClick={() => mutateState.mutate()}
                loading={isLoading}
              >
                Save
              </Button>
            )}
          </>
        }
        txError={mutateState.error}
        txReceipt={mutateState.data}
      >
        <FormControl fullWidth>
          <FormLabel id={radioGroupId}>Link this assembly to:</FormLabel>
          <RadioGroup
            aria-labelledby={radioGroupId}
            value={selectedValue}
            onChange={(v) => setSelectedValue(v.target.value)}
          >
            <FormControlLabel
              value="default"
              control={<Radio />}
              label="The default game system"
              disabled={isLoading}
            />
            <FormControlLabel
              value="own"
              control={<Radio />}
              label="A system you own"
              disabled={isLoading}
            />
            <FormControlLabel
              value="another"
              control={<Radio />}
              label="A system from another player"
              disabled={isLoading}
            />
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label="A system Id"
              disabled={isLoading}
            />
            <Collapse in={selectedValue === "custom"}>
              <TextField
                label="Custom system Id"
                value={customSystemId}
                onChange={(e) => setCustomSystemId(e.target.value)}
                disabled={isLoading}
                fullWidth
              />
            </Collapse>
            {systems && (
              <>
                <Collapse in={selectedValue === "own"}>
                  <Autocomplete
                    options={systems.currentUserSystems}
                    value={currentSystemId}
                    getOptionLabel={(sys: System) =>
                      `${sys.namespace}.${sys.name} [${sys.namespaceOwnerName || shorten(sys.namespaceOwner)}]`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.systemId === value.systemId
                    }
                    onChange={(_, newValue) => setCurrentrSystemId(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select a system" />
                    )}
                    disabled={isLoading}
                    openOnFocus
                    fullWidth
                  />
                </Collapse>
                <Collapse in={selectedValue === "another"}>
                  <Autocomplete
                    options={systems.otherUsersSystems}
                    value={userSystemId}
                    getOptionLabel={(sys: System) =>
                      `${sys.namespace}.${sys.name} [${sys.namespaceOwnerName || shorten(sys.namespaceOwner)}]`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.systemId === value.systemId
                    }
                    onChange={(_, newValue) => setUserSystemId(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select a system" />
                    )}
                    disabled={isLoading}
                    openOnFocus
                    fullWidth
                  />
                </Collapse>
              </>
            )}
          </RadioGroup>
        </FormControl>
        <Alert severity="info" sx={{ mt: 2 }}>
          There is no guard to check the system exists, is valid for your
          assembly by implementing the required interface or anything else.
          <br />
          You can <strong>always revert</strong> to the default system.
        </Alert>
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogSystemAssembly);
