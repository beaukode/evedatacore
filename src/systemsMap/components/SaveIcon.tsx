import MuiSaveIcon from "@mui/icons-material/Save";
import "./SaveIcon.css";

const SaveIcon: React.FC = () => {
  return (
    <MuiSaveIcon
      fontSize="small"
      color="primary"
      sx={{
        animation: "fade-in-out 1000ms ease-in-out infinite",
      }}
    />
  );
};

export default SaveIcon;
