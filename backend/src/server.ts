import express from "express";
import { createConfig, attachRouting } from "express-zod-api";
import { routes } from "./routes";

export const app = express();
app.disable("x-powered-by");

const { notFoundHandler } = attachRouting(
  createConfig({ app, cors: false, startupLogo: false }),
  { api: routes }
);

app.use(notFoundHandler);
