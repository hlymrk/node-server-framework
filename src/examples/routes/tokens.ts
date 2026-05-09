/** Example of a tokens route file
 * Handler for all token related tasks
 * add neccessary functions/endpoints for validating, verifying and refreshing tokens
 */

import Router from "../../lib/router.js";
import { validate } from "../../lib/utils/validate.js";
import type { RequestData, ResponseCallback } from "../../types/index.js";

const router = new Router();

const tokens = router.useRoute("/api/tokens");

export { tokens };
