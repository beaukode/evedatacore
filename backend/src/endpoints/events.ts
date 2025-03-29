import { z } from "zod";
import { isbot } from "isbot";
import { v4 as uuidv4 } from "uuid";
import { endpointsFactory } from "./factories";
import { EventEntity } from "../db/schema/TableEvents";
import { $add, $set, UpdateItemCommand } from "dynamodb-toolbox";

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
  handler: async ({ input: { events }, options: { request, responseHeaders } }) => {
    try {
      const userAgent = request.headers["user-agent"];
      if (isbot(userAgent)) {
        console.log("Bot detected", userAgent);
        return {};
      }
      const cookies = request.cookies || {};
      let uid = cookies.uid;
      const now = new Date();
      if (!uid) {
        const expirationDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        uid = uuidv4();
        responseHeaders.set(
          "Set-Cookie",
          `uid=${uid}; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`,
        );
      }
      await Promise.all(
        events.map((event) => {
          const day = now.toISOString().substring(0, 10);
          return EventEntity.build(UpdateItemCommand)
            .item({
              key: event.key,
              day,
              count: $add(1),
              visitors: $set({ [uid]: 1 }),
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
