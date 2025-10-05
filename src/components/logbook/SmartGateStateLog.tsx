import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { AssemblyLink, SolarSystemLink } from "./common";

interface SmartGateStateLogProps {
  log: LogBookRecord;
}

const SmartGateStateLog: React.FC<SmartGateStateLogProps> = ({ log }) => {
  if (log.type !== "Notify:SmartGateState") {
    return null;
  }

  const assemblyLink = (
    <AssemblyLink id={log.assemblyId} type="gate" name={log.assemblyName} />
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
  if (log.state === 4) {
    return (
      <div>
        &#x1F525; the {assemblyLink} in {solarSystemLink} was destroyed.
      </div>
    );
  }
  return null;
};

export default SmartGateStateLog;
