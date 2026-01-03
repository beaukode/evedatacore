import React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { kebabCase } from "lodash-es";
import { useMutation } from "@tanstack/react-query";
import { useSystemsMapContext } from "../contexts/SystemsMapContext";

interface SystemsSettingCreateDbModalProps {
  open: boolean;
  onClose: (createdSlug?: string) => void;
}

const SystemsSettingCreateDbModal: React.FC<
  SystemsSettingCreateDbModalProps
> = ({ open, onClose }) => {
  const { mainDatabase } = useSystemsMapContext();
  const [slug, setSlug] = React.useState("");
  const [name, setName] = React.useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const success = await mainDatabase.createUserDatabase(slug, name);
      if (!success) {
        throw new Error("Database already exists");
      }
    },
    onSuccess: () => {
      onClose(slug);
    },
  });

  return (
    <Dialog
      open={open}
      onTransitionExited={() => {
        setSlug("");
        setName("");
      }}
    >
      <DialogTitle>Create new database</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ my: 1 }}
          label="Database name"
          fullWidth
          required
          value={name}
          disabled={createMutation.isPending}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(kebabCase(e.target.value));
          }}
        />
        <TextField
          sx={{ my: 1 }}
          label="Database ID"
          fullWidth
          disabled
          value={slug}
        />
        {createMutation.isError && (
          <Alert severity="error">{createMutation.error.message}</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="text" color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={slug.length < 1 || createMutation.isPending}
          loading={createMutation.isPending}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SystemsSettingCreateDbModal;
