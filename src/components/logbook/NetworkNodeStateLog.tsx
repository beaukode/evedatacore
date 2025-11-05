import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { AssemblyLink, SolarSystemLink } from "./common";

interface NetworkNodeStateLogProps {
  log: LogBookRecord;
}

const NetworkNodeStateLog: React.FC<NetworkNodeStateLogProps> = ({ log }) => {
  if (log.type !== "Notify:NetworkNodeState") {
    return null;
  }

  const assemblyLink = (
    <AssemblyLink
      id={log.assemblyId}
      type={log.assemblyTypeId}
      name={log.assemblyName}
    />
  );

  const solarSystemLink = (
    <SolarSystemLink id={log.solarSystemId} name={log.solarSystemName} />
  );

  if (log.state === 1) {
    return (
      <div>
        &#x1F4E6; has disassembled the {assemblyLink} in {solarSystemLink}.
      </div>
    );
  }
  if (log.state === 2) {
    return (
      <div>
        &#x1FAAB; the {assemblyLink} in {solarSystemLink} is now OFFLINE.
      </div>
    );
  }
  if (log.state === 3) {
    return (
      <div>
        &#x1F50B; the {assemblyLink} in {solarSystemLink} is now ONLINE.
      </div>
    );
  }
  return null;
};

export default NetworkNodeStateLog;
