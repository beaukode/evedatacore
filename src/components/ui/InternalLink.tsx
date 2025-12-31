import React from "react";
import { Link, SxProps } from "@mui/material";
import { NavLink } from "react-router";

interface InternalLinkProps {
  title: string;
  to: string;
  children?: React.ReactNode;
  sx?: SxProps;
}

const InternalLink: React.FC<InternalLinkProps> = ({
  title,
  to,
  children,
  sx,
}) => (
  <Link to={to} title={title} component={NavLink} sx={sx}>
    {children || title}
  </Link>
);

export default InternalLink;
