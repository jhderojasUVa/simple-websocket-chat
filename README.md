# Chat API PoC

## Overview
This is a minimal proof‑of‑concept chat API built with **Express**, **TypeScript**, and **Socket.io**. It demonstrates a real‑time WebSocket server that allows multiple users to join with a username and exchange messages.

## Project Structure
```
.
├─ src
│  ├─ server.ts          # Express + Socket.io server implementation
│  └─ server.test.ts     # Jest tests for connection, join, and message flow
├─ .eslintrc.json        # ESLint configuration (TypeScript support)
├─ jest.config.js        # Jest configuration (ts‑jest)
├─ tsconfig.json         # TypeScript compiler options
├─ package.json          # Scripts, dependencies, and devDependencies
└─ .gitignore            # Standard Node.js ignore patterns
```

## Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Build the project**
   ```bash
   npm run build
   ```
3. **Run the development server** (auto‑restarts on changes)
   ```bash
   npm run dev
   ```
   The server listens on `http://localhost:3000`.

## Usage
- Clients connect via WebSocket to `http://localhost:3000`.
- Emit a `join` event with a username to register the user.
- Emit a `message` event with a string to broadcast it to all connected clients.
- The server automatically broadcasts system messages when users join or leave.

## Testing
Run the Jest test suite:
```bash
npm test
```
The tests verify that:
- A client can connect to the server.
- The `join` event registers a username and notifies others.
- The `message` event is correctly broadcast to all participants.

## Linting
Run ESLint on the TypeScript source files:
```bash
npm run lint
```
The configuration enforces standard TypeScript linting rules via `@typescript-eslint`.

## Scripts Summary
| Script | Description |
|--------|-------------|
| `start` | Run the compiled server (`node dist/server.js`). |
| `dev`   | Run the server in development mode with `nodemon`. |
| `build` | Compile TypeScript to JavaScript (`tsc`). |
| `test`  | Execute Jest tests. |
| `lint`  | Run ESLint on `src/**/*.ts`. |

## License
This project is provided as a learning example and is not intended for production use.
