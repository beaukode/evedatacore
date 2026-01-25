import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/DownloadForOffline";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "@tanstack/react-query";
import { useUserDataContext } from "@/contexts/UserDataContext";
import { useSettings } from "@/map/hooks/useSettings";
import Panel from "@/map/components/Panel";
import SystemsSettingCreateDbModal from "@/map/components/SystemsSettingCreateDbModal";
import SystemsSettingDeleteDbModal from "@/map/components/SystemsSettingDeleteDbModal";
import SystemsSettingImportDbModal from "@/map/components/SystemsSettingImportDbModal";

const Databases: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { mainDatabase, userDatabase } = useUserDataContext();

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
    <>
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
            startIcon={<DownloadIcon sx={{ transform: "rotate(180deg)" }} />}
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
    </>
  );
};

export default Databases;
