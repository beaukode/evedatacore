import React from "react";
import { Helmet } from "react-helmet";
import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getTypesById } from "@/api/stillness";
import Error404 from "./Error404";

const ExploreType: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["SmartcharactersById", id],
    queryFn: async () =>
      await getTypesById({ path: { id: id || "0" } }).then((r) => r.data),
    enabled: !!id,
  });

  const data = query.data?.metadata;
  if (!id || (!query.isLoading && !query.data?.cid)) {
    return <Error404 />;
  }

  const name = data?.name ? `${data.name} [${id}]` : "...";
  const attributes = data?.attributes || [];

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      {!query.isLoading && data && (
        <Helmet>
          <title>{name}</title>
        </Helmet>
      )}
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        <IconButton color="primary" onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
        {name}
      </Typography>
      <Paper elevation={1}>
        <LinearProgress
          sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
        />
        {!query.isLoading && data && (
          <Box>
            <Box display="flex" p={1}>
              <Avatar
                src={data.image}
                alt={data.name}
                variant="rounded"
                sx={{ width: 120, height: 120, m: 1 }}
              >
                <QuestionMarkIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="body1"
                sx={{ textAlign: "justify" }}
                component="p"
              >
                {data.description}
              </Typography>
            </Box>
            <List sx={{ width: "100%", overflow: "hidden" }}>
              <ListItem>
                <ListItemText>
                  <TextField
                    label="itemId"
                    value={data.smartItemId}
                    variant="outlined"
                    onChange={() => {}}
                    fullWidth
                  />
                </ListItemText>
              </ListItem>
              {attributes.map((a) => {
                return (
                  <ListItem key={a.trait_type}>
                    <ListItemText>
                      {a.trait_type}: {a.value as unknown as string}
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ExploreType;
