import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/DownloadForOffline";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "./hooks/useSettings";
import { useSystemsMapContext } from "./contexts/SystemsMapContext";
import Panel from "./components/Panel";
import PointsOfInterestField from "./components/PointsOfInterestField";
import SystemsSettingCreateDbModal from "./components/SystemsSettingCreateDbModal";
import SystemsSettingDeleteDbModal from "./components/SystemsSettingDeleteDbModal";
import SystemsSettingImportDbModal from "./components/SystemsSettingImportDbModal";

const SystemsSettings: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { mainDatabase, userDatabase } = useSystemsMapContext();

  const [openCreateDbModal, setOpenCreateDbModal] = React.useState(false);
  const [openDeleteDbModal, setOpenDeleteDbModal] = React.useState(false);
  const [openImportDbModal, setOpenImportDbModal] = React.useState(false);

  const userDatabases = useQuery({
    queryKey: ["MainDatabase", "userDatabases"],
    queryFn: async () => {
      return await mainDatabase.listUserDatabases();
    },
  });

  const handleExport = async () => {
    const data = await userDatabase.listSystems();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evedatacore_${settings.userDatabase}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={2}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Panel title="Databases">
            <FormControl>
              <RadioGroup
                aria-labelledby="active-database-group-label"
                defaultValue="main"
                sx={{ ml: 2 }}
              >
                {userDatabases.data?.map((userDatabase) => (
                  <FormControlLabel
                    key={userDatabase.slug}
                    value={userDatabase.slug}
                    control={<Radio />}
                    label={userDatabase.name}
                    checked={settings.userDatabase === userDatabase.slug}
                    onChange={(event) => {
                      const target = event.target as HTMLInputElement;
                      setSettings({
                        ...settings,
                        userDatabase: target.value,
                      });
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Box
              display="flex"
              gap={1}
              my={0.5}
              justifyContent="flex-end"
              flexWrap="wrap-reverse"
            >
              <IconButton
                title="Delete database"
                disabled={settings.userDatabase === "main"}
                color="error"
                size="small"
                onClick={() => setOpenDeleteDbModal(true)}
              >
                <DeleteIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={
                  <DownloadIcon sx={{ transform: "rotate(180deg)" }} />
                }
                onClick={() => setOpenImportDbModal(true)}
              >
                Import
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateDbModal(true)}
              >
                Create
              </Button>
            </Box>
          </Panel>
        </Grid2>
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
      <SystemsSettingCreateDbModal
        open={openCreateDbModal}
        onClose={(createdSlug) => {
          setOpenCreateDbModal(false);
          if (createdSlug) {
            userDatabases.refetch();
            setSettings({
              ...settings,
              userDatabase: createdSlug,
            });
          }
        }}
      />
      <SystemsSettingDeleteDbModal
        open={openDeleteDbModal}
        slug={settings.userDatabase}
        name={userDatabase.name}
        onClose={(deleted) => {
          setOpenDeleteDbModal(false);
          if (deleted) {
            userDatabases.refetch();
            setSettings({
              ...settings,
              userDatabase: "main",
            });
          }
        }}
      />
      <SystemsSettingImportDbModal
        open={openImportDbModal}
        onClose={() => setOpenImportDbModal(false)}
      />
    </Box>
  );
};

export default SystemsSettings;
