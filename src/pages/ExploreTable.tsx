import React from "react";
import { Helmet } from "react-helmet";
import { Box, List, ListItem, ListItemText, TableCell } from "@mui/material";
import { isHex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Error404 from "./Error404";
import { getTable } from "@/api/mudsql/queries";
import DisplayOwner from "@/components/DisplayOwner";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import DisplayNamespace from "@/components/DisplayNamespace";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import { client } from "@/api/mudsql";
import DataTable from "@/components/DataTable";

const ExploreTable: React.FC = () => {
  const { id } = useParams();

  const table = isHex(id) ? hexToResource(id) : undefined;
  const namespaceId = table
    ? resourceToHex({
        type: "namespace",
        namespace: table.namespace,
        name: "",
      })
    : undefined;

  const query = useQuery({
    queryKey: ["Table", id],
    queryFn: async () => getTable(id ?? "0x"),
    enabled: !!id,
  });

  const queryRecords = useQuery({
    queryKey: ["TableRecords", id],
    queryFn: async () => {
      if (!(table && query.data)) {
        return [];
      }
      return client.selectFrom(table.namespace, table.name, {
        orderBy: [...query.data.key],
      });
    },
    enabled: !!query.data,
    retry: false,
  });

  const columnsLabels = React.useMemo(() => {
    if (!query.data) return [];
    return Object.entries(query.data.schema).map(
      ([key, { type }]) => `${key} (${type})`
    );
  }, [query.data]);

  const columnsKeys = React.useMemo(() => {
    if (!query.data) return [];
    return Object.keys(query.data.schema);
  }, [query.data]);

  const tableKeys = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.key;
  }, [query.data]);

  const itemContent = React.useCallback(
    (idx: number, item: Record<string, string>) => {
      const key = tableKeys.map((k) => item[k]).join("|") || idx.toString();
      return (
        <React.Fragment key={key}>
          {columnsKeys.map((k, i) => (
            <TableCell key={i}>{item[k]}</TableCell>
          ))}
        </React.Fragment>
      );
    },
    [tableKeys, columnsKeys]
  );

  if (!id || !table || !namespaceId || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title = `${table.name} [${table.namespace}]`;

  return (
    <Box
      p={2}
      flexGrow={1}
      overflow="auto"
      display={"flex"}
      flexDirection={"column"}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1 title={title} loading={query.isFetching} backButton mudChip>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <ListItem disableGutters>
            <ListItemText>Id: {table.resourceId}</ListItemText>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText sx={{ my: 0 }}>
              Namespace:{" "}
              <DisplayNamespace id={namespaceId} name={table.namespace} />
            </ListItemText>
          </ListItem>
          {data && (
            <>
              <ListItem disableGutters>
                <ListItemText sx={{ my: 0 }}>
                  Owner:{" "}
                  {data.namespaceOwnerName ? (
                    <DisplayOwner
                      address={data.namespaceOwner}
                      name={data.namespaceOwnerName}
                    />
                  ) : (
                    data.namespaceOwner
                  )}
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText sx={{ my: 0 }}>
                  Fields: <DisplayTableFieldsChips table={data} />
                </ListItemText>
              </ListItem>
            </>
          )}
        </List>
      </PaperLevel1>
      <PaperLevel1
        title={`${queryRecords.data?.length || ""} Records`}
        loading={queryRecords.isFetching}
        sx={{ flexGrow: 1, minHeight: "50vh" }}
        mudChip
      >
        {data && (
          <DataTable
            data={queryRecords.data || []}
            columns={columnsLabels}
            itemContent={itemContent}
            dynamicWidth
            rememberScroll
          />
        )}
      </PaperLevel1>
    </Box>
  );
};

export default ExploreTable;
