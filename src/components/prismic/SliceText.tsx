import React from "react";
import { Divider } from "@mui/material";
import { PageDocumentDataBodyTextSlice } from "@/api/prismic";
import { PrismicRichText } from "@prismicio/react";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { getTextFromNode, sx } from "./utils";

interface SliceProps {
  slice: PageDocumentDataBodyTextSlice;
}

const SliceText: React.FC<SliceProps> = ({ slice }) => {
  const title = getTextFromNode(slice.primary.section_title[0]);
  return (
    <PaperLevel1 title={title} sx={sx}>
      {slice.items.map((item, index) => {
        return (
          <>
            {index > 0 && <Divider sx={{ width: "100%" }} />}
            <PrismicRichText key={index} field={item.content} />
          </>
        );
      })}
    </PaperLevel1>
  );
};

export default SliceText;
