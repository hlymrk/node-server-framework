import { createServer as createHttp, Server } from "node:http";
import { createServer as createHttps } from "node:https";
import { parse } from "node:url";
import type { RequestData, $Server } from "../types/index.js";
import type { IncomingMessage, ServerResponse } from "http";
import type { ServerOptions } from "https";
import { StringDecoder } from "node:string_decoder";
import { exit } from "node:process";
import env from "../config/env.ts";
import { validate } from "./utils/validate.ts";
import Router from "./router.ts";
import { parseJson } from "./utils/parseJson.ts";
import { accounts } from "../routes/accounts.ts";

/**
 * Server Library
 */
class $$Server implements $Server {
  httpPort: string | undefined;
  httpsPort: string | undefined;
  envName: string | undefined;

  constructor() {
    const { httpPort, httpsPort, envName } = env;
    this.httpPort = httpPort!;
    this.httpsPort = httpsPort!;
    this.envName = envName!;
  }

  init(): void {
    this.createSever("http", null).listen(4000, "localhost", () => {
      console.log(
        `HTTP server listening at http://localhost:${this.httpPort} on ${this.envName} mode`,
      );
    });
    this.createSever("https", {}).listen(4002, "localhost", () => {
      console.log(
        `HTTP server listening at https://localhost:${this.httpsPort} on ${this.envName} mode`,
      );
    });
  }

  // muti-server creation proccessor
  createSever(type: "http" | "https", options: ServerOptions | null): Server {
    if (type === "http") {
      return createHttp((req: IncomingMessage, res: ServerResponse) => {
        this.unifiedServer(req, res);
      });
    } else if (type === "https" && options !== null) {
      return createHttps(
        options!,
        (req: IncomingMessage, res: ServerResponse) => {
          this.unifiedServer(req, res);
        },
      );
    } else {
      console.log("Unknown Server Type Recievd");
      exit(1);
    }
  }

  private unifiedServer(req: IncomingMessage, res: ServerResponse): void {
    const { method, headers, url } = req;
    const parsedUrl = parse(url!, true);
    const { path, pathname, query } = parsedUrl;
    const trimmedPath = pathname?.replace(/^\/+|\/+$/g, "");

    let body = "";
    let decoder = new StringDecoder("utf-8");
    req.on("data", (chunk) => {
      body += decoder.write(chunk);
      decoder.end();
    });

    req.on("end", () => {
      const reqData: RequestData = {
        method: (method as string).toLocaleLowerCase(),
        headers,
        path: path as string,
        pathname: trimmedPath as string,
        query,
        body: parseJson(body),
      };

      // route and handle all request from a single source, using the request object
      const router = new Router();
      // @TODO: manage routes from a single source logic.
      router.routes.accounts = accounts;

      router.handleRequest(
        reqData.pathname,
        reqData.method,
        reqData,
        (status, message, body) => {
          status = validate(status, "number", 200, true, (st) => st);
          message = validate(message, "string", "", true, (msg) => msg);
          body = validate(body, "object", {}, true, (dt) => dt);

          const json = JSON.stringify(body);
          res.setHeader("Content-Type", "application/json");
          res.writeHead(status);
          res.end(json);
        },
      );
    });
  }
}

export default $$Server;
