import React from "react";
import { Box } from "@mui/material";
import { Assembly } from "@/api/evedatacore-v2";
import Configure from "./Configure";
import Setup from "./Setup";
import { isDappUrlSet } from "../lib/utils";

interface OwnerProps {
  ssu: Assembly;
}

const Owner: React.FC<OwnerProps> = ({ ssu }) => {
  return (
    <Box p={2}>
      {isDappUrlSet(ssu) ? <Configure ssu={ssu} /> : <Setup ssu={ssu} />}
    </Box>
  );
};

export default Owner;
