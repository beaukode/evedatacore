import React from "react";
import {
  Avatar,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Hex } from "viem";
import { useDisconnect } from "wagmi";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import UnknwonUserIcon from "@mui/icons-material/QuestionMark";
import DisconnectIcon from "@mui/icons-material/PowerOff";
import CharacterPageIcon from "@mui/icons-material/Person";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { shorten } from "@/tools";
import { useMudWeb3 } from "@/contexts/AppContext";

interface UserButtonProps {
  address: Hex;
}

const UserButton: React.FC<UserButtonProps> = ({ address }) => {
  const menuAnchor = React.useRef<HTMLButtonElement | null>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const { disconnect } = useDisconnect();

  const mudWeb3 = useMudWeb3();

  const copyAddress = React.useCallback(() => {
    navigator.clipboard.writeText(address).catch((e) => {
      console.error("Fail to copying content", e);
    });
  }, [address]);

  const userNameQuery = useQuery({
    queryKey: ["User", address],
    queryFn: () =>
      mudWeb3.characterGetId({ ownerAddress: address }).then((id) => {
        if (!id) return null;
        return mudWeb3
          .assemblyGetMetadata({ assemblyId: id })
          .then((metadata) => metadata.name || null);
      }),
  });

  return (
    <>
      <Button
        ref={menuAnchor}
        id="user-menu-button"
        onClick={() => {
          setShowMenu(true);
        }}
        sx={{
          paddingRight: 1,
        }}
        variant="outlined"
        endIcon={
          userNameQuery.data ? (
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
        <>{userNameQuery.data || shorten(address, 8)}</>
      </Button>
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
          to={`/explore/characters/${address}`}
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
          <ListItemText>{shorten(address, 10)}</ListItemText>
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
    </>
  );
};
export default React.memo(UserButton);
