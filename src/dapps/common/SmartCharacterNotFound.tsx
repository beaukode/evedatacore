import React from "react";
import { Hex } from "viem";
import { Alert } from "@mui/material";

interface SmartCharacterNotFoundProps {
  address: Hex;
}

const SmartCharacterNotFound: React.FC<SmartCharacterNotFoundProps> = ({
  address,
}) => {
  return (
    <Alert severity="error">
      Your wallet account {address} is not linked to a smart character.
      <br />
      <br />
      Please check your account address matches your in-game address.
    </Alert>
  );
};

export default SmartCharacterNotFound;
