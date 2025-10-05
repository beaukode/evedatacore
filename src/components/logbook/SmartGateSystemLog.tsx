import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { AssemblyLink, SolarSystemLink, SystemLink } from "./common";

interface SmartGateSystemLogProps {
  log: LogBookRecord;
}

const SmartGateSystemLog: React.FC<SmartGateSystemLogProps> = ({ log }) => {
  if (log.type !== "Notify:SmartGateSystem") {
    return null;
  }

  const assemblyLink = (
    <AssemblyLink id={log.assemblyId} type="gate" name={log.assemblyName} />
  );

  const solarSystemLink = (
    <SolarSystemLink id={log.solarSystemId} name={log.solarSystemName} />
  );

  if (log.system) {
    const systemLink = (
      <SystemLink
        id={log.system.systemId}
        name={log.system.systemName}
        namespace={log.system.systemNamespace}
      />
    );

    return (
      <div>
        &#x1F6A6; has enforced access restrictions of {assemblyLink} in{" "}
        {solarSystemLink} using {systemLink}.
      </div>
    );
  } else {
    return (
      <div>
        &#x1F7E2; has removed access restrictions of {assemblyLink} in{" "}
        {solarSystemLink}.
      </div>
    );
  }
};

export default SmartGateSystemLog;
