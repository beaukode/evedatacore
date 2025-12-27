import React from "react";
import { Divider, Grid2, useTheme } from "@mui/material";
import { PrismicRichText } from "@prismicio/react";
import { PageDocumentDataBodyTextImageSlice } from "@/api/prismic";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ResponsiveImage from "@/components/ui/ResponsiveImage";
import { getTextFromNode, parseGridWidth, sx } from "./utils";

interface SliceProps {
  slice: PageDocumentDataBodyTextImageSlice;
}

const SliceTextImage: React.FC<SliceProps> = ({ slice }) => {
  const theme = useTheme();
  const title = getTextFromNode(slice.primary.section_title[0]);
  return (
    <PaperLevel1 title={title} sx={sx}>
      <Grid2 container spacing={2}>
        {slice.items.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {index > 0 && <Divider sx={{ width: "100%" }} />}
              <Grid2
                size={12 - parseGridWidth(item.image_grid_width)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "start",
                }}
              >
                <PrismicRichText field={item.text} />
              </Grid2>
              <Grid2
                size={parseGridWidth(item.image_grid_width)}
                sx={{ textAlign: "center" }}
              >
                <ResponsiveImage
                  src={item.image.url}
                  alt={item.image.alt}
                  style={{
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.primary.dark}`,
                  }}
                />
              </Grid2>
            </React.Fragment>
          );
        })}
      </Grid2>
    </PaperLevel1>
  );
};

export default SliceTextImage;
