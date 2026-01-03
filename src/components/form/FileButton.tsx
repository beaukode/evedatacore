import React from "react";
import { styled, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type FileButtonProps = Omit<React.ComponentProps<typeof Button>, "onChange"> & {
  onChange: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
};

const FileButton: React.FC<FileButtonProps> = ({
  children,
  onChange,
  accept,
  multiple,
  ...props
}) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {children ?? (multiple ? "Select files" : "Select a file")}
      <VisuallyHiddenInput
        type="file"
        accept={accept}
        onChange={(event) => {
          if (event.target.files) {
            onChange(event.target.files);
          }
        }}
        multiple={multiple}
      />
    </Button>
  );
};

export default FileButton;
