import React from "react";
import { Helmet } from "react-helmet";
import { Box, List } from "@mui/material";
import { useParams } from "react-router";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import TableAssemblies from "@/components/tables/TableAssemblies";
import TableKillmails from "@/components/tables/TableKillmails";

const ExploreSolarsystem: React.FC = () => {
  const { id } = useParams();
  const ssIndex = useSolarSystemsIndex();

  const solarSystem = ssIndex?.getById(id || "");
  if (ssIndex && !solarSystem) {
    return <Error404 />;
  }

  const name = solarSystem?.solarSystemName || "...";

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <PaperLevel1 title={name} loading={!ssIndex} backButton>
        {solarSystem && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="Id">
              {solarSystem.solarSystemId}
            </BasicListItem>
            <BasicListItem title="Location">
              <Box sx={{ pl: 4 }}>
                <span style={{ textWrap: "nowrap" }}>
                  x: {solarSystem.location.x}
                </span>
                <br />
                <span style={{ textWrap: "nowrap" }}>
                  y: {solarSystem.location.y}
                </span>
                <br />
                <span style={{ textWrap: "nowrap" }}>
                  z: {solarSystem.location.z}
                </span>
              </Box>
            </BasicListItem>
          </List>
        )}
      </PaperLevel1>
      <TableAssemblies solarSystemId={id} />
      <TableKillmails solarSystemId={id} />
    </Box>
  );
};

export default ExploreSolarsystem;
