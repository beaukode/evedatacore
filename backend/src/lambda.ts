import serverlessExpress from "serverless-http";
import { app } from "./server";

exports.handler = serverlessExpress(app);
