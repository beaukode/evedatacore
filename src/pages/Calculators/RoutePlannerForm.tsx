import React from "react";
import z from "zod";
import { Box, Button } from "@mui/material";
import {
  TextFieldElement,
  SubmitHandler,
  useForm,
  Controller,
  SelectElement,
  CheckboxElement,
} from "react-hook-form-mui";
import { zodResolver } from "@hookform/resolvers/zod";
import AutoCompleteSolarSystem from "@/components/AutoCompleteSolarSystem";
import HintIcon from "@/components/ui/Hint";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";

const schema = z
  .object({
    system1: z
      .object(
        {
          label: z.string(),
          id: z.number(),
        },
        { message: "Please select a system" }
      )
      .default({
        label: "E.G1G.6GD",
        id: 30017903,
      }),
    system2: z
      .object(
        {
          label: z.string(),
          id: z.number(),
        },
        { message: "Please select a system" }
      )
      .default({
        label: "Nod",
        id: 30008580,
      }),
    jumpDistance: z.number().int().positive().min(1).max(500).default(120),
    optimize: z.enum(["fuel", "distance", "hops"]).default("fuel"),
    useSmartGates: z.boolean().default(true),
  })
  .required();

type FormData = z.infer<typeof schema>;

interface RoutePlannerFormProps {
  onSubmit: SubmitHandler<FormData>;
}

const RoutePlannerForm: React.FC<RoutePlannerFormProps> = ({ onSubmit }) => {
  const [store, setStore] = useAppLocalStorage(
    "v1_calculator_route_planner",
    schema
  );

  const { control, handleSubmit, reset } = useForm<FormData>({
    mode: "onChange",
    defaultValues: store,
    resolver: zodResolver(schema),
  });

  const internalOnSubmit: SubmitHandler<FormData> = (data) => {
    setStore(data);
    onSubmit(data);
  };

  const handleReset = () => {
    reset(schema.parse({}));
  };

  return (
    <form onSubmit={handleSubmit(internalOnSubmit)} noValidate>
      <Controller
        name="system1"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <AutoCompleteSolarSystem
              {...field}
              error={fieldState.error?.message}
              label="From system"
              sx={{ mb: 2 }}
              fullWidth
            />
          );
        }}
      />
      <Controller
        name="system2"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <AutoCompleteSolarSystem
              {...field}
              error={fieldState.error?.message}
              label="To system"
              sx={{ my: 2 }}
              fullWidth
            />
          );
        }}
      />
      <Box display="flex" alignItems="center" my={2}>
        <TextFieldElement
          control={control}
          type="number"
          label="Jump Distance (Ly)"
          name="jumpDistance"
          fullWidth
          required
        />
        <HintIcon sx={{ ml: 2 }}>
          Use the <strong>Ship jump distance</strong> calculator in the Various
          tab to calculate your ship max distance
        </HintIcon>
      </Box>
      <SelectElement
        name="optimize"
        label="Optimize for"
        control={control}
        sx={{ my: 2 }}
        options={[
          { id: "fuel", label: "Fuel (Prefer gates)" },
          { id: "distance", label: "Distance (Prefer jumps)" },
          { id: "hops", label: "Hops (Minimise clicks)" },
        ]}
        required
        fullWidth
      />
      <CheckboxElement
        name="useSmartGates"
        label="Use smart gates"
        control={control}
        labelProps={{
          labelPlacement: "end",
        }}
      />
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="reset"
          variant="outlined"
          color="warning"
          onClick={handleReset}
          sx={{ mr: 2 }}
        >
          Reset
        </Button>
        <Button type="submit" variant="contained">
          Calculate Route
        </Button>
      </Box>
    </form>
  );
};

export default RoutePlannerForm;
