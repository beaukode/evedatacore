import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router";
import DappLayout from "@/components/layouts/DappLayout";
import Error404 from "@/pages/Error404";
import Index from "./corporations/Index";
import Directory from "./corporations/Directory";

const Corporations: React.FC = () => {
  return (
    <DappLayout
      title="Corporations"
      tabs={{
        "/dapps/corporations": "My corporation",
        "/dapps/corporations/directory": "Directory",
      }}
    >
      <Box sx={{ mt: 7, mb: 4 }}>
        <Routes>
          <Route path="" element={<Index />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Box>
    </DappLayout>
  );
};

export default Corporations;
