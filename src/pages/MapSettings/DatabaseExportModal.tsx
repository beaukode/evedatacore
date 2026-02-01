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
import { useUserDataContext } from "@/contexts/UserDataContext";
import { ExportFileStrategyOptions, exportFileStrategy } from "@/api/userdata";
import DatabaseOperationReport from "./DatabaseOperationReport";
import RadioField from "@/components/form/RadioField";

interface DatabaseExportModalProps {
  open: boolean;
  onClose: () => void;
}

type FormData = Omit<ExportFileStrategyOptions, "filename">;

const DatabaseImportModal: React.FC<DatabaseExportModalProps> = ({
  open,
  onClose,
}) => {
  const { userDatabase } = useUserDataContext();

  const [formData, setFormData] = React.useState<FormData>({
    updatedWithin: 0,
  });

  const strategy = React.useMemo(
    () => exportFileStrategy(userDatabase),
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
    dryRun({
      ...formData,
      filename: `evedatacore_${userDatabase.metadata.name}_export.json`,
    });
  }, [formData, dryRun, userDatabase.metadata.name]);

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
          updatedWithin: 0,
        });
      }}
      fullWidth
    >
      <DialogTitle>
        Import data from a file to {userDatabase.metadata.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <RadioField
            label="Export data updated within"
            value={formData.updatedWithin.toString()}
            disabled={formDisabled}
            options={[
              { label: "All data", value: "0" },
              { label: "Last 1 hour", value: "1" },
              { label: "Last 3 hours", value: "3" },
              { label: "Last 6 hours", value: "6" },
              { label: "Last 12 hours", value: "12" },
              { label: "Last 24 hours", value: "24" },
              { label: "Last 48 hours", value: "48" },
              { label: "Last 72 hours", value: "72" },
              { label: "Last week (168 hours)", value: "168" },
              { label: "Last month (720 hours)", value: "720" },
            ]}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                updatedWithin: parseInt(value),
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
                executeMutation.mutate({
                  ...formData,
                  filename: `evedatacore_${userDatabase.metadata.name}_export.json`,
                });
              }}
              loading={dryRunPending || executeMutation.isPending}
              disabled={!dryRunSuccess || dryRunData?.exported === 0}
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
