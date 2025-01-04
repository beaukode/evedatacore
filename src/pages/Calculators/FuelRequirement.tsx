import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import HelpIcon from "@mui/icons-material/Help";
import ShipIcon from "@mui/icons-material/Flight";
import { SelectElement, TextFieldElement } from "react-hook-form-mui";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { fuels, Ship, ShipType } from "@/constants";
import { isFuelType } from "@/tools/typeGuards";
import DialogShipSelect from "@/components/DialogShipSelect";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";

const keys = Object.keys(fuels);

const schema = z
  .object({
    mass: z.number().int().positive().default(28000000),
    distance: z.number().int().positive().default(100),
    fuelType: z
      .string()
      .refine((value) => keys.includes(value))
      .default("SOF-40"),
  })
  .required();

function formatNumber(value: string) {
  return new Intl.NumberFormat("en-GB", { useGrouping: true }).format(
    Number(value)
  );
}

function removeSpaces(value: string) {
  return value.replace(/\D/g, "");
}

function calculateFuelRequirement(
  mass: number,
  distance: number,
  efficiency: number
) {
  return (distance / (efficiency * 1e7)) * mass;
}

const FuelRequirement: React.FC = () => {
  const [store, setStore] = useAppLocalStorage(
    "v1_calculator_fuel_requirement",
    schema
  );
  const [openShipSelect, setOpenShipSelect] = React.useState(false);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      mass: store.mass.toString(),
      distance: store.distance.toString(),
      fuelType: store.fuelType,
    },
    resolver: zodResolver(schema),
  });

  const mass = watch("mass");
  const distance = watch("distance");
  const fuelType = watch("fuelType");

  const result = React.useMemo(() => {
    const fuel = isFuelType(fuelType) ? fuels[fuelType] : undefined;
    if (!fuel) return 0;

    return calculateFuelRequirement(
      Number(mass),
      Number(distance),
      fuel.efficiency
    );
  }, [mass, distance, fuelType]);

  const onShipSelect = (shipType?: ShipType, shipData?: Ship) => {
    if (shipType && shipData) {
      setValue("mass", shipData.mass.toString());
      setValue("fuelType", shipData.fuelType.toString());
    }
    setOpenShipSelect(false);
  };

  React.useEffect(() => {
    setStore({ mass: Number(mass), distance: Number(distance), fuelType });
  }, [mass, distance, fuelType, setStore]);

  return (
    <>
      <DialogShipSelect open={openShipSelect} onSelect={onShipSelect} />
      <form noValidate>
        <Box display="flex" alignItems="center" mb={2}>
          <TextFieldElement
            name="mass"
            label="Mass (kg)"
            control={control}
            transform={{
              input: formatNumber,
              output: (event) => removeSpaces(event.target.value),
            }}
            required
            fullWidth
          />
          <Tooltip title="Prefill from ship data" sx={{ m: 1 }}>
            <IconButton onClick={() => setOpenShipSelect(true)}>
              <ShipIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Right-click ship → Show Info" sx={{ m: 1 }}>
            <HelpIcon />
          </Tooltip>
        </Box>
        <SelectElement
          name="fuelType"
          label="Fuel type"
          control={control}
          options={Object.keys(fuels).map((key) => ({
            id: key,
            label: key,
          }))}
          required
          fullWidth
        />
        <Box display="flex" alignItems="center" my={2}>
          <TextFieldElement
            name="distance"
            label="Distance (ly)"
            control={control}
            required
            fullWidth
          />
        </Box>
      </form>
      <Typography variant="body1" component="p">
        You need : <strong>{result.toFixed(2)} units</strong> of fuel
      </Typography>
    </>
  );
};

export default FuelRequirement;
