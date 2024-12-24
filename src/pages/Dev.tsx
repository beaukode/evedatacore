import React from "react";
import { Helmet } from "react-helmet";
import { Paper } from "@mui/material";
import { setupZustand } from "../mud/setupZustand";
import { setupSqlIndexer } from "../mud/setupSqlIndexer";
import { useMudSqlIndexer } from "../mud/MudContext";

const DevZustand: React.FC<{ i: Awaited<ReturnType<typeof setupZustand>> }> = ({
  i: { useStore, tables },
}) => {
  const records = useStore((state) => {
    console.log("state", state);
    return Object.values(state.getRecords(tables.Tables));
  });

  console.log("records", records);

  return (
    <>
      <Helmet>
        <title>Dev</title>
      </Helmet>
      <Paper elevation={1} sx={{ m: 2 }}>
        <h1>{records.length}</h1>
        {records.map((record) => (
          <pre
            key={record.id}
            style={{ width: "100%", maxHeight: "50vh", overflow: "auto" }}
          >
            {JSON.stringify(record, null, 2)}
          </pre>
        ))}
      </Paper>
    </>
  );
};

const DevStash: React.FC<{
  i: Awaited<ReturnType<typeof setupSqlIndexer>>;
}> = ({ i }) => {
  return (
    <>
      <Helmet>
        <title>Dev</title>
      </Helmet>
      <Paper elevation={1} sx={{ m: 2 }}></Paper>
    </>
  );
};

const Dev: React.FC = () => {
  const { listNamespaces } = useMudSqlIndexer();

  const hasRun = React.useRef(false);
  React.useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      listNamespaces({
        owners: "0xf1e4a908467eb94c6eb9ccd3a4659684ebd360d1",
      }).then(console.debug);
    }
  }, [listNamespaces]);
};

export default Dev;
