import { z } from "zod";
import { EndpointsFactory, ResultHandler, ensureHttpError, getMessageFromError } from "express-zod-api";
import { createDb } from "../db";
import {
  middlewareServices,
  middlewareResponseHeaders,
  ResponseHeadersContainer,
  middlewareRequest,
  middlewareMetrics,
  MetricsCollector,
} from "../middlewares";

const resultHandler = new ResultHandler({
  positive: (data) => ({
    schema: data,
    mimeType: "application/json", // optinal or array
  }),
  negative: z.object({ message: z.string() }),
  handler: ({ error, output, response, options }) => {
    if ("metrics" in options && options.metrics instanceof MetricsCollector) {
      options.metrics.flush();
    }
    if (error) {
      const { statusCode } = ensureHttpError(error);
      const message = getMessageFromError(error);
      return void response.status(statusCode).json({ message });
    }
    if (options.responseHeaders && options.responseHeaders instanceof ResponseHeadersContainer) {
      response.setHeaders(options.responseHeaders);
    }
    response.status(200).json(output);
  },
});

const db = createDb();

export const endpointsFactory = new EndpointsFactory(resultHandler)
  .addOptions(async () => ({
    db,
  }))
  .addMiddleware(middlewareMetrics)
  .addMiddleware(middlewareServices)
  .addMiddleware(middlewareResponseHeaders)
  .addMiddleware(middlewareRequest);
