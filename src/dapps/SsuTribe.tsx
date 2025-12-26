import React from "react";
import { Route, Routes } from "react-router";
import DappLayout from "@/components/layouts/DappLayout";
import Error404 from "@/pages/Error404";
import Index from "./ssu-tribe/Index";
import Main from "./ssu-tribe/Main";

const SsuTribe: React.FC = () => {
  return (
    <DappLayout title="Tribe Smart Storage">
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="/:id/*" element={<Main />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </DappLayout>
  );
};

export default SsuTribe;
