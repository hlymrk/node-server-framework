/**
 * this feature/route lets users create their account, edit their account, delete thier account.
 * we want to:
 * - let user create account with email, username and password
 * - let users login to their accounts
 * - let users update their acccounts
 * - let users delete their accounts
 * - save any meta data e.g their ids of qrcodes/barcodes
 * - also save the current chosen plan (free, basic, etc)
 * - add any function neccessasry to make sure it's scaable and dope.
 * route: /api/accounts
 */
import Router from "../lib/router.ts";
import { validate } from "../lib/utils/validate.ts";
import type { RequestData, ResponseCallback } from "../types/index.js";

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
