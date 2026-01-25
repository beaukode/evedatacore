import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { useUserDataContext } from "@/contexts/UserDataContext";
import FileButton from "@/components/form/FileButton";

const systemRecordSchema = z.array(
  z.object({
    id: z.string(),
    notes: z.string().optional(),
    color: z.string().optional(),
    content: z.array(z.string()).optional(),
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
);

interface DatabaseImportModalProps {
  open: boolean;
  onClose: () => void;
}

const DatabaseImportModal: React.FC<DatabaseImportModalProps> = ({
  open,
  onClose,
}) => {
  const { userDatabase } = useUserDataContext();

  const readfileMutation = useMutation({
    mutationFn: async (file: File) => {
      const data = await file.text();
      const json = JSON.parse(data);
      try {
        return systemRecordSchema.parse(json);
      } catch {
        throw new Error("Unexpected file format");
      }
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!readfileMutation.data) {
        throw new Error("No systems read from file");
      }
      await userDatabase.importSystems(readfileMutation.data);
    },
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <Dialog
      open={open}
      onTransitionExited={() => {
        readfileMutation.reset();
      }}
    >
      <DialogTitle>
        Import data from a file to {userDatabase.metadata.name}
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center">
          <FileButton
            loading={readfileMutation.isPending}
            onChange={(files) => {
              if (files[0]) {
                readfileMutation.mutate(files[0]);
              }
            }}
          >
            Select a file
          </FileButton>
        </Box>
        {readfileMutation.isError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {readfileMutation.error.message}
          </Alert>
        )}
        {readfileMutation.isSuccess && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {readfileMutation.data.length} systems read from file.
            <br />
            Systems with the same ID will be <strong>overwritten</strong>.
            <br />
            Please confirm to import.
          </Alert>
        )}
        {importMutation.isError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {importMutation.error.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="text" color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => importMutation.mutate()}
          loading={importMutation.isPending}
          disabled={!readfileMutation.isSuccess}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DatabaseImportModal;
