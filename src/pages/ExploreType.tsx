import React from "react";
import { Helmet } from "react-helmet";
import { Avatar, Box, List, Typography } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useParams } from "react-router";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import { useTypesIndex } from "@/contexts/AppContext";

const ExploreType: React.FC = () => {
  const { id } = useParams();
  const typesIndex = useTypesIndex();

  const data = React.useMemo(() => {
    if (!typesIndex || !id) return null;
    return typesIndex.getById(id);
  }, [typesIndex, id]);

  if (typesIndex && !data) {
    return <Error404 />;
  }

  const name = data?.name ? `${data.name} [${id}]` : "...";
  const attributes = data?.attributes || [];

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      {data && (
        <Helmet>
          <title>{name}</title>
        </Helmet>
      )}
      <PaperLevel1 title={name} loading={!typesIndex} backButton>
        {data && (
          <>
            <Box display="flex" p={0}>
              <Avatar
                src={data.image}
                alt={data.name}
                variant="rounded"
                sx={{ width: 120, height: 120, mr: 1 }}
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
            <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
              <BasicListItem title="itemId">{data.smartItemId}</BasicListItem>
              {attributes.map((a) => {
                return (
                  <BasicListItem key={a.trait_type} title={a.trait_type || ""}>
                    {a.value as unknown as string}
                  </BasicListItem>
                );
              })}
            </List>
          </>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default ExploreType;
