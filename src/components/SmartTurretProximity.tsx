import React from "react";
import { FormControl, TextField } from "@mui/material";

interface SmartTurretProximityProps {
  proximity?: {
    aggression: null | unknown;
    inProximity: null | unknown;
  };
}

const SmartTurretProximity: React.FC<SmartTurretProximityProps> = ({
  proximity,
}) => {
  if (!proximity) return;
  return (
    <>
      <FormControl fullWidth>
        <TextField
          label="Aggression"
          variant="outlined"
          multiline={true}
          minRows={3}
          value={JSON.stringify(proximity.aggression)}
          sx={{ m: 2 }}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          label="In Proximity"
          variant="outlined"
          multiline={true}
          minRows={3}
          value={JSON.stringify(proximity.inProximity)}
          sx={{ m: 2 }}
        />
      </FormControl>
    </>
  );
};

export default SmartTurretProximity;
