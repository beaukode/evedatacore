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
import { AbiType, Table } from "@latticexyz/config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import { DataTableColumn } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { pick } from "lodash-es";
import ConditionalMount from "@/components/ui/ConditionalMount";
import DialogTableRecord from "@/components/dialogs/DialogTableRecord";
import ButtonWeb3Interaction from "@/components/buttons/ButtonWeb3Interaction";
import { AbiTypeDetails, parseAbiType } from "@/tools/abi";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { getTableIdRecords, getTableId } from "@/api/evedatacore-v2";

const ExploreTable: React.FC = () => {
  const { id } = useParams();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editKey, setEditKey] = React.useState<Record<string, string>>();
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

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
    queryFn: async () =>
      getTableId({ path: { id: id ?? "" } }).then((r) => r.data),
    enabled: !!id,
  });

  const queryRecords = usePaginatedQuery({
    queryKey: ["TableRecords", id],
    queryFn: async ({ pageParam }) => {
      const r = await getTableIdRecords({
        path: { id: id ?? "" },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    enabled: !!query.data && !!id,
  });

  const handleEditClick = React.useCallback((keys?: Record<string, string>) => {
    setEditOpen(true);
    setEditKey(keys);
  }, []);

  const { columnsLabels, columnsKeys, tableKeys, columnsTypes } =
    React.useMemo(() => {
      if (!query.data)
        return {
          columnsLabels: [],
          columnsKeys: [],
          tableKeys: [],
          columnsTypes: undefined,
        };
      const columnsLabels: DataTableColumn[] = [];
      const columnsKeys: string[] = [];
      const tableKeys: string[] = [];
      const columnsTypes: Record<string, AbiTypeDetails> = {};

      columnsLabels.push({
        sx: { p: 0 },
        label: (
          <ButtonWeb3Interaction
            icon="add"
            title="Create table record"
            onClick={() => handleEditClick()}
          />
        ),
      });

      for (const [key, { type }] of Object.entries(query.data.schema)) {
        columnsLabels.push({
          label: `${key} (${type})`,
        });
        columnsKeys.push(key);
        columnsTypes[key] = parseAbiType(type as AbiType);
      }
      tableKeys.push(...query.data.key);

      return { columnsLabels, columnsKeys, tableKeys, columnsTypes };
    }, [query.data, handleEditClick]);

  const records = React.useMemo(() => {
    if (!queryRecords.data || !columnsTypes) return;
    return queryRecords.data.map((record) => {
      return Object.entries(record).reduce(
        (acc, [key, value]) => {
          const columnType = columnsTypes[key];
          if (columnType?.baseType === "bool") {
            if (Array.isArray(value)) {
              acc[key] = value.map((v) => (v ? "true" : "false")).join(";");
            } else {
              acc[key] = value ? "true" : "false";
            }
          } else if (columnType?.baseType === "string") {
            if (Array.isArray(value)) {
              acc[key] = value
                .map((v) => v.replace(/\r\n|\r|\n/g, "\\n"))
                .join(";");
            } else {
              acc[key] = String(value).replace(/\r\n|\r|\n/g, "\\n");
            }
          } else if (columnType?.baseType === "bytes" && columnType?.length) {
            // The api add some padding to the bytes
            const length = columnType.length * 2 + 2;
            if (Array.isArray(value)) {
              acc[key] = value.map((v) => v.substring(0, length)).join(";");
            } else {
              acc[key] = String(value).substring(0, length);
            }
          } else {
            if (Array.isArray(value)) {
              acc[key] = value.join(";");
            } else {
              acc[key] = String(value);
            }
          }
          return acc;
        },
        {} as Record<string, string>
      );
    });
  }, [queryRecords.data, columnsTypes]);

  const filteredRecords = React.useMemo(() => {
    if (!records) return [];
    return filterInProps(records, debouncedSearch.text, columnsKeys);
  }, [records, columnsKeys, debouncedSearch.text]);

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
              {item[k]}
            </TableCell>
          ))}
        </React.Fragment>
      );
    },
    [tableKeys, columnsKeys, handleEditClick]
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
      <PaperLevel1
        sx={{ mb: 0 }}
        title={title}
        loading={query.isFetching}
        backButton
      >
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
                  {data.ownerName ? (
                    <ButtonCharacter
                      address={data.account}
                      name={data.ownerName}
                    />
                  ) : (
                    data.account
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
      <DataTableLayout
        title="Records"
        data={filteredRecords}
        columns={columnsLabels}
        itemContent={itemContent}
        loading={queryRecords.isFetching}
        sx={{ mx: 0 }}
        dynamicWidth
      >
        {queryRecords.isError ? (
          <Alert severity="error">{queryRecords.error.message}</Alert>
        ) : (
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
        )}
      </DataTableLayout>
      {data && (
        <ConditionalMount mount={editOpen} keepMounted>
          <DialogTableRecord
            open={editOpen}
            table={data as unknown as Table}
            keyValues={editKey}
            owner={data?.account || "0x"}
            onClose={() => {
              setEditOpen(false);
              queryRecords.refetch();
            }}
          />
        </ConditionalMount>
      )}
    </Box>
  );
};

export default ExploreTable;
