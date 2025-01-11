import React from "react";
import { Link } from "@mui/material";

interface ExternalLinkProps {
  title: string;
  href: string;
  children?: React.ReactNode;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  title,
  href,
  children,
}) => (
  <Link href={href} title={title} rel="noopener" target="_blank">
    {children || href}
  </Link>
);

export default ExternalLink;
