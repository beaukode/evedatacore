import React from "react";
import { Box, IconButton } from "@mui/material";
import ReloadIcon from "@mui/icons-material/Cached";
import { useParams, useSearchParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSmartCharacter } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import Error404 from "@/pages/Error404";
import { getAssemblyId } from "@/api/evedatacore-v2";
import { shorten } from "@/tools";
import Owner from "./components/Owner";
import Inventory from "./components/Inventory";

const Main: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const enableBackButton = searchParams.get("back") === "true";
  const smartCharacter = useSmartCharacter();
  const smartCharacterId = smartCharacter.isConnected
    ? smartCharacter.characterId?.toString()
    : undefined;

  const query = useQuery({
    queryKey: ["SsuDapp", "SmartStorage", id],
    queryFn: async () => {
      if (!id) return null;
      const r = await getAssemblyId({ path: { id } });
      if (!r.data || r.data.assemblyType !== "storage") return null;
      return r.data;
    },
    enabled: !!id,
  });

  const ssu = query.data;

  if (!ssu && !query.isLoading) return <Error404 hideBackButton />;
  let title = ssu?.name || shorten(ssu?.id) || "...";
  if (ssu) {
    title = `${title} in ${ssu.solarSystemName}`;
  }

  return (
    <Box m={2}>
      <PaperLevel1
        title={title}
        loading={query.isLoading}
        sx={{ p: 0 }}
        backButton={enableBackButton}
        titleAdornment={
          <IconButton
            color="primary"
            onClick={async () => {
              await queryClient.resetQueries({
                queryKey: ["SsuDapp", "SmartStorage", id],
              });
              await queryClient.invalidateQueries({
                queryKey: ["SsuDapp", "SmartStorage", id],
              });
            }}
            disabled={query.isFetching}
          >
            <ReloadIcon />
          </IconButton>
        }
      >
        {ssu && (
          <>
            {ssu.ownerId === smartCharacterId ? (
              <Owner ssu={ssu} />
            ) : (
              <Inventory ssu={ssu} />
            )}
          </>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default Main;
