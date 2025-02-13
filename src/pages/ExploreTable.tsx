import React from "react";
import { Helmet } from "react-helmet";
import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  TableCell,
  TextField,
} from "@mui/material";
import { isHex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import DataTable from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import { pick } from "lodash-es";
import ConditionalMount from "@/components/ui/ConditionalMount";
import DialogTableRecord from "@/components/dialogs/DialogTableRecord";
import ButtonWeb3Interaction from "@/components/buttons/ButtonWeb3Interaction";

const ExploreTable: React.FC = () => {
  const { id } = useParams();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editKey, setEditKey] = React.useState<Record<string, string>>();
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });
  const mudSql = useMudSql();

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
    queryFn: async () => mudSql.getTable(id ?? "0x"),
    enabled: !!id,
  });

  const queryRecords = useQuery({
    queryKey: ["TableRecords", id],
    queryFn: async () => {
      if (!(table && query.data)) {
        return [];
      }
      return mudSql.selectFrom(table.namespace, table.name, {
        orderBy: [...query.data.key],
        tableType: query.data.type,
      });
    },
    enabled: !!query.data,
    retry: false,
  });

  const handleEditClick = React.useCallback((keys?: Record<string, string>) => {
    setEditOpen(true);
    setEditKey(keys);
  }, []);

  const columnsLabels = React.useMemo(() => {
    if (!query.data) return [];
    const columnsLabels = Object.entries(query.data.schema).map(
      ([key, { type }]) => ({
        label: `${key} (${type})`,
      })
    );
    return [
      {
        sx: { p: 0 },
        label: (
          <ButtonWeb3Interaction
            icon="add"
            title="Create table record"
            onClick={() => handleEditClick()}
          />
        ),
      },
      ...columnsLabels,
    ];
  }, [handleEditClick, query.data]);

  const columnsKeys = React.useMemo(() => {
    if (!query.data) return [];
    return Object.keys(query.data.schema);
  }, [query.data]);

  const tableKeys = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.key;
  }, [query.data]);

  const columnsTypes = React.useMemo(() => {
    if (!query.data) return {};
    return Object.entries(query.data.schema).reduce(
      (acc, [k, { type }]) => {
        return { ...acc, [k]: type };
      },
      {} as Record<string, string>
    );
  }, [query.data]);

  const records = React.useMemo(() => {
    if (!queryRecords.data) return [];
    return filterInProps(queryRecords.data, debouncedSearch.text, columnsKeys);
  }, [queryRecords.data, columnsKeys, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (idx: number, item: Record<string, string>) => {
      const key = tableKeys.map((k) => item[k]).join("|") || idx.toString();
      return (
        <React.Fragment key={key}>
          <TableCell sx={{ p: 0 }}>
            <ButtonWeb3Interaction
              icon="edit"
              title="Edit table record"
              onClick={() => handleEditClick(pick(item, tableKeys))}
            />
          </TableCell>
          {columnsKeys.map((k, i) => (
            <TableCell key={i} sx={{ fontFamily: "monospace" }}>
              {columnsTypes[k] === "bool"
                ? item[k]
                  ? "true"
                  : "false"
                : item[k]}
            </TableCell>
          ))}
        </React.Fragment>
      );
    },
    [tableKeys, columnsKeys, columnsTypes, handleEditClick]
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
      <PaperLevel1 title={title} loading={query.isFetching} backButton>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <ListItem disableGutters>
            <ListItemText>Id: {table.resourceId}</ListItemText>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText sx={{ my: 0 }}>
              Namespace:{" "}
              <ButtonNamespace id={namespaceId} name={table.namespace} />
            </ListItemText>
          </ListItem>
          {data && (
            <>
              <ListItem disableGutters>
                <ListItemText sx={{ my: 0 }}>
                  Owner:{" "}
                  {data.namespaceOwnerName ? (
                    <ButtonCharacter
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
        sx={{
          flexGrow: 1,
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box mb={2}>
          <TextField
            label="Search"
            value={search.text}
            onChange={(e) => {
              setSearch(
                "text",
                e.currentTarget.value.substring(0, 255).toLowerCase()
              );
            }}
            fullWidth
          />
          {queryRecords.isError && (
            <Alert severity="error">{queryRecords.error.message}</Alert>
          )}
        </Box>
        {data && (
          <>
            <ConditionalMount mount={editOpen} keepMounted>
              <DialogTableRecord
                open={editOpen}
                title={editKey ? "Edit table record" : "Create table record"}
                table={data}
                keyValues={editKey}
                owner={data?.namespaceOwner || "0x"}
                onClose={() => {
                  setEditOpen(false);
                  queryRecords.refetch();
                }}
              />
            </ConditionalMount>
            <Box flexGrow={1} overflow="auto">
              <DataTable
                data={records}
                columns={columnsLabels}
                itemContent={itemContent}
                dynamicWidth
                rememberScroll
              />
            </Box>
          </>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default ExploreTable;
