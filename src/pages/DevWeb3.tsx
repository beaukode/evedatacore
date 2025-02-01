import React from "react";
import z from "zod";
import { Box } from "@mui/material";

import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import DecodeFunction from "./Dev/DecodeFunction";
import { Helmet } from "react-helmet";

const schema = z
  .object({
    functionSignature: z
      .string()
      .default("myFunction(uint256, string, address)"),
  })
  .required();

const DevWeb3: React.FC = () => {
  const [store, setStore] = useAppLocalStorage("v1_dev_web3", schema);

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Web3</title>
      </Helmet>
      <DecodeFunction
        signature={store.functionSignature}
        onDecode={(s) => setStore({ functionSignature: s })}
      />
    </Box>
  );
};

export default DevWeb3;
