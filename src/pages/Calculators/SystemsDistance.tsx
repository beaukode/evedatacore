import React from "react";
import { Typography } from "@mui/material";
import z from "zod";
import Big from "big.js";
import AutoCompleteSolarSystem, {
  SolarSystemValue,
} from "@/components/AutoCompleteSolarSystem";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";

const storageSchema = z.object({
  system1: z
    .object({
      label: z.string(),
      id: z.number(),
    })
    .nullable()
    .default(null),
  system2: z
    .object({
      label: z.string(),
      id: z.number(),
    })
    .nullable()
    .default(null),
});

interface SystemsDistanceProps {
  solarSystemsIndex: SolarSystemsIndex;
}

const SystemsDistance: React.FC<SystemsDistanceProps> = ({
  solarSystemsIndex,
}) => {
  const [store, setStore] = useAppLocalStorage(
    "v1_calculator_systems_distance",
    storageSchema
  );

  const [system1, setSystem1] = React.useState<SolarSystemValue | null>(
    store.system1
  );
  const [system2, setSystem2] = React.useState<SolarSystemValue | null>(
    store.system2
  );

  const result = React.useMemo(() => {
    if (system1?.id && system2?.id) {
      const s1 = solarSystemsIndex.getById(system1.id.toString());
      const s2 = solarSystemsIndex.getById(system2.id.toString());

      // TODO: Better error handling
      if (!s1 || !s2) return undefined;

      const s1x = new Big(s1.location.x);
      const s1y = new Big(s1.location.y);
      const s1z = new Big(s1.location.z);
      const s2x = new Big(s2.location.x);
      const s2y = new Big(s2.location.y);
      const s2z = new Big(s2.location.z);
      const meters = s1x
        .minus(s2x)
        .pow(2)
        .plus(s1y.minus(s2y).pow(2))
        .plus(s1z.minus(s2z).pow(2))
        .sqrt();
      const ly = meters.div(new Big(9.46073047258e15));
      return ly.toNumber();
    }
  }, [solarSystemsIndex, system1, system2]);

  React.useEffect(() => {
    setStore({ system1, system2 });
  }, [system1, system2, setStore]);

  return (
    <>
      <AutoCompleteSolarSystem
        label="System 1"
        value={system1}
        sx={{ mb: 2 }}
        onChange={setSystem1}
        solarSystemsIndex={solarSystemsIndex}
      />
      <AutoCompleteSolarSystem
        label="System 2"
        value={system2}
        sx={{ my: 2 }}
        onChange={setSystem2}
        solarSystemsIndex={solarSystemsIndex}
      />
      {result === undefined ? (
        <Typography variant="body1" component="p" my={2}>
          Please select two star systems
        </Typography>
      ) : (
        <Typography variant="body1" component="p">
          These star systems are <strong>{result.toFixed(2)} Ly</strong> away
        </Typography>
      )}
    </>
  );
};

export default SystemsDistance;
