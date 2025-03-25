import React from "react";
import z from "zod";
import { Alert, Box, Button } from "@mui/material";
import {
  TextFieldElement,
  SubmitHandler,
  useForm,
  Controller,
  SelectElement,
} from "react-hook-form-mui";
import { zodResolver } from "@hookform/resolvers/zod";
import AutoCompleteSolarSystem from "@/components/AutoCompleteSolarSystem";
import HintIcon from "@/components/ui/Hint";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";
import useQuerySearch from "@/tools/useQuerySearch";
import useCharacter from "@/tools/useCharacter";

const schema = z
  .object({
    system1: z.coerce
      .number({ message: "Please select a system" })
      .int()
      .positive()
      .default(30001573),
    system2: z.coerce
      .number({ message: "Please select a system" })
      .int()
      .positive()
      .default(30013956),
    jumpDistance: z.coerce
      .number()
      .int()
      .positive()
      .min(1)
      .max(500)
      .default(120),
    optimize: z.enum(["fuel", "distance", "hops"]).default("fuel"),
    smartGates: z
      .enum(["none", "unrestricted", "restricted"])
      .default("unrestricted"),
  })
  .required();

type FormData = z.infer<typeof schema>;

function queryToForm(values: Record<keyof FormData, string>) {
  return {
    system1: Number.parseInt(values.system1),
    system2: Number.parseInt(values.system2),
    jumpDistance: Number.parseInt(values.jumpDistance),
    optimize: ["fuel", "distance", "hops"].includes(values.optimize)
      ? (values.optimize as "fuel" | "distance" | "hops")
      : "fuel",
    smartGates: ["none", "unrestricted", "restricted"].includes(
      values.smartGates
    )
      ? (values.smartGates as "none" | "unrestricted" | "restricted")
      : "unrestricted",
  };
}

function formToQuery(values: FormData) {
  return {
    system1: values.system1.toString(),
    system2: values.system2.toString(),
    jumpDistance: values.jumpDistance.toString(),
    optimize: values.optimize.toString(),
    smartGates: values.smartGates.toString(),
  };
}

interface RoutePlannerFormProps {
  solarSystemsIndex: SolarSystemsIndex;
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
}

const RoutePlannerForm: React.FC<RoutePlannerFormProps> = ({
  onSubmit,
  solarSystemsIndex,
  loading,
}) => {
  // Store the last query
  const [store, setStore] = useAppLocalStorage(
    "v2_calculator_route_planner",
    schema
  );

  // Get the query from the url
  const [search, setSearch, , handleChange] = useQuerySearch(
    formToQuery(store),
    { syncInitialState: true }
  );
  const [formDefaultValues] = React.useState(search);

  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    mode: "onChange",
    defaultValues: queryToForm(formDefaultValues),
    resolver: zodResolver(schema),
  });
  const smartGates = watch("smartGates");

  const internalOnSubmit: SubmitHandler<FormData> = (data) => {
    setStore(data);
    onSubmit(data);
  };

  const handleReset = () => {
    reset(queryToForm(formDefaultValues));
    for (const key in formDefaultValues) {
      setSearch(
        key as keyof typeof formDefaultValues,
        formDefaultValues[key as keyof typeof formDefaultValues]
      );
    }
  };

  const character = useCharacter();

  return (
    <form
      onSubmit={handleSubmit(internalOnSubmit)}
      onChange={handleChange}
      noValidate
    >
      <Controller
        name="system1"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <AutoCompleteSolarSystem
              {...field}
              onChange={(value) => {
                field.onChange(value);
                setSearch(
                  "system1",
                  (value ?? formDefaultValues.system1).toString()
                );
              }}
              error={fieldState.error?.message}
              label="From system"
              sx={{ mb: 2 }}
              solarSystemsIndex={solarSystemsIndex}
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
              onChange={(value) => {
                field.onChange(value);
                setSearch(
                  "system2",
                  (value ?? formDefaultValues.system2).toString()
                );
              }}
              error={fieldState.error?.message}
              solarSystemsIndex={solarSystemsIndex}
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
        onChange={(value) => {
          setSearch("optimize", value);
        }}
        sx={{ my: 2 }}
        options={[
          { id: "fuel", label: "Fuel (Prefer gates)" },
          { id: "distance", label: "Distance (Prefer jumps)" },
          { id: "hops", label: "Hops (Minimise clicks)" },
        ]}
        required
        fullWidth
      />
      <SelectElement
        name="smartGates"
        label="Smart gates"
        control={control}
        onChange={(value) => {
          setSearch("smartGates", value);
        }}
        sx={{ my: 2 }}
        options={[
          { id: "none", label: "None" },
          { id: "unrestricted", label: "Unrestricted" },
          { id: "restricted", label: "Unrestricted + Restricted you can use" },
        ]}
        required
        fullWidth
      />
      {smartGates === "restricted" && (
        <>
          {!character.isLoading && !character.character && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Unable to retrieve your character ID. Please check that your
              wallet is connected to the correct address.
              <br />
              The route will be calculated using unrestricted smart gates.
            </Alert>
          )}
          {character.character && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Your character ID will be sent to the server to check which smart
              gates you can use.
            </Alert>
          )}
        </>
      )}
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
        <Button type="submit" variant="contained" disabled={loading}>
          Calculate Route
        </Button>
      </Box>
    </form>
  );
};

export default RoutePlannerForm;
