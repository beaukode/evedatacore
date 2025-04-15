import React from "react";
import { TextField, TableCell } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { filterInProps, ldapToDateTime } from "@/tools";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";

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
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Killmails"],
    queryFn: async () => mudSql.listKillmails(),
  });

  const killmails = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "killerName",
      "victimName",
      "killerAddress",
      "victimAddress",
      "killerId",
      "victimId",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, km: (typeof killmails)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={km.id}>
          <TableCell>{ldapToDateTime(km.timestamp)}</TableCell>
          <TableCell>
            <ButtonCharacter
              name={km.killerName}
              address={km.killerAddress}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              name={km.victimName}
              address={km.victimAddress}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>{km.lossType}</TableCell>
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
      <DataTableLayout
        title="Killmails"
        columns={columns}
        data={killmails}
        itemContent={itemContent}
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
