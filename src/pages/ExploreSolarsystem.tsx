import React from "react";
import { Helmet } from "react-helmet";
import { Box } from "@mui/material";
import { Route, Routes, useLocation, useParams } from "react-router";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { getSolarsystemId } from "@/api/evedatacore-v2";
import { useQuery } from "@tanstack/react-query";
import TableAssemblies from "@/components/tables/TableAssemblies";
import TableKillmails from "@/components/tables/TableKillmails";
import ExploreSolarsystemNav from "./ExploreSolarsystem/ExploreSolarsystemNav";
import ExploreSolarsystemWorldData from "./ExploreSolarsystem/ExploreSolarsystemWorldData";
import ExploreSolarsystemMap from "./ExploreSolarsystem/ExploreSolarsystemMap";
import ExploreSolarsystemUserData from "./ExploreSolarsystem/ExploreSolarsystemUserData";
import ExploreSolarsystemSettings from "./ExploreSolarsystem/ExploreSolarsystemSettings";

const routesMap: Record<string, number> = {
  map: 1,
  data: 2,
  settings: 3,
};

const ExploreSolarsystem: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();

  const path = location.pathname.split("/").pop() ?? "";

  const currentTab = routesMap[path] ?? 0;

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
    <Box
      p={2}
      flexGrow={1}
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      {query.isLoading && (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <PaperLevel1
            title={title}
            loading={true}
            titleAdornment={
              <ExploreSolarsystemNav id={id ?? ""} currentTab={currentTab} />
            }
            backButton
          ></PaperLevel1>
        </>
      )}
      {query.data && (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <PaperLevel1
            title={query.data.name}
            titleAdornment={
              <ExploreSolarsystemNav id={id ?? ""} currentTab={currentTab} />
            }
            sx={
              currentTab !== 0
                ? { p: 0, height: "70vh", flexGrow: 1 }
                : undefined
            }
            backButton
          >
            <Routes>
              <Route
                index
                element={
                  <ExploreSolarsystemWorldData solarSystem={query.data} />
                }
              />
              <Route
                path="/map"
                element={<ExploreSolarsystemMap solarSystem={query.data} />}
              />
              <Route path="/data" element={<ExploreSolarsystemUserData />} />
              <Route
                path="/settings"
                element={<ExploreSolarsystemSettings />}
              />
            </Routes>
          </PaperLevel1>
          <Routes>
            <Route
              index
              element={
                <>
                  <TableAssemblies solarSystemId={query.data.id} />
                  <TableKillmails solarSystemId={query.data.id} />
                </>
              }
            />
          </Routes>
        </>
      )}
    </Box>
  );
};

export default ExploreSolarsystem;
