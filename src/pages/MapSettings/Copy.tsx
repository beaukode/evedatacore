import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSettings } from "@/map/hooks/useSettings";
import Panel from "@/map/components/Panel";
import PointsOfInterestField from "@/map/components/PointsOfInterestField";

const Copy: React.FC = () => {
  const { settings, setSettings } = useSettings();

  return (
    <Panel title="Copy">
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.copy.numbering}
            onChange={(event) => {
              setSettings({
                ...settings,
                copy: {
                  ...settings.copy,
                  numbering: event.target.checked,
                },
              });
            }}
          />
        }
        sx={{ mx: 0.5 }}
        label="Numbering"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.copy.discordEmojis}
            disabled={!settings.copy.numbering}
            onChange={(event) => {
              setSettings({
                ...settings,
                copy: {
                  ...settings.copy,
                  discordEmojis: event.target.checked,
                },
              });
            }}
          />
        }
        sx={{ mx: 0.5 }}
        label="Discord emojis"
      />
      <PointsOfInterestField
        title="Exclude points of interest"
        value={settings.copy.exclude}
        sx={{ mx: 1 }}
        onChange={(value) => {
          setSettings({
            ...settings,
            copy: { ...settings.copy, exclude: value },
          });
        }}
      />
    </Panel>
  );
};

export default Copy;
