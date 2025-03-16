import serverlessExpress from "serverless-http";
import { app } from "./index";

exports.handler = serverlessExpress(app);
