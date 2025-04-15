import React from "react";
import { Alert, Box, Button, Grid2, TextField } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useMudWeb3 } from "@/contexts/AppContext";
import { toJson } from "@/tools";
import { Helmet } from "react-helmet";

const DevInternal: React.FC = () => {
  const [data1, setData1] = React.useState<string>("");
  const [data2, setData2] = React.useState<string>("");
  const [data3, setData3] = React.useState<string>("");
  const [data4, setData4] = React.useState<string>("");
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
              label="Data 1"
              value={data1}
              onChange={(e) => setData1(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data 2"
              value={data2}
              onChange={(e) => setData2(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data 3"
              value={data3}
              onChange={(e) => setData3(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data 4"
              value={data4}
              onChange={(e) => setData4(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={12}>
            <Button
              onClick={createHandler(() =>
                mudWeb3.assemblyGetState({ assemblyId: BigInt(data1) })
              )}
              variant="contained"
              sx={{ mr: 1 }}
            >
              Test 1
            </Button>
            <Button
              onClick={createHandler(() =>
                mudWeb3.assemblyBringOnline({ assemblyId: BigInt(data1) })
              )}
              variant="contained"
              disabled={!mudWeb3.isWriteClient}
              sx={{ mr: 1 }}
            >
              Test 2
            </Button>
            <Button
              onClick={createHandler(() =>
                mudWeb3.assemblyBringOffline({ assemblyId: BigInt(data1) })
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
