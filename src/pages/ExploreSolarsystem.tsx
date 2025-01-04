import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import Error404 from "./Error404";

const ExploreSolarsystem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ssIndex = useSolarSystemsIndex();

  const solarSystem = ssIndex.getById(id || "");
  if (!solarSystem) {
    return <Error404 />;
  }

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{solarSystem.solarSystemName}</title>
      </Helmet>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        <IconButton color="primary" onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
        {solarSystem.solarSystemName}
      </Typography>
      <Paper elevation={1}>
        <Box>
          <List sx={{ width: "100%", overflow: "hidden" }}>
            <ListItem>
              <ListItemText>
                Id:
                {solarSystem.solarSystemId}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Location:
                <Box component="p" sx={{ ml: 4 }}>
                  x: {solarSystem.location?.x}
                  <br />
                  y: {solarSystem.location?.y}
                  <br />
                  z: {solarSystem.location?.z}
                </Box>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExploreSolarsystem;
