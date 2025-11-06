import React from "react";
import { Link } from "@mui/material";
import { NavLink } from "react-router";
import { asmTypeLabel, AssemblyTypeId } from "@/constants";

interface CharacterLinkProps {
  account: string;
  name: string;
}

export const CharacterLink: React.FC<CharacterLinkProps> = ({
  account,
  name,
}) => {
  return (
    <>
      <Link component={NavLink} to={`/explore/characters/${account}`}>
        {name}
      </Link>
    </>
  );
};

interface TribeLinkProps {
  id: number;
  name: string;
  ticker: string;
}

export const TribeLink: React.FC<TribeLinkProps> = ({ id, name, ticker }) => {
  return (
    <>
      <Link component={NavLink} to={`/explore/tribes/${id}`}>
        [{ticker}] {name}
      </Link>
    </>
  );
};

interface SolarSystemLinkProps {
  id: number;
  name: string;
}

export const SolarSystemLink: React.FC<SolarSystemLinkProps> = ({
  id,
  name,
}) => {
  return (
    <Link component={NavLink} to={`/explore/solarsystems/${id}`}>
      {name}
    </Link>
  );
};

interface AssemblyLinkProps {
  id: string;
  type: number;
  name?: string;
}

export const AssemblyLink: React.FC<AssemblyLinkProps> = ({
  id,
  name,
  type,
}) => {
  const typeLabel = asmTypeLabel[type as AssemblyTypeId] ?? "Unknown assembly";
  return (
    <Link component={NavLink} to={`/explore/assemblies/${id}`}>
      {name ? `${typeLabel} ${name}` : typeLabel}
    </Link>
  );
};

interface SystemLinkProps {
  id: string;
  namespace?: string;
  name: string;
}

export const SystemLink: React.FC<SystemLinkProps> = ({
  id,
  namespace,
  name,
}) => {
  return (
    <Link component={NavLink} to={`/explore/systems/${id}`}>
      {namespace ? `[${namespace}] ${name}` : name}
    </Link>
  );
};
