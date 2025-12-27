import React from "react";
import { Helmet } from "react-helmet";
import { Box, List, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { startCase } from "lodash-es";
import { getConfig } from "@/api/stillness";
import ListItemLink from "@/components/ui/ListItemLink";
import BasicListItem from "@/components/ui/BasicListItem";
import PaperLevel1 from "@/components/ui/PaperLevel1";

const ExploreConfig: React.FC = () => {
  const query = useQuery({
    queryKey: ["Config"],
    queryFn: async () => await getConfig().then((r) => r.data.pop()),
  });

  const data = query.data;
  return (
    <Box
      p={2}
      flexGrow={1}
      overflow="auto"
      display={"flex"}
      flexDirection={"column"}
    >
      <Helmet>
        <title>Config</title>
      </Helmet>
      <PaperLevel1
        title={data?.name || "..."}
        loading={query.isFetching}
        backButton
      >
        {data && (
          <Box>
            <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
              <BasicListItem title="Chain Id">{data.chainId}</BasicListItem>
              <BasicListItem title="Native Currency">
                {data.nativeCurrency?.name} [{data.nativeCurrency?.symbol}]{" "}
                {data.nativeCurrency?.decimals} decimals
              </BasicListItem>
              <BasicListItem title="Fuel type" disableGutters>
                <Button
                  variant="outlined"
                  component={NavLink}
                  to={`/explore/types/${data.itemTypeIDs?.fuel}`}
                >
                  {data.itemTypeIDs?.fuel}
                </Button>
              </BasicListItem>
              <ListItemLink
                title="Block Explorer"
                href={data.blockExplorerUrl}
              />
              <ListItemLink title="Metadata Api" href={data.metadataApiUrl} />
              <ListItemLink title="Ipfs" href={data.ipfsApiUrl} />
              <ListItemLink title="Indexer" href={data.indexerUrl} />
              <ListItemLink title="Wallet Api" href={data.walletApiUrl} />
              <ListItemLink title="Vault Dapp" href={data.vaultDappUrl} />
              <ListItemLink title="Base Dapp" href={data.baseDappUrl} />
            </List>
          </Box>
        )}
      </PaperLevel1>
      <PaperLevel1 title="Rpc" loading={query.isFetching}>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          {data &&
            Object.entries(data.rpcUrls || {}).map(([key, value]) => (
              <React.Fragment key={key}>
                <ListItemLink
                  title={startCase(`${key} Http`)}
                  href={value.http}
                />
                <ListItemLink
                  title={startCase(`${key} WebSocket`)}
                  href={value.webSocket}
                />
              </React.Fragment>
            ))}
        </List>
      </PaperLevel1>
      <PaperLevel1 title="Contracts" loading={query.isFetching}>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          {data &&
            Object.entries(data.contracts || {}).map(([key, value]) => {
              return typeof value === "string" ? (
                <BasicListItem title={startCase(key)} key={key}>
                  {value}
                </BasicListItem>
              ) : (
                <BasicListItem title={startCase(key)} key={key}>
                  {value.address}
                </BasicListItem>
              );
            })}
        </List>
      </PaperLevel1>
      <PaperLevel1 title="Systems" loading={query.isFetching}>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          {data &&
            Object.entries(data.systems || {}).map(([key, value]) => (
              <BasicListItem title={startCase(key)} key={key}>
                {value}
              </BasicListItem>
            ))}
        </List>
      </PaperLevel1>
    </Box>
  );
};

export default ExploreConfig;
