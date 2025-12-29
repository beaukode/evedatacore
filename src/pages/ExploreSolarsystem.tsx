import React from "react";
import { Helmet } from "react-helmet";
import { Box, Button, Grid2, Link, List } from "@mui/material";
import { useParams } from "react-router";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import TableAssemblies from "@/components/tables/TableAssemblies";
import TableKillmails from "@/components/tables/TableKillmails";
import { getSolarsystemId } from "@/api/evedatacore-v2";
import { useQuery } from "@tanstack/react-query";
import SystemsMap from "@/systemsMap/SystemsMap";

const ExploreSolarsystem: React.FC = () => {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["Solarsystem", id],
    queryFn: async () => {
      if (!id) return null;
      const r = await getSolarsystemId({ path: { id: id } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!id,
  });

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title = data?.name || "...";

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1
        title={title}
        sx={{ p: 0 }}
        loading={query.isFetching}
        titleAdornment={
          <Button
            component={Link}
            href={`https://ef-map.com/?system=${data?.id}&zoom=75`}
            title="View on EF Map"
            variant="outlined"
            size="small"
            color="primary"
            rel="noopener"
            target="_blank"
          >
            View on EF Map
          </Button>
        }
        backButton
      >
        <SystemsMap systemId={id} />
      </PaperLevel1>
      <PaperLevel1 title="Data" loading={query.isFetching}>
        {data && (
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
                <BasicListItem title="Id">{data.id}</BasicListItem>
                <BasicListItem title="L-Points">
                  {data.lpoints.occupied} occupied / {data.lpoints.count} total
                </BasicListItem>
              </List>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
                <BasicListItem title="World coordinates">
                  <Box sx={{ pl: 4 }}>
                    <span style={{ textWrap: "nowrap" }}>
                      x: {data.location.x}
                    </span>
                    <br />
                    <span style={{ textWrap: "nowrap" }}>
                      y: {data.location.y}
                    </span>
                    <br />
                    <span style={{ textWrap: "nowrap" }}>
                      z: {data.location.z}
                    </span>
                  </Box>
                </BasicListItem>
              </List>
            </Grid2>
          </Grid2>
        )}
      </PaperLevel1>
      <TableAssemblies solarSystemId={id} />
      <TableKillmails solarSystemId={id} />
    </Box>
  );
};

export default ExploreSolarsystem;
