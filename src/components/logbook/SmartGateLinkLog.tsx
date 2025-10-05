import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { AssemblyLink, SolarSystemLink } from "./common";

interface SmartGateLinkLogProps {
  log: LogBookRecord;
}

const SmartGateLinkLog: React.FC<SmartGateLinkLogProps> = ({ log }) => {
  if (log.type !== "Notify:SmartGateLink") {
    return null;
  }

  const assemblyLink = (
    <AssemblyLink
      id={log.assemblyId}
      type="gate"
      name={log.assemblyName}
    />
  );
  const solarSystemLink = (
    <SolarSystemLink id={log.solarSystemId} name={log.solarSystemName} />
  );

  if (log.linkedGate && log.linkedGateSolarSystem) {
    const linkedAssemblyLink = (
      <AssemblyLink
        id={log.linkedGate.assemblyId}
        type="gate"
        name={log.linkedGate.assemblyName}
      />
    );
    const linkedSolarSystemLink = (
      <SolarSystemLink
        id={log.linkedGateSolarSystem.solarSystemId}
        name={log.linkedGateSolarSystem.solarSystemName}
      />
    );
    return (
      <div>
        &#x1F517; has linked {assemblyLink} in {solarSystemLink} to{" "}
        {linkedAssemblyLink} in {linkedSolarSystemLink}
      </div>
    );
  } else {
    return <div>&#x2702;&#xFE0F; has unlinked {assemblyLink}.</div>;
  }
};

export default SmartGateLinkLog;
