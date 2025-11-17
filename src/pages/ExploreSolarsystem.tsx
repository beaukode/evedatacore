import React from "react";
import { Helmet } from "react-helmet";
import { Box, Grid2, List } from "@mui/material";
import { useParams } from "react-router";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import TableAssemblies from "@/components/tables/TableAssemblies";
import TableKillmails from "@/components/tables/TableKillmails";
import { getSolarsystemId } from "@/api/evedatacore-v2";
import { useQuery } from "@tanstack/react-query";

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
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <PaperLevel1 title={title} loading={query.isFetching} backButton>
            {data && (
              <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
                <BasicListItem title="Id">{data.id}</BasicListItem>
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
                <BasicListItem title="L-Points">
                  {data.lpoints.occupied} occupied / {data.lpoints.count} total
                </BasicListItem>
              </List>
            )}
          </PaperLevel1>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }} display="flex">
          {data && (
            <PaperLevel1
              title=""
              loading={query.isFetching}
              sx={{
                mt: { xs: 0, sm: 6 },
                flexGrow: 1,
                overflow: "hidden",
                minHeight: 300,
              }}
            >
              <iframe
                src={`https://ef-map.com/embed?system=${data.id}&zoom=50&orbit=1&color=green`}
                width="100%"
                height="100%"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                style={{ border: 0 }}
              ></iframe>
            </PaperLevel1>
          )}
        </Grid2>
      </Grid2>
      <TableAssemblies solarSystemId={id} />
      <TableKillmails solarSystemId={id} />
    </Box>
  );
};

export default ExploreSolarsystem;
