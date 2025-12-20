import React from "react";
import { Route, Routes } from "react-router";
import Error404 from "@/pages/Error404";
import Gates from "./Gates";
import Ssu from "./Ssu";

const DApps: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<Error404 hideBackButton />} />
        <Route path="/gates/*" element={<Gates />} />
        <Route path="/ssu/*" element={<Ssu />} />
        <Route path="*" element={<Error404 hideBackButton />} />
      </Routes>
    </>
  );
};

export default DApps;
