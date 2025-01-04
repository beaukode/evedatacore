import React from "react";
import { Typography } from "@mui/material";
import z from "zod";
import Big from "big.js";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import AutoCompleteSolarSystem, {
  SolarSystemValue,
} from "@/components/AutoCompleteSolarSystem";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";

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

const SystemsDistance: React.FC = () => {
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
      const ly = meters.div(new Big(9.461e15));
      return ly.toNumber();
    }
  }, [ssIndex, system1, system2]);

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
      />
      <AutoCompleteSolarSystem
        label="System 2"
        value={system2}
        sx={{ my: 2 }}
        onChange={setSystem2}
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
