import React from "react";
import { LogBookRecord } from "@/api/evedatacore-v2";
import { CharacterLink, SolarSystemLink, TribeLink } from "./common";
import { tsToDateTime } from "@/tools";

interface KillLogProps {
  log: LogBookRecord;
}

const KillLog: React.FC<KillLogProps> = ({ log }) => {
  if (log.type !== "Notify:Kill") {
    return null;
  }

  const killerLink = (
    <CharacterLink
      account={log.killer.account}
      name={log.killer.characterName}
    />
  );
  const killerTribeLink = (
    <TribeLink
      id={log.killer.tribeId}
      name={log.killer.tribeName}
      ticker={log.killer.tribeTicker}
    />
  );
  const victimLink = (
    <CharacterLink
      account={log.victim.account}
      name={log.victim.characterName}
    />
  );
  const victimTribeLink = (
    <TribeLink
      id={log.victim.tribeId}
      name={log.victim.tribeName}
      ticker={log.victim.tribeTicker}
    />
  );

  const solarSystemLink = (
    <SolarSystemLink id={log.solarSystemId} name={log.solarSystemName} />
  );

  const killedAt = tsToDateTime(log.killedAt);

  return (
    <div>
      &#x1F631; {killerLink} ({killerTribeLink}) killed {victimLink} (
      {victimTribeLink}) in {solarSystemLink} at {killedAt}
    </div>
  );
};

export default KillLog;
