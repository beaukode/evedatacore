import { z } from "zod";
import { isbot } from "isbot";
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
  handler: async ({ input: { events }, options: { request } }) => {
    try {
      const userAgent = request.headers["user-agent"];
      if (isbot(userAgent)) {
        console.log("Bot detected", userAgent);
        return {};
      }
      await Promise.all(
        events.map((event) => {
          const day = new Date(event.ts).toISOString().substring(0, 10);
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
      // This endpoint log errors silently
      console.error(e);
    }
    return {};
  },
});
