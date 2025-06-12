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
    mass: z.number().int().positive().default(9750000),
    fuelLevel: z.number().int().positive().default(1750),
    fuelType: z
      .string()
      .refine((value) => keys.includes(value))
      .default("D1 Fuel"),
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

function calculateJumpDistance(mass: number, fuel: number, efficiency: number) {
  return (fuel / mass) * efficiency * 1e7;
}

const JumpDistance: React.FC = () => {
  const [store, setStore] = useAppLocalStorage(
    "v2_calculator_jump_distance",
    schema
  );
  const [openShipSelect, setOpenShipSelect] = React.useState(false);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      mass: store.mass.toString(),
      fuelLevel: store.fuelLevel.toString(),
      fuelType: store.fuelType,
    },
    resolver: zodResolver(schema),
  });

  const mass = watch("mass");
  const fuelLevel = watch("fuelLevel");
  const fuelType = watch("fuelType");

  const result = React.useMemo(() => {
    const fuel = isFuelType(fuelType) ? fuels[fuelType] : undefined;
    if (!fuel) return 0;

    return calculateJumpDistance(
      Number(mass),
      Number(fuelLevel),
      fuel.efficiency
    );
  }, [mass, fuelLevel, fuelType]);

  const onShipSelect = (shipType?: ShipType, shipData?: Ship) => {
    if (shipType && shipData) {
      setValue("mass", shipData.mass.toString());
      setValue("fuelLevel", shipData.fuel.toString());
      setValue("fuelType", shipData.fuelType.toString());
    }
    setOpenShipSelect(false);
  };

  React.useEffect(() => {
    setStore({ mass: Number(mass), fuelLevel: Number(fuelLevel), fuelType });
  }, [mass, fuelLevel, fuelType, setStore]);

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
            name="fuelLevel"
            label="Fuel level"
            control={control}
            required
            fullWidth
          />
          <Tooltip title="The number in the orange rectangle" sx={{ m: 1 }}>
            <HelpIcon />
          </Tooltip>
        </Box>
      </form>
      <Typography variant="body1" component="p">
        You can jump up to: <strong>{result.toFixed(2)} Ly</strong>
      </Typography>
    </>
  );
};

export default JumpDistance;
