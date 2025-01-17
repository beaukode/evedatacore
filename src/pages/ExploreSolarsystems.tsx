import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell, Button } from "@mui/material";
import { NavLink } from "react-router";
import useQuerySearch from "@/tools/useQuerySearch";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import DataTableLayout from "@/components/layouts/DataTableLayout";

const columns = ["Name", "Id"];

const ExploreSolarsystems: React.FC = () => {
  const ssIndex = useSolarSystemsIndex();

  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const solarsystems = React.useMemo(() => {
    if (!ssIndex) return [];
    const ss = ssIndex.getById(debouncedSearch.text);
    if (ss) {
      return [ss];
    }
    return ssIndex.searchByName(debouncedSearch.text);
  }, [debouncedSearch.text, ssIndex]);

  const itemContent = React.useCallback(
    (_: number, ss: (typeof solarsystems)[number]) => {
      return (
        <React.Fragment key={ss.solarSystemId}>
          <TableCell>
            <Button
              component={NavLink}
              to={`/explore/solarsystems/${ss.solarSystemId}`}
            >
              {ss.solarSystemName}
            </Button>
          </TableCell>
          <TableCell>{ss.solarSystemId}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Solar systems</title>
      </Helmet>
      <DataTableLayout
        title="Solar systems"
        columns={columns}
        loading={!ssIndex}
        data={solarsystems || []}
        itemContent={itemContent}
      >
        <TextField
          label="Search"
          value={search.text}
          onChange={(e) => {
            setSearch(
              "text",
              e.currentTarget.value.substring(0, 255).toLowerCase()
            );
          }}
        />
      </DataTableLayout>
    </>
  );
};

export default ExploreSolarsystems;
