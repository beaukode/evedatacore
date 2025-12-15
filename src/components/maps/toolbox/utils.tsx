import React from "react";
import InternalLink from "@/components/ui/InternalLink";

export function genericNodeContent(
  id: string,
  name: string,
  text: string = ""
): React.ReactNode {
  return (
    <>
      <InternalLink
        title={`View system ${name}`}
        to={`/explore/solarsystems/${id}?from=${id}`}
      >
        {name}
      </InternalLink>
      <br />
      {text}
    </>
  );
}
