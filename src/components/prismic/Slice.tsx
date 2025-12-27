import React from "react";
import { Content } from "@prismicio/client";
import SliceText from "./SliceText";
import SliceTextImage from "./SliceTextImage";

interface SliceProps {
  slice: Content.PageDocumentDataBodySlice;
}

const Slice: React.FC<SliceProps> = ({ slice }) => {
  if (slice.slice_type === "text") {
    return <SliceText slice={slice} />;
  }
  if (slice.slice_type === "text___image") {
    return <SliceTextImage slice={slice} />;
  }
  return <div>Unknown slice type: {slice.slice_type}</div>;
};

export default Slice;
