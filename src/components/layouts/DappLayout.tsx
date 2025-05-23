import React from "react";
import { Helmet } from "react-helmet";
import DappHeader from "../layout/DappHeader";
import DappFooter from "../layout/DappFooter";
import { Alert, Box } from "@mui/material";
import { useSmartCharacter } from "@/contexts/AppContext";

interface DappLayoutProps {
  children: React.ReactNode;
  title: string;
  tabs?: Record<string, string>;
}

const DappLayout: React.FC<DappLayoutProps> = ({ children, title, tabs }) => {
  const smartCharacter = useSmartCharacter();
  const characterId = smartCharacter.isConnected
    ? smartCharacter.characterId
    : undefined;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <DappHeader title={title} tabs={tabs} />
      {!smartCharacter.isConnecting && (
        <Box
          sx={{
            mt: { xs: tabs ? 14 : 7, md: 7 },
            mb: 6,
            overflow: "hidden",
          }}
        >
          {characterId ? (
            children
          ) : (
            <Alert severity="error" sx={{ m: 2 }}>
              You need to be connected to a character to use this dapp.
            </Alert>
          )}
        </Box>
      )}
      <DappFooter />
    </>
  );
};

export default DappLayout;
