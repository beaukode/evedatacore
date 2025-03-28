import { z } from "zod";
import { endpointsFactory } from "./factories";
import { EventEntity } from "../db/schema/TableEvents";
import { $add, UpdateItemCommand } from "dynamodb-toolbox";

export const events = endpointsFactory.build({
  method: "post",
  input: z.object({
    events: z.array(
      z.object({
        key: z.string(),
        ts: z.number(),
      }),
    ),
  }),
  output: z.object({}),
  handler: async ({ input: { events } }) => {
    try {
      await Promise.all(
        events.map((event) => {
          const day = new Date(event.ts * 1000).toISOString().substring(0, 10);
          return EventEntity.build(UpdateItemCommand)
            .item({
              key: event.key,
              day,
              count: $add(1),
            })
            .send();
        }),
      );
    } catch (e) {
      console.error(e);
    }
    return {};
  },
});
