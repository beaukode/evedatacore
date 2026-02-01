import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { useUserDataContext } from "@/contexts/UserDataContext";
import FileButton from "@/components/form/FileButton";
import {
  importFileStrategy,
  ImportFileStrategyOptions,
  ImportStrategyMethod,
} from "@/api/userdata";
import DatabaseOperationReport from "./DatabaseOperationReport";
import RadioField from "@/components/form/RadioField";

interface DatabaseImportModalProps {
  open: boolean;
  onClose: () => void;
}

type FormData = Partial<ImportFileStrategyOptions>;

function isCompleteImportOptions(
  value: Partial<ImportFileStrategyOptions>
): value is ImportFileStrategyOptions {
  return value.file !== undefined && value.method !== undefined;
}

const DatabaseImportModal: React.FC<DatabaseImportModalProps> = ({
  open,
  onClose,
}) => {
  const { userDatabase } = useUserDataContext();

  const [formData, setFormData] = React.useState<FormData>({
    method: "replace",
  });

  const strategy = React.useMemo(
    () => importFileStrategy(userDatabase),
    [userDatabase]
  );

  const {
    mutate: dryRun,
    reset: resetDryRun,
    isPending: dryRunPending,
    error: dryRunError,
    isSuccess: dryRunSuccess,
    data: dryRunData,
  } = useMutation({
    mutationFn: strategy.dryRun,
  });

  const executeMutation = useMutation({
    mutationFn: strategy.execute,
  });

  React.useEffect(() => {
    if (isCompleteImportOptions(formData)) {
      dryRun(formData);
    } else {
      resetDryRun();
    }
  }, [formData, dryRun, resetDryRun]);

  const formDisabled = dryRunPending || !executeMutation.isIdle;
  const error =
    executeMutation.isSuccess || executeMutation.isError
      ? executeMutation.error
      : dryRunError;
  const result =
    executeMutation.isSuccess || executeMutation.isError
      ? executeMutation.data
      : dryRunData;

  return (
    <Dialog
      open={open}
      onTransitionExited={() => {
        resetDryRun();
        executeMutation.reset();
        setFormData({
          method: "replace",
        });
      }}
      fullWidth
    >
      <DialogTitle>
        Import data from a file to {userDatabase.metadata.name}
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center">
          {formData.file ? (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="center"
            >
              <Typography>{formData.file.name}</Typography>
              <IconButton
                title="Remove file"
                color="primary"
                disabled={formDisabled}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    file: undefined,
                  }));
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ) : (
            <FileButton
              accept=".json"
              onChange={(files) => {
                if (files[0]) {
                  setFormData((prev) => ({
                    ...prev,
                    file: files[0],
                  }));
                }
              }}
            >
              Select a file
            </FileButton>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <RadioField
            label="Import method"
            value={formData.method}
            disabled={formDisabled}
            options={[
              { label: "Merge and replace", value: "merge" },
              {
                label: "Merge and replace if newer",
                value: "merge-newer",
              },
              { label: "Replace all data", value: "replace" },
            ]}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                method: value as ImportStrategyMethod,
              }));
            }}
          />
        </Box>
        {result && <DatabaseOperationReport result={result} />}
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error.message}
          </Alert>
        )}
        {executeMutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Data imported successfully
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {executeMutation.isSuccess || executeMutation.isError ? (
          <Button onClick={() => onClose()} variant="contained" color="primary">
            Close
          </Button>
        ) : (
          <>
            <Button onClick={() => onClose()} variant="text" color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (isCompleteImportOptions(formData)) {
                  executeMutation.mutate(formData);
                }
              }}
              loading={dryRunPending || executeMutation.isPending}
              disabled={!dryRunSuccess}
              variant="contained"
            >
              Confirm
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DatabaseImportModal;
