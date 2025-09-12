import React from "react";
import { Chip, Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonTribeProps {
  id?: number;
  name?: string;
  ticker?: string;
  fastRender?: boolean;
}

const ButtonTribe: React.FC<ButtonTribeProps> = ({
  id,
  name,
  ticker,
  fastRender,
}) => {
  if (!id) return null;
  if (!name) return id;
  if (!ticker) return id;
  if (fastRender) {
    return (
      <LooksOutlinedButton sx={{ justifyContent: "flex-start" }}>
        <Chip
          label={ticker}
          size="small"
          color="secondary"
          sx={{ borderRadius: 1 }}
        />
        &nbsp;
        {name}
      </LooksOutlinedButton>
    );
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/corporations/${id}`}
      variant="outlined"
    >
      <Chip
        label={ticker}
        size="small"
        color="secondary"
        sx={{ borderRadius: 1 }}
      />
      &nbsp;
      {name}
    </Button>
  );
};

export default ButtonTribe;
