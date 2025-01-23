import React from "react";
import { Box, TextField, Button, Alert, List } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { parseAbiItem, toFunctionSelector } from "viem";
import { toJson } from "@/tools";
import BasicListItem from "@/components/ui/BasicListItem";

interface DecodeFunctionProps {
  signature: string;
  onDecode: (functionSignature: string) => void;
}

const DecodeFunction: React.FC<DecodeFunctionProps> = ({
  signature,
  onDecode,
}) => {
  const [functionSignature, setFunctionSignature] =
    React.useState<string>(signature);

  const handleDecodeClick = () => {
    onDecode(functionSignature);
  };

  const { abi, selector, decodeError } = React.useMemo(() => {
    try {
      let s = signature.trim();
      if (!s) return {};
      if (!s.startsWith("function")) {
        s = "function " + s;
      }
      const abi = parseAbiItem(s);
      const selector = toFunctionSelector(s);
      return { abi, selector };
    } catch (e) {
      if (e instanceof Error) {
        return { decodeError: e.message };
      } else {
        return { decodeError: "Error" };
      }
    }
  }, [signature]);

  return (
    <PaperLevel1 title="Decode function">
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Function signature"
          value={functionSignature}
          onChange={(e) => setFunctionSignature(e.target.value)}
          sx={{ mr: 2 }}
          fullWidth
        />
        <Button onClick={handleDecodeClick} variant="contained">
          Decode
        </Button>
      </Box>
      {selector && (
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <BasicListItem title="Selector">{selector}</BasicListItem>
        </List>
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
      {decodeError && <Alert severity="error">{decodeError}</Alert>}
    </PaperLevel1>
  );
};

export default DecodeFunction;
