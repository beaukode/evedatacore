import React from "react";
import DappHeader from "../layout/DappHeader";
import DappFooter from "../layout/DappFooter";
import { Helmet } from "react-helmet";

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
      {children}
      <DappFooter />
    </>
  );
};

export default DappLayout;
