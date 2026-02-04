import React from "react";
import {
  Alert,
  Box,
  Grid2 as Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { getFindNearIdDistance } from "@/api/evedatacore-v2";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import NearbyForm from "./Calculators/NearbyForm";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";

type SubmitHandler = React.ComponentProps<typeof NearbyForm>["onSubmit"];
type NearbyFormData = Parameters<SubmitHandler>[0];

const CalculateNearby: React.FC = () => {
  const [copyError, setCopyError] = React.useState(false);
  const [queryData, setQueryData] = React.useState<NearbyFormData>();
  const solarSystemsIndex = useSolarSystemsIndex();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["CalculateNearby", queryData],
    queryFn: async () => {
      if (!queryData) return;
      return getFindNearIdDistance({
        path: {
          id: Number.parseInt(queryData.system),
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
    enabled: !!queryData,
  });

  const fromName = React.useMemo(() => {
    if (!queryData || !solarSystemsIndex) return "";
    return (
      solarSystemsIndex.getById(queryData.system)?.name ??
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

  const copyResults = React.useCallback(() => {
    setCopyError(false);
    if (!solarSystemsIndex || !query.data || query.data.length < 1) {
      return;
    }
    let content = `From ${fromName} up to ${queryData?.distance} Ly\n`;
    content += query.data
      ?.map(
        (item) =>
          `<a href="showinfo:5//${item.solarSystemId}">${solarSystemsIndex.getById(item.solarSystemId)?.name}</a> ${item.distance}Ly`
      )
      .join("\n");
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopyError(false);
      })
      .catch(() => {
        setCopyError(true);
      });
  }, [query.data, queryData, fromName, solarSystemsIndex]);

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
                <>
                  {copyError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Failed to copy to clipboard
                    </Alert>
                  )}
                  <Box display="flex" alignItems="flex-start" mb={1}>
                    <Box flexGrow={1}>
                      <Typography variant="body1">
                        {query.data.length === 1
                          ? "1 system found"
                          : `${query.data.length} systems found`}
                      </Typography>
                    </Box>
                    <Box>
                      {query.data.length > 0 && (
                        <Tooltip title="If you paste with EVE-Links into in-game notepad, you get clickable links">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={copyResults}
                          >
                            Copy
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>System</TableCell>
                        <TableCell>Distance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {query.data.map((item) => (
                        <TableRow key={item.solarSystemId}>
                          <TableCell>
                            <ButtonSolarsystem
                              solarSystemId={item.solarSystemId}
                            />
                          </TableCell>
                          <TableCell>{item.distance}Ly</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </PaperLevel1>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalculateNearby;
