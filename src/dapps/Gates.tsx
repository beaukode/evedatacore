import React from "react";
import { Route, Routes } from "react-router";
import DappLayout from "@/components/layouts/DappLayout";
import Error404 from "@/pages/Error404";
import Index from "./gates/Index";
import Administrator from "./gates/Administrator";

const Gates: React.FC = () => {
  return (
    <DappLayout title="Gate Access">
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="/:id" element={<Administrator />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </DappLayout>
  );
};

export default Gates;
