import React from "react";
import { Alert, Box, Grid2 as Grid } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { getFindNearIdDistance } from "@/api/evedatacore";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import useCharacter from "@/tools/useCharacter";
import NearbyForm from "./Calculators/NearbyForm";

type SubmitHandler = React.ComponentProps<typeof NearbyForm>["onSubmit"];
type NearbyFormData = Parameters<SubmitHandler>[0];

const CalculateNearby: React.FC = () => {
  const [queryData, setQueryData] = React.useState<NearbyFormData>();
  const solarSystemsIndex = useSolarSystemsIndex();
  const queryClient = useQueryClient();
  const character = useCharacter();

  const query = useQuery({
    queryKey: ["CalculateNearby", queryData],
    queryFn: async () => {
      if (!queryData) return;
      return getFindNearIdDistance({
        path: {
          id: queryData.system,
          distance: queryData.distance,
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

  const fromName = React.useMemo(() => {
    if (!queryData || !solarSystemsIndex) return "";
    return (
      solarSystemsIndex.getById(queryData.system.toString())?.solarSystemName ??
      ""
    );
  }, [queryData, solarSystemsIndex]);

  const handleSubmit: SubmitHandler = React.useCallback(
    (data) => {
      queryClient.resetQueries({ queryKey: ["CalculateNearby"] });
      setQueryData(data);
    },
    [queryClient]
  );

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Nearby systems</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1
            title="Find nearby systems"
            loading={!solarSystemsIndex}
            sx={{ mb: 0 }}
          >
            {solarSystemsIndex && (
              <NearbyForm
                loading={query.isLoading}
                onSubmit={handleSubmit}
                solarSystemsIndex={solarSystemsIndex}
              />
            )}
          </PaperLevel1>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {!!queryData && (
            <PaperLevel1
              title={`Nearby systems from ${fromName} (${queryData.distance} Ly)`}
              loading={query.isLoading}
            >
              {query.isError && (
                <Alert severity="error">{query.error.message}</Alert>
              )}
              {query.isSuccess && query.data && (
                <Box>{JSON.stringify(query.data)}</Box>
              )}
            </PaperLevel1>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalculateNearby;
