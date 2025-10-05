import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { AssemblyLink, SolarSystemLink } from "./common";

interface NewNetworkNodeLogProps {
  log: LogBookRecord;
}

const NewNetworkNodeLog: React.FC<NewNetworkNodeLogProps> = ({ log }) => {
  if (log.type !== "Notify:NewNetworkNode") {
    return null;
  }

  return (
    <div>
      &#x1F3D7;&#xFE0F; is building a{" "}
      <AssemblyLink
        id={log.assemblyId}
        type="starbase"
        name={log.assemblyName}
      />{" "}
      in <SolarSystemLink id={log.solarSystemId} name={log.solarSystemName} />
    </div>
  );
};

export default NewNetworkNodeLog;
