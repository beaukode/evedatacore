import express from "express";
import cookieParser from "cookie-parser";
import { createConfig, attachRouting } from "express-zod-api";
import { routes } from "./routes";

export const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

const { notFoundHandler } = attachRouting(createConfig({ app, cors: false, startupLogo: false }), { api: routes });

app.use(notFoundHandler);
