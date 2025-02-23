import React from "react";
import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import DataTable, {
  DataTableColumn,
  DataTableItemContentCallback,
} from "../DataTable";

interface DataTableLayoutProps<T extends Record<string, unknown>> {
  title: string;
  columns: DataTableColumn[];
  loading?: boolean;
  data: T[];
  itemContent: DataTableItemContentCallback<T>;
  children?: React.ReactNode;
}

const DataTableLayout = <T extends Record<string, unknown>>({
  title,
  columns,
  loading,
  data,
  itemContent,
  children,
}: DataTableLayoutProps<T>) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          m: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Box display="flex" alignItems="flex-end">
          <Box display="flex" flexGrow="1">
            {children}
          </Box>
          <Box textAlign="right" ml={2}>
            <Typography variant="caption" color="textPrimary">
              {data.length} {title}
            </Typography>
          </Box>
        </Box>
        <Box mt={2}>
          <LinearProgress sx={{ visibility: loading ? "visible" : "hidden" }} />
        </Box>
        <Box flexGrow={1} flexBasis={100} overflow="hidden">
          <DataTable
            data={data}
            columns={columns}
            itemContent={itemContent}
            rememberScroll
          />
        </Box>
      </Paper>
    </>
  );
};

export default DataTableLayout;
