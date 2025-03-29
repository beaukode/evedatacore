import { Middleware } from "express-zod-api";

export const middlewareRequest = new Middleware({
  handler: async ({ request }) => {
    return { request };
  },
});
