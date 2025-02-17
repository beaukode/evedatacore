import React from "react";
import {
  Box,
  Button,
  DialogContentText,
  Skeleton,
  Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import UnlinkIcon from "@mui/icons-material/LinkOff";
import BaseWeb3Dialog from "./BaseWeb3Dialog";
import { useMudWeb3, useSolarSystemsIndex } from "@/contexts/AppContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import useValueChanged from "@/tools/useValueChanged";
import { shorten } from "@/tools";
import { upperFirst } from "lodash-es";

interface GateInfoProps {
  id: string;
  name?: string;
  location?: string;
}

const GateInfo: React.FC<GateInfoProps> = ({ id, name, location }) => {
  return (
    <>
      <Typography variant="body1">
        {name || shorten(id)} ({location})
      </Typography>
      {name && (
        <Typography variant="caption" color="secondary">
          {shorten(id)}
        </Typography>
      )}
    </>
  );
};

interface DialogGateLinkProps {
  sourceGateId: string;
  destinationGateId: string;
  owner: string;
  action: "link" | "unlink";
  open: boolean;
  onClose: () => void;
}

const DialogGateLink: React.FC<DialogGateLinkProps> = ({
  sourceGateId,
  destinationGateId,
  owner,
  action,
  open,
  onClose,
}) => {
  const mudWeb3 = useMudWeb3();
  const solarSystems = useSolarSystemsIndex();

  const query = useQuery({
    queryKey: ["SmartGateLink", sourceGateId, destinationGateId],
    queryFn: async () =>
      Promise.all([
        mudWeb3.assemblyGetMetadata({ assemblyId: BigInt(sourceGateId) }),
        mudWeb3.assemblyGetMetadata({ assemblyId: BigInt(destinationGateId) }),
        mudWeb3.assemblyGetLocation({ assemblyId: BigInt(sourceGateId) }),
        mudWeb3.assemblyGetLocation({ assemblyId: BigInt(destinationGateId) }),
      ]),
    enabled: open,
  });

  const [
    sourceGate,
    destinationGate,
    sourceGateLocation,
    destinationGateLocation,
  ] = query.data || [];

  const { sourceSolarSystem, destinationSolarSystem } = React.useMemo(() => {
    if (!solarSystems) return {};
    return {
      sourceSolarSystem: solarSystems?.getById(
        sourceGateLocation?.solarSystemId.toString() || ""
      ),
      destinationSolarSystem: solarSystems?.getById(
        destinationGateLocation?.solarSystemId.toString() || ""
      ),
    };
  }, [solarSystems, sourceGateLocation, destinationGateLocation]);

  const mutate = useMutation({
    mutationFn: () => {
      if (action === "link") {
        return mudWeb3.gateLink({
          gateId: BigInt(sourceGateId),
          destinationGateId: BigInt(destinationGateId),
        });
      } else {
        return mudWeb3.gateUnlink({
          gateId: BigInt(sourceGateId),
          destinationGateId: BigInt(destinationGateId),
        });
      }
    },
    onSuccess() {
      query.refetch();
    },
    retry: false,
  });

  useValueChanged((v) => {
    if (v) {
      query.refetch();
      mutate.reset();
    }
  }, open);

  const isLoading = query.isFetching || mutate.isPending;

  return (
    <>
      <BaseWeb3Dialog
        title={upperFirst(action) + " gates"}
        open={open}
        owner={owner}
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
        actions={
          <Button
            variant="contained"
            onClick={() => mutate.mutate()}
            loading={isLoading}
            disabled={mutate.isSuccess}
          >
            {upperFirst(action)}
          </Button>
        }
        txError={mutate.error}
        txReceipt={mutate.data}
      >
        <DialogContentText gutterBottom>
          You are about to {action} gates:
        </DialogContentText>
        <Box mt={2} display="flex" alignItems="center" flexDirection="column">
          {query.isFetching && (
            <Skeleton variant="rounded" width={300} height={30} />
          )}
          {!query.isFetching && (
            <GateInfo
              id={sourceGateId}
              name={sourceGate?.name}
              location={sourceSolarSystem?.solarSystemName}
            />
          )}
          <Box m={1}>
            {action === "link" ? (
              <LinkIcon fontSize="large" />
            ) : (
              <UnlinkIcon fontSize="large" />
            )}
          </Box>
          {query.isFetching && (
            <Skeleton variant="rounded" width={300} height={30} />
          )}
          {!query.isFetching && (
            <GateInfo
              id={destinationGateId}
              name={destinationGate?.name}
              location={destinationSolarSystem?.solarSystemName}
            />
          )}
        </Box>
      </BaseWeb3Dialog>
    </>
  );
};

export default React.memo(DialogGateLink);
