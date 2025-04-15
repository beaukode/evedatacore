import React from "react";
import {
  Alert,
  Button,
  Typography,
  List,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import InteractIcon from "@mui/icons-material/Settings";
import { useQuery } from "@tanstack/react-query";
import { useMudSql, useMudWeb3 } from "@/contexts/AppContext";
import BasicListItem from "@/components/ui/BasicListItem";
import ExternalLink from "@/components/ui/ExternalLink";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { Helmet } from "react-helmet";

interface CorporationDetailsProps {
  characterId: bigint;
  corporationId: bigint;
}

const CorporationDetails: React.FC<CorporationDetailsProps> = ({
  characterId,
  corporationId,
}) => {
  const mudSql = useMudSql();
  const mudWeb3 = useMudWeb3();

  const corporation = useQuery({
    queryKey: ["Corporation", corporationId.toString()],
    queryFn: () =>
      Promise.all([
        mudWeb3.corporationIsClaimValid({ corpId: corporationId }),
        mudWeb3.corporationGetMetadata({ corpId: corporationId }),
      ]).then(([isClaimValid, metadata]) =>
        metadata && isClaimValid
          ? {
              isClaimValid,
              ...metadata,
            }
          : undefined
      ),
  });

  const data = corporation.data;

  const title = corporation.data
    ? `[${corporation.data.ticker}] ${corporation.data.name}`
    : `Corporation #${corporationId.toString()}`;

  const titleAdornment =
    data?.CEO === characterId ? (
      <Button
        color="warning"
        variant="contained"
        size="small"
        startIcon={<InteractIcon />}
      >
        Manage
      </Button>
    ) : undefined;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {!data && (
        <PaperLevel1 title={title} loading={corporation.isLoading}>
          <Alert severity="info">
            Your corporation (ID: 1000167) has not been claimed. If you are the
            CEO, please claim it to have it recorded on the blockchain.
            <br />
            <br />
            If you are not the CEO, please ask your CEO to claim the
            corporation.
          </Alert>
        </PaperLevel1>
      )}
      {data && (
        <>
          <PaperLevel1 title={title} titleAdornment={titleAdornment}>
            <Typography variant="body1" textAlign="justify">
              {data.description}
            </Typography>
            <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
              <BasicListItem title="CEO">{data.CEO.toString()}</BasicListItem>
              {data.homepage.startsWith("https://") && (
                <BasicListItem title="Homepage" disableGutters>
                  <ExternalLink title={title} href={data.homepage} />
                </BasicListItem>
              )}
            </List>
            <Alert severity="info">
              If the CEO is not correct, the legit CEO can:
              <ol>
                <li>
                  Ask the player who claimed to transfer ownership using the
                  manage button on this page.
                </li>
                <li>
                  Kick the current CEO out, then you will be able to claim
                  again.
                </li>
              </ol>
            </Alert>
          </PaperLevel1>
          <PaperLevel1 title="Members">
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </PaperLevel1>
        </>
      )}
    </>
  );
};

export default CorporationDetails;
