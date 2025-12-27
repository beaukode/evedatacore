import React from "react";
import { Helmet } from "react-helmet";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getPage } from "@/api/prismic";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import Slice from "@/components/prismic/Slice";
import Error404 from "@/pages/Error404";

interface PageProps {
  uid: string;
}

const PrismicPage: React.FC<PageProps> = ({ uid }) => {
  const pageQuery = useQuery({
    queryKey: ["page", uid],
    queryFn: () => getPage(uid),
  });

  const pageTitle = React.useMemo(() => {
    return pageQuery.data?.data.title[0]?.type === "heading1"
      ? pageQuery.data?.data.title[0]?.text
      : undefined;
  }, [pageQuery.data]);

  if (pageQuery.isLoading) {
    return (
      <Box p={2} flexGrow={1} overflow="auto">
        <PaperLevel1 title="..." loading={true}></PaperLevel1>
      </Box>
    );
  }

  if (pageQuery.isError) {
    return <Error404 />;
  }

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        {pageQuery.data?.data.body.map((slice) => {
          return <Slice key={slice.id} slice={slice} />;
        })}
      </>
    </Box>
  );
};

export default PrismicPage;
