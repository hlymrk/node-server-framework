import $$Server from "./lib/server.js";

class App {
  constructor() {}

  init() {
    // initialise the server
    const qServer = new $$Server();
    qServer.init();
  }
}

// initialize .net
const app = new App();
app.init();

export default app;
