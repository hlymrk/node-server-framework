/**
 * Check and validate enviroments based on env variable
 */

import type { Enviroments } from "../types/index.js";
import { getPem } from "../lib/utils/getPem.js";
import { validate } from "../lib/utils/validate.js";
import { configDotenv } from "dotenv";

configDotenv();
const Enviroments: Enviroments = {
  staging: {
    envName:
      process.env.ENV_NAME !== "staging" ? process.env.ENV_NAME : "staging",
    httpPort: process.env.HTTP_PORT || 4000,
    httpsPort: process.env.HTTPS_PORT || 4001,
    httpOptions: getPem()!,
  },
  production: {
    envName:
      process.env.ENV_NAME !== "production"
        ? process.env.ENV_NAME
        : "production",
    httpPort: process.env.HTTP_PORT || 8000,
    httpsPort: process.env.HTTPS_PORT || 8001,
    httpOptions: getPem()!,
  },
};

const NODE_ENV = process.env.NODE_ENV;
const currEnv = validate(
  NODE_ENV?.toLocaleLowerCase(),
  "string",
  "",
  true,
  (v) => v,
);

const env = validate(
  Enviroments[currEnv as keyof Enviroments],
  "object",
  Enviroments.staging,
  true,
  (v) => v,
);

console.log({ env, currEnv });
export default env;
