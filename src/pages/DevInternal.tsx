import React from "react";
import { Alert, Box, Button } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useMudWeb3 } from "@/contexts/AppContext";
import { toJson } from "@/tools";

const DevInternal: React.FC = () => {
  const [result, setResult] = React.useState<unknown>();
  const [error, setError] = React.useState<unknown>();

  const mudWeb3 = useMudWeb3();

  const handleDeployableStateClick = () => {
    setError(undefined);
    setResult(undefined);
    mudWeb3
      .getDeployableState(
        14734588351472462921708363627364304419413383262236155234797503516055800569n // Smart assembly ID
      )
      .then(setResult)
      .catch(setError);
  };

  const handleErc721balanceOfClick = () => {
    setError(undefined);
    setResult(undefined);
    mudWeb3
      .erc721balanceOf(
        "0xe562B6DD1d3725CB4f0C77512dA990965886688f",
        "0x6De6B0F597A065B56022C6E579068aD8A7583867"
      )
      .then(setResult)
      .catch(setError);
  };

  const handleErc721transfertToClick = () => {
    setError(undefined);
    setResult(undefined);
    mudWeb3.wallet
      ?.erc721transferFrom(
        "0xD3A030509548652922bcd736f359Ab8a052F6980",
        "0xaeba6aa155974b5807CBf77c430A74073d69ED1b",
        "0xF7730eB77b66F21FEa19D49Ee6A4718FF9c0393E",
        11861973571520147656545735842437132677489931026054966953186802655176544322796n
      )
      .then(setResult)
      .catch(setError);
  };

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <PaperLevel1 title="Web3">
        <Button onClick={handleDeployableStateClick} variant="contained">
          Deployable State
        </Button>
        <Button onClick={handleErc721balanceOfClick} variant="contained">
          ERC 721: Balance Of
        </Button>
        <Button
          onClick={handleErc721transfertToClick}
          variant="contained"
          disabled={!mudWeb3.wallet}
        >
          ERC 721: Transfert To
        </Button>
        {!!error && (
          <Alert severity="error">
            <pre>{toJson(error)}</pre>
          </Alert>
        )}
        {!!result && <pre>{toJson(result)}</pre>}
      </PaperLevel1>
    </Box>
  );
};

export default DevInternal;
