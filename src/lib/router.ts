import type {
  Methods,
  RequestData,
  ResponseCallback,
  Route,
} from "../types/index.js";

class Router {
  routes: Route;

  constructor() {
    this.routes = {};
  }

  // @ToODO: think of a better name,
  // route creator, validator, and constructor that also
  // calls a middleware function (intentionally a single function, add all your logic inside)
  // and moves ahead to call the method handler
  useRoute(pathname: string, middleware?: Function) {
    const route =
      this.routes[pathname] ||
      (this.routes[pathname] = {
        post: this.#runDefaultHandler,
        put: this.#runDefaultHandler,
        get: this.#runDefaultHandler,
        delete: this.#runDefaultHandler,
      });

    if (middleware) {
      const methods = Object.keys(route);
      methods.forEach((method) => {
        const originalMethod = route[method as keyof Methods]!;
        route[method as keyof Methods] = (
          reqData: RequestData,
          resCb: ResponseCallback,
        ) => {
          middleware(reqData, resCb);
          originalMethod(reqData, resCb);
        };
      });
    }

    return route;
  }

  #runDefaultHandler(reqData: RequestData, resCb: ResponseCallback) {
    resCb(405, "Method Not Allowed", {
      message: "This method is not allowed for the requested resource.",
    });
  }
  #notFoundHandler(reqData: RequestData, resCb: ResponseCallback) {
    resCb(404, "Not Found", {
      message: "Request resource was not found.",
    });
  }

  // general route handler, validates the request routes and justifies the handler calls
  handleRequest(
    pathname: string,
    method: string,
    reqData: RequestData,
    resCb: ResponseCallback,
  ) {
    const route = this.routes[pathname];
    if (route && route[method as keyof Methods]) {
      route[method as keyof Methods]!(reqData, resCb);
    } else this.#notFoundHandler(reqData, resCb);
  }
  routeList() {
    return Object.keys(this.routes);
  }
}

export default Router;
