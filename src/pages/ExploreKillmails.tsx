import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell } from "@mui/material";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { filterInProps, tsToDateTime } from "@/tools";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { getKills } from "@/api/evedatacore-v2";

const columns: DataTableColumn[] = [
  { label: "Date", width: columnWidths.datetime },
  { label: "Killer", width: columnWidths.common },
  { label: "Victim", width: columnWidths.common },
  { label: "Loss Type", width: columnWidths.common / 2 },
  { label: "Solar System", width: columnWidths.common / 2 },
];

const ExploreKillmails: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const query = usePaginatedQuery({
    queryKey: ["Kills"],
    queryFn: async ({ pageParam }) => {
      const r = await getKills({
        query: {
          startKey: pageParam,
        },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  const killmails = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "killerName",
      "victimName",
      "killerAccount",
      "victimAccount",
      "killerId",
      "victimId",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, km: (typeof killmails)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={km.id}>
          <TableCell>{tsToDateTime(km.killedAt)}</TableCell>
          <TableCell>
            <ButtonCharacter
              name={km.killerName}
              address={km.killerAccount}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              name={km.victimName}
              address={km.victimAccount}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>{km.lossType === 0 ? "Ship" : "(Unknown)"}</TableCell>
          <TableCell>
            <ButtonSolarsystem
              solarSystemId={km.solarSystemId}
              fastRender={context.isScrolling}
            />
          </TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Killmails</title>
      </Helmet>
      <DataTableLayout
        title="Killmails"
        columns={columns}
        data={killmails}
        itemContent={itemContent}
        loading={query.isFetching}
      >
        <TextField
          label="Search"
          value={search.text}
          onChange={(e) =>
            setSearch(
              "text",
              e.currentTarget.value.substring(0, 255).toLowerCase()
            )
          }
          fullWidth
        />
      </DataTableLayout>
    </>
  );
};

export default ExploreKillmails;
