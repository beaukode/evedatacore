import React from "react";
import { Route, Routes } from "react-router";
import Error404 from "@/pages/Error404";
import GateAccess from "./GateAccess";

const DApps: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<Error404 hideBackButton />} />
        <Route path="/gateaccess/*" element={<GateAccess />} />
        <Route path="*" element={<Error404 hideBackButton />} />
      </Routes>
    </>
  );
};

export default DApps;
