import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { AssemblyLink, SolarSystemLink } from "./common";

interface AssemblyDestroyedLogProps {
  log: LogBookRecord;
}

const AssemblyDestroyedLog: React.FC<AssemblyDestroyedLogProps> = ({ log }) => {
  if (log.type !== "Notify:AssemblyDestroyed") {
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

  return (
    <div>
      &#x1F4A5; {assemblyLink} was destroyed in {solarSystemLink}.
    </div>
  );
};

export default AssemblyDestroyedLog;
