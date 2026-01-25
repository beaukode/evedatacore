import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSettings } from "@/map/hooks/useSettings";
import Panel from "@/map/components/Panel";
import PointsOfInterestField from "@/map/components/PointsOfInterestField";

const Copy: React.FC = () => {
  const { settings, setSettings } = useSettings();

  return (
    <Panel title="Copy" sx={{ height: "70vh" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.copy.numbering}
            onChange={(event) => {
              setSettings((prev) => ({
                ...prev,
                copy: {
                  ...prev.copy,
                  numbering: event.target.checked,
                },
              }));
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
              setSettings((prev) => ({
                ...prev,
                copy: {
                  ...prev.copy,
                  discordEmojis: event.target.checked,
                },
              }));
            }}
          />
        }
        sx={{ mx: 0.5 }}
        label="Discord emojis"
      />
      <PointsOfInterestField
        title="Exclude points of interest"
        value={settings.copy.exclude}
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 100,
        }}
        onChange={(value) => {
          setSettings((prev) => ({
            ...prev,
            copy: { ...prev.copy, exclude: value },
          }));
        }}
      />
    </Panel>
  );
};

export default Copy;
