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
  orderBy?: string;
  rels?: Record<string, SelectRelation>;
};
