import React from "react";
import { Alert, Box, Button, Grid2, TextField } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useMudWeb3 } from "@/contexts/AppContext";
import { toJson } from "@/tools";
import { Helmet } from "react-helmet";

const DevInternal: React.FC = () => {
  const [smartObjectId, setSmartObjectId] = React.useState<string>("");
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

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Internal Dev</title>
      </Helmet>
      <PaperLevel1 title="Internal">
        <Grid2 container spacing={2} sx={{ mb: 2 }}>
          <Grid2 size={12}>
            <Button
              onClick={createHandler(() =>
                mudWeb3.erc721balanceOf(
                  "0xD3A030509548652922bcd736f359Ab8a052F6980",
                  "0xF7730eB77b66F21FEa19D49Ee6A4718FF9c0393E"
                )
              )}
              variant="contained"
              sx={{ mr: 1 }}
            >
              ERC 721: Balance Of
            </Button>
            <Button
              onClick={createHandler(() => {
                return mudWeb3.wallet?.erc721transferFrom(
                  "0xD3A030509548652922bcd736f359Ab8a052F6980",
                  "0xaeba6aa155974b5807CBf77c430A74073d69ED1b",
                  "0xF7730eB77b66F21FEa19D49Ee6A4718FF9c0393E",
                  11861973571520147656545735842437132677489931026054966953186802655176544322796n
                );
              })}
              variant="contained"
              disabled={!mudWeb3.wallet}
              sx={{ mr: 1 }}
            >
              ERC 721: Transfert To
            </Button>
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Smart Object ID"
              value={smartObjectId}
              onChange={(e) => setSmartObjectId(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={12}>
            <Button
              onClick={createHandler(() =>
                mudWeb3.getDeployableState(BigInt(smartObjectId))
              )}
              variant="contained"
              sx={{ mr: 1 }}
            >
              Deployable State
            </Button>
            <Button
              onClick={createHandler(() =>
                mudWeb3.wallet?.bringOnline(BigInt(smartObjectId))
              )}
              variant="contained"
              disabled={!mudWeb3.wallet}
              sx={{ mr: 1 }}
            >
              Online
            </Button>
            <Button
              onClick={createHandler(() =>
                mudWeb3.wallet?.bringOffline(BigInt(smartObjectId))
              )}
              variant="contained"
              disabled={!mudWeb3.wallet}
              sx={{ mr: 1 }}
            >
              Offline
            </Button>
            {!!error && (
              <Alert severity="error">
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
