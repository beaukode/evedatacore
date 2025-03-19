import { createContainer, asFunction, asValue, FunctionReturning } from "awilix";
import {
  createEnvVariablesService,
  createPathFinderService,
  createSolarSystemsService,
  createMudSqlService,
} from "../services";
import { Middleware } from "express-zod-api";

type DiContainerService = string | number | boolean | object | FunctionReturning<unknown>;
type DiContainerServices = Record<string, DiContainerService>;
type DiServices<T extends DiContainerServices> = {
  [K in keyof T]: T[K] extends FunctionReturning<unknown> ? ReturnType<T[K]> : T[K];
};

const services = {
  env: createEnvVariablesService,
  solarSystems: createSolarSystemsService,
  pathFinder: createPathFinderService,
  mudSql: createMudSqlService,
};

const di = createContainer({
  strict: true,
});
const resolvers = Object.entries(services).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: typeof value === "function" ? asFunction(value as FunctionReturning<unknown>).scoped() : asValue(value),
  };
}, {});
di.register(resolvers);

export const middlewareServices = new Middleware({
  handler: async () => {
    return { services: di.cradle as DiServices<typeof services> };
  },
});
