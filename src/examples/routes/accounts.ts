/**
 * Example of an accounts route file
 * this feature/route lets users create their account, edit their account, delete thier account.
 * route: /api/accounts
 */
import Router from "../../lib/router.js";
import { validate } from "../../lib/utils/validate.js";
import type { RequestData, ResponseCallback } from "../../types/index.js";

const router = new Router();

const accounts = router.useRoute("/api/accounts");

// account creation handler
accounts.post = async function (reqData: RequestData, resCb: ResponseCallback) {
  const email = validate(reqData.body.email, "string", "", true, (e) => e);
  const name = validate(reqData.body.name, "string", "", true, (n) => n);
  const password = validate(
    reqData.body.password,
    "string",
    "",
    true,
    (p) => p,
  );

  // validation passed
  if (email && name && password) {
  } else {
    resCb(400, "Error", { message: "Invalid input recieved." });
  }
};

export { accounts };
