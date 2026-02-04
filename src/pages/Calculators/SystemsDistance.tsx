import React from "react";
import { Typography } from "@mui/material";
import z from "zod";
import AutoCompleteSolarSystem from "@/components/AutoCompleteSolarSystem";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";
import { lyDistance } from "@/tools";

const storageSchema = z.object({
  system1: z.string().nullable().default(null),
  system2: z.string().nullable().default(null),
});

interface SystemsDistanceProps {
  solarSystemsIndex: SolarSystemsIndex;
}

const SystemsDistance: React.FC<SystemsDistanceProps> = ({
  solarSystemsIndex,
}) => {
  const [store, setStore] = useAppLocalStorage(
    "v2_calculator_systems_distance",
    storageSchema
  );

  const [system1, setSystem1] = React.useState<string | null>(store.system1);
  const [system2, setSystem2] = React.useState<string | null>(store.system2);

  const result = React.useMemo(() => {
    if (system1 && system2) {
      const s1 = solarSystemsIndex.getById(system1);
      const s2 = solarSystemsIndex.getById(system2);

      // TODO: Better error handling
      if (!s1 || !s2) return undefined;

      return lyDistance(s1.location, s2.location);
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
