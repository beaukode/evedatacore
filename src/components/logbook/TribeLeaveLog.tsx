import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { TribeLink } from "./common";

interface TribeLeaveLogProps {
  log: LogBookRecord;
}

const TribeLeaveLog: React.FC<TribeLeaveLogProps> = ({ log }) => {
  if (log.type !== "Notify:TribeLeave") {
    return null;
  }

  return (
    <div>
      &#x1F3C3; left{" "}
      <TribeLink
        id={log.tribeId}
        name={log.tribeName}
        ticker={log.tribeTicker}
      />.
    </div>
  );
};

export default TribeLeaveLog;
