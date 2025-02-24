import React from "react";
import {
  Avatar,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useDisconnect } from "wagmi";
import { NavLink } from "react-router";
import UnknwonUserIcon from "@mui/icons-material/QuestionMark";
import DisconnectIcon from "@mui/icons-material/PowerOff";
import CharacterPageIcon from "@mui/icons-material/Person";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { shorten } from "@/tools";
import { useSmartCharacter } from "@/contexts/AppContext";

interface UserButtonProps {
  disableMenu?: boolean;
}

const UserButton: React.FC<UserButtonProps> = ({ disableMenu }) => {
  const menuAnchor = React.useRef<HTMLButtonElement | null>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const smartCharacter = useSmartCharacter();
  const { disconnect } = useDisconnect();

  const copyAddress = React.useCallback(() => {
    if (smartCharacter.isConnected) {
      navigator.clipboard.writeText(smartCharacter.address).catch((e) => {
        console.error("Fail to copying content", e);
      });
    }
  }, [smartCharacter]);

  if (!smartCharacter.isConnected) {
    return null;
  }

  return (
    <>
      <Button
        ref={menuAnchor}
        id="user-menu-button"
        onClick={() => {
          if (!disableMenu) {
            setShowMenu(true);
          }
        }}
        sx={{
          paddingRight: 1,
          cursor: disableMenu ? "default" : "pointer",
          pointerEvents: disableMenu ? "none" : "auto",
        }}
        variant="outlined"
        endIcon={
          smartCharacter.characterId ? (
            <Avatar
              sx={{ my: "-5px", mr: "-4px" }}
              variant="rounded"
              src="https://artifacts.evefrontier.com/Character/123456789_256.jpg"
            />
          ) : (
            <Avatar
              sx={{ my: "-5px", mr: "-4px", background: "black" }}
              variant="rounded"
            >
              <UnknwonUserIcon color="primary" />
            </Avatar>
          )
        }
      >
        <>
          {smartCharacter.characterName || shorten(smartCharacter.address, 8)}
        </>
      </Button>
      {!disableMenu && (
        <Menu
          anchorEl={menuAnchor.current}
          open={showMenu}
          onClose={() => {
            setShowMenu(false);
          }}
          MenuListProps={{
            "aria-labelledby": "user-menu-button",
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            component={NavLink}
            to={`/explore/characters/${smartCharacter.address}`}
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <ListItemIcon>
              <CharacterPageIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Character page</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              copyAddress();
              setShowMenu(false);
            }}
          >
            <ListItemIcon>
              <CopyIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>{shorten(smartCharacter.address, 10)}</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              disconnect();
            }}
          >
            <ListItemIcon>
              <DisconnectIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Disconnect</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};
export default React.memo(UserButton);
