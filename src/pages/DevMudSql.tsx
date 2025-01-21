import React from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import z from "zod";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";

const schema = z
  .object({
    sql: z
      .string()
      .default('SELECT "namespaceId", "owner" FROM world__NamespaceOwner'),
  })
  .required();

const DevMudSql: React.FC = () => {
  const [store, setStore] = useAppLocalStorage("v1_dev", schema);

  const [sql, setSql] = React.useState<string>(store.sql);
  const [result, setResult] = React.useState<Record<string, string>[]>();
  const [error, setError] = React.useState<string>();

  const mudSql = useMudSql();

  const handleExecuteClick = () => {
    setStore({ sql });
    setError(undefined);
    setResult(undefined);
    mudSql
      .selectRaw(sql)
      .then((result) => {
        setResult(result);
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <PaperLevel1 title="Raw MUD SQL Query">
        <TextField
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          minRows={5}
          maxRows={10}
          variant="outlined"
          slotProps={{ input: { style: { fontFamily: "monospace" } } }}
          multiline
          fullWidth
        />
        <Box display="flex" justifyContent="right" my={2}>
          <Button onClick={handleExecuteClick} variant="contained">
            Execute
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}

        {result && (
          <>
            <Typography variant="caption">{result?.length} records</Typography>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default DevMudSql;
