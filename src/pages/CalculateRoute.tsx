import React from "react";
import { Alert, Box, Grid2 as Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ExternalLink from "@/components/ui/ExternalLink";
import { getCalcPathFromTo } from "@/api/evedatacore";
import RoutePlannerForm from "./Calculators/RoutePlannerForm";
import RoutePlannerRoute from "./Calculators/RoutePlannerRoute";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import useCharacter from "@/tools/useCharacter";

type SubmitHandler = React.ComponentProps<typeof RoutePlannerForm>["onSubmit"];
type RoutePlannerFormData = Parameters<SubmitHandler>[0];

const CalculateRoute: React.FC = () => {
  const [queryData, setQueryData] = React.useState<RoutePlannerFormData>();
  const solarSystemsIndex = useSolarSystemsIndex();

  const character = useCharacter();

  const query = useQuery({
    queryKey: ["CalculateRoute", queryData],
    queryFn: async () => {
      if (!queryData) return;
      let useSmartGates = "";
      if (queryData.smartGates === "unrestricted") {
        useSmartGates = "0";
      } else if (queryData.smartGates === "restricted") {
        if (character.character) {
          useSmartGates = character.character.id.toString();
        } else {
          useSmartGates = "0"; // Wallet is not connected, fallback to unrestricted smart gates
        }
      }
      return getCalcPathFromTo({
        path: {
          from: queryData.system1,
          to: queryData.system2,
        },
        query: {
          jumpDistance: queryData.jumpDistance,
          optimize: queryData.optimize,
          useSmartGates,
        },
      }).then((r) => {
        if (r.error) {
          throw new Error(r.error.message);
        }
        return r.data.path;
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

  const handleSubmit: SubmitHandler = React.useCallback((data) => {
    setQueryData(data);
  }, []);

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Route planner</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1 title="Route planner" loading={!solarSystemsIndex}>
            {solarSystemsIndex && (
              <RoutePlannerForm
                onSubmit={handleSubmit}
                solarSystemsIndex={solarSystemsIndex}
              />
            )}
          </PaperLevel1>
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
      <Alert severity="info">
        This calculator is based on the work of Shish, from his website{" "}
        <ExternalLink
          title="EVE Frontier Toolbox"
          href="https://eftb.shish.io/"
        />{" "}
        and its source code
        <br />
        <br />
        If you enjoy this calculator, please consider supporting him by buying a
        coffee at{" "}
        <ExternalLink title="Buy a coffee" href="https://ko-fi.com/shish2k" />
      </Alert>
    </Box>
  );
};

export default CalculateRoute;
