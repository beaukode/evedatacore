import { z } from "zod";
import { EndpointsFactory, ResultHandler, ensureHttpError, getMessageFromError } from "express-zod-api";
import { middlewareServices } from "../middlewares";

const resultHandler = new ResultHandler({
  positive: (data) => ({
    schema: data,
    mimeType: "application/json", // optinal or array
  }),
  negative: z.object({ message: z.string() }),
  handler: ({ error, output, response }) => {
    if (error) {
      const { statusCode } = ensureHttpError(error);
      const message = getMessageFromError(error);
      return void response.status(statusCode).json({ message });
    }
    response.status(200).json(output);
  },
});

export const endpointsFactory = new EndpointsFactory(resultHandler).addMiddleware(middlewareServices);
