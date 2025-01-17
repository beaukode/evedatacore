export type MudSqlClientConfig = {
  worldAddress: string;
  indexerBaseUrl: string;
};

export type SelectRelation = {
  ns: string;
  table: string;
  tableType?: TableType;
  field: string;
  fkNs: string;
  fkTable: string;
  fkTableType?: TableType;
  fkField: string;
};

export type SelectOptions = {
  where?: string;
  orderBy?: string | string[];
  orderDirection?: "ASC" | "DESC";
  rels?: Record<string, SelectRelation>;
  tableType?: TableType;
};

export type TableType = "table" | "offchainTable";
