import React from "react";
import { Typography } from "@mui/material";
import Big from "big.js";

import { useSolarSystemsIndex } from "@/contexts/AppContext";
import AutoCompleteSolarSystem, {
  SolarSystemValue,
} from "@/components/AutoCompleteSolarSystem";

const SystemsDistance: React.FC = () => {
  const [system1, setSystem1] = React.useState<SolarSystemValue | null>(null);
  const [system2, setSystem2] = React.useState<SolarSystemValue | null>(null);

  const ssIndex = useSolarSystemsIndex();

  const result = React.useMemo(() => {
    if (system1?.id && system2?.id) {
      const s1 = ssIndex.getById(system1.id.toString());
      const s2 = ssIndex.getById(system2.id.toString());

      // TODO: Better error handling
      if (!s1 || !s2) return undefined;

      const s1x = new Big(s1.location?.x || 0);
      const s1y = new Big(s1.location?.y || 0);
      const s1z = new Big(s1.location?.z || 0);
      const s2x = new Big(s2.location?.x || 0);
      const s2y = new Big(s2.location?.y || 0);
      const s2z = new Big(s2.location?.z || 0);
      const meters = s1x
        .minus(s2x)
        .pow(2)
        .plus(s1y.minus(s2y).pow(2))
        .plus(s1z.minus(s2z).pow(2))
        .sqrt();
      console.log("meters", meters.toFixed(2));
      const ly = meters.div(new Big(9.461e15));
      return ly.toNumber();
    }
  }, [ssIndex, system1, system2]);

  return (
    <>
      <AutoCompleteSolarSystem
        label="System 1"
        value={system1}
        onChange={setSystem1}
      />
      <AutoCompleteSolarSystem
        label="System 2"
        value={system2}
        onChange={setSystem2}
      />
      {result === undefined ? (
        <Typography variant="body1" component="p" my={2}>
          Please select two star systems
        </Typography>
      ) : (
        <Typography variant="body1" component="p" my={2}>
          These star systems are <strong>{result.toFixed(2)} Ly</strong> away
        </Typography>
      )}
    </>
  );
};

export default SystemsDistance;
