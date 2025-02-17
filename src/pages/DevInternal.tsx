import React from "react";
import { Alert, Box, Button, Grid2, TextField } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useMudWeb3 } from "@/contexts/AppContext";
import { toJson } from "@/tools";
import { Helmet } from "react-helmet";

const DevInternal: React.FC = () => {
  const [data, setData] = React.useState<string>("");
  const [result, setResult] = React.useState<unknown>();
  const [error, setError] = React.useState<unknown>();

  const mudWeb3 = useMudWeb3();

  function createHandler(handler: () => Promise<unknown> | undefined) {
    return () => {
      setError(undefined);
      setResult(undefined);
      const r = handler();
      if (r) {
        r.then(setResult).catch(setError);
      }
    };
  }

  console.log("error", error);

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Internal Dev</title>
      </Helmet>
      <PaperLevel1 title="Internal">
        <Grid2 container spacing={2} sx={{ mb: 2 }}>
          <Grid2 size={12}>
            <TextField
              label="Data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={12}>
            <Button
              onClick={createHandler(() =>
                mudWeb3.assemblyGetState({ assemblyId: BigInt(data) })
              )}
              variant="contained"
              sx={{ mr: 1 }}
            >
              Test 1
            </Button>
            <Button
              onClick={createHandler(() =>
                mudWeb3.assemblyBringOnline({ assemblyId: BigInt(data) })
              )}
              variant="contained"
              disabled={!mudWeb3.isWriteClient}
              sx={{ mr: 1 }}
            >
              Test 2
            </Button>
            <Button
              onClick={createHandler(() =>
                mudWeb3.assemblyBringOffline({ assemblyId: BigInt(data) })
              )}
              variant="contained"
              disabled={!mudWeb3.isWriteClient}
              sx={{ mr: 1 }}
            >
              Test 3
            </Button>
            {!!error && (
              <Alert severity="error">
                <pre>{`${error}`}</pre>
                <pre>{toJson(error)}</pre>
              </Alert>
            )}
            {!!result && <pre>{toJson(result)}</pre>}
          </Grid2>
        </Grid2>
      </PaperLevel1>
    </Box>
  );
};

export default DevInternal;
