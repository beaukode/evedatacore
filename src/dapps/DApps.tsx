import React from "react";
import { Route, Routes } from "react-router";
import Error404 from "@/pages/Error404";
import Corporations from "./Corporations";

const DApps: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<Error404 hideBackButton />} />
        <Route path="/corporations" element={<Corporations />} />
        <Route path="*" element={<Error404 hideBackButton />} />
      </Routes>
    </>
  );
};

export default DApps;
