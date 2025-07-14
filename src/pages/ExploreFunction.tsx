import React from "react";
import { Helmet } from "react-helmet";
import { Alert, Box, Grid2, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import { decodeFunctionSignature } from "@shared/mudweb3";
import { toJson } from "@/tools";
import { getFunctionId } from "@/api/evedatacore-v2";

const grid3perRow = { sm: 12, md: 4 };

const ExploreFunction: React.FC = () => {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["Function", id],
    queryFn: async () => {
      if (!id) return null;
      const r = await getFunctionId({ path: { id: id } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!id,
  });

  const title = React.useMemo(() => {
    if (!query.data) return "...";
    return query.data.signature.split("(")[0] || "function";
  }, [query.data]);

  const data = query.data;

  const { abi, decodeError } = React.useMemo(() => {
    if (!data?.signature) return {};
    return decodeFunctionSignature(data?.signature);
  }, [data?.signature]);

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1 title={title} loading={query.isFetching} backButton>
        {data && (
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            <Grid2 size={grid3perRow}>
              Owner:{" "}
              {data.account && (
                <>
                  {data.ownerName && (
                    <ButtonCharacter
                      address={data.account}
                      name={data.ownerName}
                    />
                  )}
                  {!data.ownerName && data.account}
                </>
              )}
            </Grid2>
            <Grid2 size={grid3perRow}>
              Namespace:{" "}
              <ButtonNamespace id={data.namespaceId} name={data.namespace} />
            </Grid2>
            <Grid2 size={grid3perRow}>
              System:{" "}
              {data.systemId && data.systemName && (
                <ButtonSystem id={data.systemId} name={data.systemName} />
              )}
            </Grid2>
            <Grid2 size={grid3perRow}>World selector: {data.id}</Grid2>
            <Grid2 size={grid3perRow}>
              System selector: {data.systemSelector}
            </Grid2>
            <Grid2 size={12}>Signature: {data.signature}</Grid2>
          </Grid2>
        )}

        {abi && (
          <TextField
            label="ABI"
            value={toJson(abi)}
            variant="outlined"
            maxRows={20}
            multiline
            fullWidth
          />
        )}
        {decodeError && (
          <Alert severity="error">
            Unable to decode function signature
            <br />
            {decodeError}
          </Alert>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default ExploreFunction;
