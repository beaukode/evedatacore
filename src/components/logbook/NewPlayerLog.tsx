import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";

interface NewPlayerLogProps {
  log: LogBookRecord;
}

const NewPlayerLog: React.FC<NewPlayerLogProps> = ({ log }) => {
  if (log.type !== "Notify:NewPlayer") {
    return null;
  }

  return <div>&#x1F44B; joined the frontier.</div>;
};

export default NewPlayerLog;
