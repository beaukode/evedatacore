import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { TribeLink } from "./common";

interface TribeJoinLogProps {
  log: LogBookRecord;
}

const TribeJoinLog: React.FC<TribeJoinLogProps> = ({ log }) => {
  if (log.type !== "Notify:TribeJoin") {
    return null;
  }

  return (
    <div>
      &#x1FAE1; joined{" "}
      <TribeLink
        id={log.tribeId}
        name={log.tribeName}
        ticker={log.tribeTicker}
      />
      .
    </div>
  );
};

export default TribeJoinLog;
