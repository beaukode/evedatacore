import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import ImportIcon from "@mui/icons-material/Download";
import ExportIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "@tanstack/react-query";
import { useUserDataContext } from "@/contexts/UserDataContext";
import { useSettings } from "@/map/hooks/useSettings";
import Panel from "@/map/components/Panel";
import DatabaseCreateModal from "./DatabaseCreateModal";
import DatabaseDeleteModal from "./DatabaseDeleteModal";
import DatabaseImportModal from "./DatabaseImportModal";

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
      <Panel
        title="Databases"
        titleAdornment={
          <Box display="flex">
            <Tooltip title="Delete" arrow>
              <IconButton
                disabled={settings.userDatabase === "main"}
                color="error"
                size="small"
                onClick={() => setOpenDeleteDbModal(true)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import" arrow>
              <IconButton
                color="primary"
                size="small"
                onClick={() => setOpenImportDbModal(true)}
              >
                <ImportIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export" arrow>
              <IconButton color="primary" size="small" onClick={handleExport}>
                <ExportIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create" arrow>
              <IconButton
                color="primary"
                size="small"
                onClick={() => setOpenCreateDbModal(true)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
      >
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
      </Panel>
      <DatabaseCreateModal
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
      <DatabaseDeleteModal
        open={openDeleteDbModal}
        slug={settings.userDatabase}
        name={userDatabase.metadata.name}
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
      <DatabaseImportModal
        open={openImportDbModal}
        onClose={() => setOpenImportDbModal(false)}
      />
    </>
  );
};

export default Databases;
