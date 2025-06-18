import React from "react";
import z from "zod";
import { Box, Button } from "@mui/material";
import {
  TextFieldElement,
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form-mui";
import { zodResolver } from "@hookform/resolvers/zod";
import AutoCompleteSolarSystem from "@/components/AutoCompleteSolarSystem";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";
import useQuerySearch from "@/tools/useQuerySearch";

const schema = z
  .object({
    system: z.coerce
      .number({ message: "Please select a system" })
      .int()
      .positive()
      .default(30012591),
    distance: z.coerce.number().int().positive().min(1).max(300).default(75),
  })
  .required();

type FormData = z.infer<typeof schema>;

function queryToForm(values: Record<keyof FormData, string>) {
  return {
    system: Number.parseInt(values.system),
    distance: Number.parseInt(values.distance),
  };
}

function formToQuery(values: FormData) {
  return {
    system: values.system.toString(),
    distance: values.distance.toString(),
  };
}

interface RoutePlannerFormProps {
  solarSystemsIndex: SolarSystemsIndex;
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
}

const NearbyForm: React.FC<RoutePlannerFormProps> = ({
  onSubmit,
  solarSystemsIndex,
  loading,
}) => {
  // Store the last query
  const [store, setStore] = useAppLocalStorage("v2_calculator_nearby", schema);

  // Get the query from the url
  const [search, setSearch, , handleChange] = useQuerySearch(
    formToQuery(store),
    { syncInitialState: true }
  );
  const [formDefaultValues] = React.useState(search);

  const { control, handleSubmit } = useForm<FormData>({
    mode: "onChange",
    defaultValues: queryToForm(formDefaultValues),
    resolver: zodResolver(schema),
  });

  const internalOnSubmit: SubmitHandler<FormData> = (data) => {
    setStore(data);
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(internalOnSubmit)}
      onChange={handleChange}
      noValidate
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box flexGrow={1}>
          <Controller
            name="system"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <AutoCompleteSolarSystem
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    setSearch(
                      "system",
                      (value ?? formDefaultValues.system).toString()
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
        </Box>
      </Box>
      <Box display="flex" alignItems="center" my={2}>
        <TextFieldElement
          control={control}
          type="number"
          label="Distance (Ly)"
          name="distance"
          fullWidth
          required
        />
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained" disabled={loading}>
          Search
        </Button>
      </Box>
    </form>
  );
};

export default NearbyForm;
