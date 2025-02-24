import React from "react";
import { Helmet } from "react-helmet";
import DappHeader from "../layout/DappHeader";
import DappFooter from "../layout/DappFooter";
import { Box } from "@mui/material";

interface DappLayoutProps {
  children: React.ReactNode;
  title: string;
  tabs?: Record<string, string>;
}

const DappLayout: React.FC<DappLayoutProps> = ({ children, title, tabs }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <DappHeader title={title} tabs={tabs} />
      <Box sx={{ mt: { xs: 14, md: 7 }, mb: 6, overflow: "hidden" }}>
        {children}
      </Box>
      <DappFooter />
    </>
  );
};

export default DappLayout;
