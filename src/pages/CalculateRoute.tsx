import React from "react";
import { Alert, Box, Grid2 as Grid, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { getFindPath } from "@/api/evedatacore-v2/generated/sdk.gen";
import RoutePlannerForm from "./Calculators/RoutePlannerForm";
import RoutePlannerRoute from "./Calculators/RoutePlannerRoute";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import useCharacter from "@/tools/useCharacter";

type SubmitHandler = React.ComponentProps<typeof RoutePlannerForm>["onSubmit"];
type RoutePlannerFormData = Parameters<SubmitHandler>[0];

const CalculateRoute: React.FC = () => {
  const [queryData, setQueryData] = React.useState<RoutePlannerFormData>();
  const solarSystemsIndex = useSolarSystemsIndex();
  const queryClient = useQueryClient();
  const character = useCharacter();

  const query = useQuery({
    queryKey: ["CalculateRoute", queryData],
    queryFn: async () => {
      if (!queryData) return;
      let characterId: string | undefined = undefined;
      if (
        (queryData.smartGates === "restricted" ||
          (queryData.smartGates !== "none" &&
            queryData.onlySmartGates !== "all")) &&
        character.character?.account
      ) {
        characterId = character.character.account;
      }
      return getFindPath({
        path: {
          from: queryData.system1,
          to: queryData.system2,
          distance: queryData.jumpDistance,
          optimize: queryData.optimize,
          character: characterId ?? "0x",
          useSmartGates: queryData.smartGates,
          restrictSmartGates: queryData.onlySmartGates,
        },
      }).then((r) => {
        if (r.error) {
          throw new Error(r.error.message);
        }
        return r.data.items;
      });
    },
    retry: false,
    enabled: !!queryData && !character.isLoading,
  });

  const destinationName = React.useMemo(() => {
    if (!queryData || !solarSystemsIndex) return "";
    return (
      solarSystemsIndex.getById(queryData.system2.toString())
        ?.solarSystemName ?? ""
    );
  }, [queryData, solarSystemsIndex]);

  const handleSubmit: SubmitHandler = React.useCallback(
    (data) => {
      queryClient.resetQueries({ queryKey: ["CalculateRoute"] });
      setQueryData(data);
    },
    [queryClient]
  );

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Route planner</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1
            title="Route planner"
            loading={!solarSystemsIndex}
            sx={{ mb: 0 }}
          >
            {solarSystemsIndex && (
              <RoutePlannerForm
                loading={query.isLoading}
                onSubmit={handleSubmit}
                solarSystemsIndex={solarSystemsIndex}
              />
            )}
          </PaperLevel1>
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="caption">
              Some data may be cached up to 15 minutes
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {!!queryData && (
            <PaperLevel1
              title={`Your trip to ${destinationName}`}
              loading={query.isLoading}
            >
              {query.isError && (
                <Alert severity="error">{query.error.message}</Alert>
              )}
              {query.isSuccess && query.data && (
                <Box>
                  <RoutePlannerRoute data={query.data} />
                </Box>
              )}
            </PaperLevel1>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalculateRoute;
