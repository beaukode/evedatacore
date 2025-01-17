import React from "react";
import { Link } from "@mui/material";
import { NavLink } from "react-router";

interface InternalLinkProps {
  title: string;
  to: string;
  children?: React.ReactNode;
}

const InternalLink: React.FC<InternalLinkProps> = ({ title, to, children }) => (
  <Link to={to} title={title} component={NavLink}>
    {children || title}
  </Link>
);

export default InternalLink;
