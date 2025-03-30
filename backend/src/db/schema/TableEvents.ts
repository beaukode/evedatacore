import { Entity, item, number, string, record, Table } from "dynamodb-toolbox";
import { documentClient } from "./client";

export const TableEvents = new Table({
  name: `evedatacore-${process.env.ENV}-events`,
  documentClient,
  partitionKey: { name: "key", type: "string" },
  sortKey: { name: "day", type: "string" },
  indexes: {
    dayIndex: {
      type: "global",
      partitionKey: { name: "day", type: "string" },
      sortKey: { name: "key", type: "string" },
    },
  },
});

export const EventEntity = new Entity({
  name: "Event",
  table: TableEvents,
  schema: item({
    key: string().key(),
    day: string().key(),
    count: number().default(0),
    visitors: record(string(), number()).default({}),
  }),
  timestamps: false,
});
