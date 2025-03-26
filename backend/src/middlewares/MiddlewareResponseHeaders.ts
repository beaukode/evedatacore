import { Middleware } from "express-zod-api";

export class ResponseHeadersContainer extends Headers {
  constructor() {
    super();
  }

  setCache(value: number) {
    this.set("Cache-Control", `max-age=${value}`);
  }
}

export const middlewareResponseHeaders = new Middleware({
  handler: async () => {
    return { responseHeaders: new ResponseHeadersContainer() };
  },
});
