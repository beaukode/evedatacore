import React from "react";
import { Box, Paper, Tabs, Tab, Button, Link } from "@mui/material";
import ExternalLinkIcon from "@mui/icons-material/Launch";
import ExploreDataIcon from "@mui/icons-material/TravelExplore";
import {
  NavLink,
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { getSolarsystemId } from "@/api/evedatacore-v2";
import MapRoot from "@/pages/MapRoot";
import { UserDataContextProvider } from "@/contexts/UserDataContextProvider";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import MapUserData from "@/pages/MapUserData";
import MapSettings from "@/pages/MapSettings";
import Error404 from "./Error404";
import { useLastOptions } from "@/map/hooks/useLastOptions";

const routesMap: Record<string, number> = {
  userdata: 1,
  settings: 2,
};

const Map: React.FC = () => {
  const lastIdUpdated = React.useRef<string | undefined>();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { lastOptions, setLastOptions } = useLastOptions();

  React.useEffect(() => {
    if (!id) {
      navigate(`/map/${lastOptions.id}`, { replace: true });
    } else if (lastIdUpdated.current !== id) {
      setLastOptions((prev) => ({ ...prev, id: Number(id) }));
      lastIdUpdated.current = id;
    }
  }, [id, lastOptions.id, setLastOptions, navigate]);

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

  if (!id) {
    return null;
  }

  if (!query.isLoading && !query.data) {
    return <Error404 />;
  }

  const path = location.pathname.split("/").pop() || "";

  const currentTab = routesMap[path] || 0;

  const title = query.data?.name || "...";

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab} variant="scrollable" scrollButtons>
          <Tab label="Map" component={NavLink} to={`/map/${id}`} replace />
          <Tab
            label="User data"
            component={NavLink}
            to={`/map/${id}/userdata`}
            replace
          />
          <Tab
            label="Settings"
            component={NavLink}
            to={`/map/${id}/settings`}
            replace
          />
        </Tabs>
      </Paper>
      <Box
        p={2}
        flexGrow={1}
        overflow="auto"
        display="flex"
        flexDirection="column"
      >
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <PaperLevel1
          title={title}
          loading={query.isLoading}
          sx={{
            flexGrow: currentTab === 2 ? 0 : 1,
            p: 0,
            mb: 0,
            height: currentTab === 2 ? "auto" : "70vh",
          }}
          titleAdornment={
            <Box display="flex" gap={2} alignItems="center">
              <Button
                component={Link}
                href={`https://ef-map.com/?system=${id}&zoom=75`}
                title="View on EF Map"
                startIcon={<ExternalLinkIcon />}
                variant="outlined"
                color="primary"
                rel="noopener"
                target="_blank"
              >
                EF-Map
              </Button>
              <Button
                component={RouterLink}
                startIcon={<ExploreDataIcon />}
                to={`/explore/solarsystems/30004006`}
                title="View solar system details"
                variant="outlined"
                color="primary"
              >
                Solar system
              </Button>
            </Box>
          }
          backButton
        >
          {query.data && (
            <UserDataContextProvider>
              <Routes>
                <Route path="/" element={<MapRoot systemId={id || ""} />} />
                <Route path="/userdata" element={<MapUserData />} />
                <Route path="/settings" element={<MapSettings />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </UserDataContextProvider>
          )}
        </PaperLevel1>
      </Box>
    </>
  );
};

export default Map;
