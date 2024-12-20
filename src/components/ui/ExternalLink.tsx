import React from "react";
import { Link } from "@mui/material";

interface ExternalLinkProps {
  title: string;
  href: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ title, href }) => (
  <Link href={href} title={title} rel="noopener" target="_blank">
    {href}
  </Link>
);

export default ExternalLink;
