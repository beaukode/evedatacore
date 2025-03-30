import { Entity, item, number, string, Table } from "dynamodb-toolbox";
import { documentClient } from "./client";

export const TableVisitors = new Table({
  name: "evedatacore-main-visitors",
  documentClient,
  partitionKey: { name: "uid", type: "string" },
  sortKey: { name: "day", type: "string" },
});

export const VisitorEntity = new Entity({
  name: "Visitor",
  table: TableVisitors,
  schema: item({
    uid: string().key(),
    day: string().key(),
    eventsCount: number().default(0),
  }),
  timestamps: false,
});
