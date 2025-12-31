import React from "react";
import { Box, Checkbox, FormControlLabel, Grid2 } from "@mui/material";
import { useSettings } from "./hooks/useSettings";
import Panel from "./components/Panel";
import PointsOfInterestField from "./components/PointsOfInterestField";

const SystemsSettings: React.FC = () => {
  const { settings, setSettings } = useSettings();
  return (
    <Box p={2}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Panel title="System data copy">
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
              label="Discord emojis"
            />
            <PointsOfInterestField
              title="Exclude points of interest"
              value={settings.copy.exclude}
              onChange={(value) => {
                setSettings({
                  ...settings,
                  copy: { ...settings.copy, exclude: value },
                });
              }}
            />
          </Panel>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SystemsSettings;
