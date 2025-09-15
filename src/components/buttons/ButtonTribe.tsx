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
  name = name || id.toString();
  if (fastRender) {
    return (
      <LooksOutlinedButton sx={{ justifyContent: "flex-start" }}>
        {ticker && (
          <>
            <Chip
              label={ticker}
              size="small"
              color="secondary"
              sx={{ borderRadius: 1 }}
            />
            &nbsp;
          </>
        )}

        {name}
      </LooksOutlinedButton>
    );
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/tribes/${id}`}
      variant="outlined"
    >
      {ticker && (
        <>
          <Chip
            label={ticker}
            size="small"
            color="secondary"
            sx={{ borderRadius: 1 }}
          />
          &nbsp;
        </>
      )}
      {name}
    </Button>
  );
};

export default ButtonTribe;
