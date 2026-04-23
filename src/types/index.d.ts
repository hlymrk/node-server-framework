declare module "qr-code-styling/lib/qr-code-styling.common.js";
import type { IncomingHttpHeaders } from "node:http";
import type { ServerOptions } from "node:https";
import type { ParsedUrlQuery } from "node:querystring";

export interface RequestData {
  method: string;
  pathname: string;
  path: string;
  query: ParsedUrlQuery;
  body: any;
  headers: IncomingHttpHeaders;
}

export type ResponseCallback = (
  status: number,
  messsage: string,
  data: object | string | undefined,
) => void;

export interface $Server {
  // private   unifiedServer(req: IncomingMessage, res: ServerResponse): void;
  createSever(type: "http" | "https", options: ServerOptions | null): void;
  init(): void;
}

export type Methods = {
  get?: string;
  post?: string;
  put?: string;
  delete?: string;
};
export type __Route__<Type> = {
  [pathname: string]: {
    [method in keyof Type]: ServerHandler;
  };
};

export type Route = __Route__<Methods>;

export type ServerHandler = (
  reqData: RequestData,
  resCb: ResponseCallback,
) => void;

export interface Enviroment {
  envName: string | unknown;
  httpPort: number | string;
  httpsPort: number | string;
  httpOptions: ServerOptions;
}
export interface Enviroments {
  staging: Enviroment;
  production: Enviroment;
}

export interface AccountInfo {
  email: string;
  password: string;
  options: {
    data: {
      plan: string;
      name: string;
      metadata: metadataValid;
      qr_codes: any[];
      barcodes: any[];
      created_at: string;
    };
  };
}

export interface SignInInfo {
  email: string;
  password: string;
  options?: {
    [key: string]: string;
  };
}
