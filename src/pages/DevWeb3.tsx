import React from "react";
import { Alert, Box, Button } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useMudWeb3 } from "@/contexts/AppContext";

const DevWeb3: React.FC = () => {
  const [result, setResult] = React.useState<unknown>();
  const [error, setError] = React.useState<unknown>();

  const mudWeb3 = useMudWeb3();

  const handleWeb3Click = () => {
    setError(undefined);
    setResult(undefined);
    mudWeb3
      .getDeployableState(
        14734588351472462921708363627364304419413383262236155234797503516055800569n // Smart assembly ID
      )
      .then(setResult)
      .catch(setError);
  };

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <PaperLevel1 title="Web3">
        <Button onClick={handleWeb3Click} variant="contained">
          Test
        </Button>
        {!!error && (
          <Alert severity="error">
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Alert>
        )}
        {!!result && (
          <pre>
            {JSON.stringify(
              result,
              (_, value) =>
                typeof value === "bigint" ? value.toString() : value,
              2
            )}
          </pre>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default DevWeb3;
