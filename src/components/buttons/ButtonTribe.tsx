import React from "react";
import { Chip, Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";
import { snakeCase } from "lodash-es";

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
  let link = `/explore/tribes/${id}`;
  if (name) {
    const slug = snakeCase(name).replace(/_/g, "-");
    link += `/${ticker}-${slug}`;
  }

  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={link}
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
