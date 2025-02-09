import React from "react";
import { Avatar, Button } from "@mui/material";
import UnknwonUserIcon from "@mui/icons-material/QuestionMark";
import { useQuery } from "@tanstack/react-query";
import { Hex } from "viem";
import { useDisconnect } from "wagmi";
import { shorten } from "@/tools";
import { useMudWeb3 } from "@/contexts/AppContext";

interface UserButtonProps {
  address: Hex;
}

const UserButton: React.FC<UserButtonProps> = ({ address }) => {
  const { disconnect } = useDisconnect();
  const mudWeb3 = useMudWeb3();

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

  React.useEffect(() => {
    console.log("UserButton rendered", address);
  }, [address, mudWeb3]);

  return (
    <Button
      onClick={() => {
        disconnect();
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
            src="https://images.dev.quasar.reitnorf.com/Character/123456789_256.jpg"
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
  );
};
export default React.memo(UserButton);
