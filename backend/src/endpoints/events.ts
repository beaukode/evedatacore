import { z } from "zod";
import { isbot } from "isbot";
import { v4 as uuidv4 } from "uuid";
import { endpointsFactory } from "./factories";

export const events = endpointsFactory.build({
  method: "post",
  input: z.object({
    events: z.record(z.string(), z.number()),
  }),
  output: z.object({}),
  handler: async ({ input: { events }, options: { request, responseHeaders, db } }) => {
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

      // Database updates
      const day = now.toISOString().substring(0, 10);
      const updatePromises: Promise<unknown>[] = [];
      let totalEventsCount = 0;
      for (const [key, count] of Object.entries(events)) {
        updatePromises.push(db.events.incrementEvent(key, day, uid, count));
        totalEventsCount += count;
      }
      updatePromises.push(db.visitors.incrementEvents(day, uid, totalEventsCount));

      await Promise.all(updatePromises);
    } catch (e) {
      // This endpoint log errors silently
      console.error(e);
    }
    return {};
  },
});
