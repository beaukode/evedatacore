import React from "react";
import { Box, LinearProgress } from "@mui/material";
import { useSmartCharacter } from "@/contexts/AppContext";
import Connect from "../../common/Connect";
import SmartCharacterNotFound from "../../common/SmartCharacterNotFound";
import CorporationDetails from "../components/CorporationDetails";

const Index: React.FC = () => {
  const smartCharacter = useSmartCharacter();

  if (smartCharacter.isConnecting) {
    return <LinearProgress />;
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 800,
          margin: "auto",
          px: 2,
          alignSelf: "center",
          justifySelf: "center",
        }}
      >
        {!smartCharacter.isConnected && <Connect />}
        {smartCharacter.isConnected && (
          <>
            {!smartCharacter.isFound && (
              <SmartCharacterNotFound address={smartCharacter.address} />
            )}
            {smartCharacter.isFound && (
              <CorporationDetails
                characterId={smartCharacter.characterId}
                corporationId={smartCharacter.corporationId}
              />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Index;
