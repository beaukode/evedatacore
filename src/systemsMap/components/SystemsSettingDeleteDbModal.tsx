import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSystemsMapContext } from "../contexts/SystemsMapContext";

interface SystemsSettingDeleteDbModalProps {
  open: boolean;
  slug: string;
  name: string;
  onClose: (deleted: boolean) => void;
}

const SystemsSettingDeleteDbModal: React.FC<
  SystemsSettingDeleteDbModalProps
> = ({ open, slug, name, onClose }) => {
  const { mainDatabase, userDatabase } = useSystemsMapContext();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await mainDatabase.deleteUserDatabase(slug);
      await userDatabase.deleteDatabase();
    },
    onSuccess: () => {
      onClose(true);
    },
  });

  return (
    <Dialog open={open}>
      <DialogTitle>Are you sure you want to delete?</DialogTitle>
      <DialogContent>
        <Typography typography="body1" sx={{ my: 1 }}>
          ID: {slug}
        </Typography>
        <Typography typography="body1" sx={{ my: 1 }}>
          Name: {name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} variant="text" color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => deleteMutation.mutate()}
          loading={deleteMutation.isPending}
          variant="contained"
          color="error"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SystemsSettingDeleteDbModal;
