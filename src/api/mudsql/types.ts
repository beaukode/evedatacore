export type MudSqlClientConfig = {
  worldAddress: string;
  indexerBaseUrl: string;
};

export type SelectRelation = {
  ns: string;
  table: string;
  field: string;
  fkNs: string;
  fkTable: string;
  fkField: string;
};

export type SelectOptions = {
  where?: string;
  orderBy?: string | string[];
  rels?: Record<string, SelectRelation>;
  tableType?: TableType;
};

export type TableType = "table" | "offchainTable";
