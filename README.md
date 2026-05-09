# Node.js Server Framework

An experimental vanilla Node.js framework for building HTTP/HTTPS APIs with TypeScript. Built entirely with Node.js native APIs—no external frameworks required.

## Features

- Minimal, lightweight HTTP/HTTPS server with native Node.js APIs
- Custom routing system with middleware support
- Full TypeScript support with type safety
- Dual HTTP/HTTPS server support
- Built-in request validation utilities
- Environment-based configuration (staging/production)

## Installation

Install dependencies before running the project.

```bash
npm install
# or, if you prefer pnpm:
pnpm install
```

If you are using this repo as a dependency, add it to your `package.json` as:

```json
{
  "dependencies": {
    "node-server-framework": "git+https://github.com/hlymrk/node-server-framework.git"
  }
}
```

## Usage

```ts
import { Server } from "nodejs-server-framework";

const app = new Server();
app.init();
```

## Quick Start

### Development

```bash
npm run dev:node
# or with pnpm
pnpm run dev:node
```

This starts the server in watch mode on:

- **HTTP**: `http://localhost:4000`
- **HTTPS**: `https://localhost:4001`

### Build

```bash
npm run build
# or with pnpm
pnpm run build
```

### Production

```bash
npm start
```

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── config/
│   └── env.ts                 # Environment configuration
├── lib/
│   ├── server.ts              # Core HTTP/HTTPS server
│   ├── router.ts              # Routing engine
│   └── utils/
│       ├── validate.ts         # Type validation utility
│       ├── parseJson.ts        # Safe JSON parser
│       └── getPem.ts           # HTTPS certificate loader
├── examples/
|   |── routes/                 # Example API routes
│   ├── accounts.ts             # Account management example
│   └── tokens.ts               # Token handling example
└── types/
    └── index.d.ts              # TypeScript type definitions
```

## How to Use the Framework

### Creating a Route

Routes are created using the Router class. Here's an example from `src/example/routes/accounts.ts`:

```typescript
import Router from "../lib/router.ts";
import { validate } from "../lib/utils/validate.ts";
import type { RequestData, ResponseCallback } from "../types/index.js";

const router = new Router();
const accounts = router.useRoute("/api/accounts");

// Define a POST handler
accounts.post = async function (reqData: RequestData, resCb: ResponseCallback) {
  const email = validate(reqData.body.email, "string", "", true, (e) => e);
  const password = validate(
    reqData.body.password,
    "string",
    "",
    true,
    (p) => p,
  );

  if (email && password) {
    resCb(200, "Success", { message: "Account created" });
  } else {
    resCb(400, "Error", { message: "Invalid input received" });
  }
};

export { accounts };
```

### Registering Routes in the Server

In `src/lib/server.ts`, routes are registered:

```typescript
const router = new Router();
router.routes.accounts = accounts; // Register the accounts route
router.handleRequest(
  reqData.pathname,
  reqData.method,
  reqData,
  responseCallback,
);
```

### Request Object (RequestData)

Each handler receives a `RequestData` object:

```typescript
interface RequestData {
  method: string; // HTTP method (lowercase)
  pathname: string; // Request path
  path: string; // Full request path with query
  query: ParsedUrlQuery; // Query parameters
  body: any; // Parsed JSON body
  headers: IncomingHttpHeaders; // Request headers
}
```

### Response Callback

Respond to requests using the `ResponseCallback`:

```typescript
resCb(status, message, data);

// Example
resCb(200, "OK", { userId: 123, email: "user@example.com" });
resCb(404, "Not Found", { message: "User not found" });
resCb(400, "Bad Request", { message: "Invalid input" });
```

### Using Middleware

Add middleware to routes:

```typescript
const route = router.useRoute("/api/protected", (reqData, resCb) => {
  // Middleware logic: validate token, etc.
  if (!reqData.headers.authorization) {
    resCb(401, "Unauthorized", { message: "Missing token" });
    return;
  }
});

route.get = (reqData, resCb) => {
  resCb(200, "OK", { data: "Protected resource" });
};
```

### Input Validation

Use the `validate()` utility for type-safe validation:

```typescript
const validate = (
  input: any,
  type: string, // "string", "number", "object", "array", etc.
  fallback: any, // Default value if validation fails
  truthy?: boolean, // If true, checks typeof === type; if false, checks !==
  cb?: (input: any) => any, // Callback to transform the value
) => any;

// Example
const email = validate(reqData.body.email, "string", "", true, (e) => e);
const age = validate(reqData.body.age, "number", 0, true, (a) => Math.floor(a));
```

## Environment Configuration

The framework loads environment values from a `.env` file via `dotenv`.

Supported variables:

- `NODE_ENV` — active environment, either `staging` or `production`
- `ENV_NAME` — optional friendly environment label
- `HTTP_PORT` — port for HTTP server
- `HTTPS_PORT` — port for HTTPS server
- `HTTPS_KEY_PATH` — path to the TLS private key file
- `HTTPS_CERT_PATH` — path to the TLS certificate file

Example `.env` file:

```dotenv
NODE_ENV=staging
ENV_NAME=staging
HTTP_PORT=4000
HTTPS_PORT=4001
HTTPS_KEY_PATH=./https/key.pem
HTTPS_CERT_PATH=./https/cert.pem
```

The environment config in `src/config/env.ts` resolves these values and passes HTTPS options to `getPem()`.

Run with a selected environment:

```bash
NODE_ENV=production npm start
# or with pnpm
NODE_ENV=production pnpm start
```

## Example Routes

### Accounts Route (`/api/accounts`)

The framework includes an example `accounts` route demonstrating:

- Account creation with validation
- Email/password validation
- Structured error responses

### Tokens Route (`/api/tokens`)

Scaffold for token authentication features. Use this as a template for adding:

- Token generation
- Token validation
- Token refresh logic

## API Response Format

All responses are returned as JSON:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "key": "value"
  }
}
```

## File Structure for HTTPS

To enable HTTPS, place certificate files in:

```
https/
├── key.pem
└── cert.pem
```

If certificates are missing, the framework logs a warning and continues with HTTP only.

## Technologies

- **Runtime**: Node.js
- **Language**: TypeScript
- **Package Manager**: pnpm
- **HTTP Servers**: Native Node.js `http` and `https` modules

## Development

This is an experimental framework built for learning and exploration. It demonstrates:

- Building a custom HTTP router from scratch
- TypeScript type safety in Node.js
- Middleware patterns in vanilla Node.js
- Request/response handling without frameworks

## License

ISC
