# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grammaid is an English essay correction application using LLMs, developed as a computer science undergraduate thesis project at UFAM (Universidade Federal do Amazonas). The system evaluates essays based on a simplified version of proficiency levels (Basic, Intermediate, Advanced) and provides detailed feedback through AI-powered corrections.

## Architecture

This is a monorepo with two main components:

- **Backend** (`/backend`): Node.js/Express API with Prisma ORM
- **Frontend** (`/frontend`): Next.js 15 application with React 19 and MUI

The application uses Docker Compose to orchestrate three services:
- `grammaid-backend-dev`: Express API server (6677)
- `db`: MySQL 8.4 database (port 3306)
- `phpmyadmin`: Database administration interface (port 8282)
- `grammaid-frontend-dev`: Database administration interface (port 3000)

### Database Schema

The core data model (defined in `backend/prisma/schema.prisma`) consists of:

- **Usuario**: Users with proficiency levels (Basic, Intermediate, Advanced)
- **PropostaRedacao**: Essay prompts with difficulty levels (BASICO, INTERMEDIARIO, AVANCADO)
- **Redacao**: User-submitted essays with status tracking (RASCUNHO, ENVIADA, CORRIGIDA, ARQUIVADA)
- **Correcao**: LLM-generated corrections with overall grades and feedback
- **Criterio**: Grading criteria with partial scores
- **Erro**: Detailed error annotations with position tracking in the text

## Development Commands

### Docker Environment

Start all services:
```bash
docker compose up
```

Stop all services:
```bash
docker compose down
```

### Backend

Development server (inside container):
```bash
cd backend
npm start
```

Build for production:
```bash
cd backend
npm run build
```

Production server:
```bash
cd backend
npm run start:prod
```

Prisma commands (from host):
```bash
cd backend
npm run prisma -- <command>
# Examples:
npm run prisma -- migrate dev
npm run prisma -- studio
npm run prisma -- generate
```

Seed database:
```bash
cd backend
npm run seed
```

### Frontend

Development server (with Turbopack):
```bash
cd frontend
npm run dev
```

Build for production:
```bash
cd frontend
npm run build
```

Production server:
```bash
cd frontend
npm start
```

Lint:
```bash
cd frontend
npm run lint
```

## Environment Configuration

Copy `.env.example` files and configure:

Root `.env.example`:
- Database credentials (MYSQL_ROOT_PASSWORD, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
- Port mappings for all services

Backend `.env.example`:
- PORT: Backend server port
- DATABASE_URL: MySQL connection string

## Key Technical Details

- Backend uses CommonJS module system (`"type": "commonjs"` in package.json)
- Backend runs with nodemon + tsx for hot reloading during development
- Frontend uses Next.js 15 with Turbopack for fast development builds
- Database uses Prisma with MySQL, supporting native enums for status tracking
- Session management uses Prisma session store with express-session
- Authentication uses bcryptjs for password hashing

## Architectural Patterns (Based on PW2 Course)

This project follows the architectural patterns taught in the Programming for Web 2 (PW2) course at UFAM. The reference implementation is located at `~/dev/repos/loja`.

### Backend Structure

The backend follows a **layered architecture** with clear separation of concerns:

```
backend/src/
├── index.ts                 # Application entry point
├── router/
│   └── router.ts           # Centralized router aggregating all resource routers
├── resources/
│   └── <resource>/
│       ├── <resource>.controller.ts    # HTTP request/response handling
│       ├── <resource>.service.ts       # Business logic and database operations
│       ├── <resource>.router.ts        # Route definitions for the resource
│       ├── <resource>.types.ts         # DTOs and TypeScript types
│       ├── <resource>.schema.ts        # Joi validation schemas
│       └── <resource>.constants.ts     # Enums and constants
├── middlewares/            # Reusable middleware functions
└── utils/                  # Utility functions
```

### Resource Pattern

Each resource (e.g., `user`, `product`, `auth`) follows a consistent structure:

**1. Controller** (`*.controller.ts`)
- Handles HTTP requests and responses
- Uses `http-status-codes` for consistent status codes and messages
- Implements standard CRUD operations: `index`, `create`, `read`, `update`, `remove`
- Validates input and delegates business logic to services
- Example structure:
  ```typescript
  import { Request, Response } from "express"
  import { ReasonPhrases, StatusCodes } from "http-status-codes"

  const index = async (req: Request, res: Response) => { /* list all */ }
  const create = async (req: Request, res: Response) => { /* create one */ }
  const read = async (req: Request, res: Response) => { /* read one */ }
  const update = async (req: Request, res: Response) => { /* update one */ }
  const remove = async (req: Request, res: Response) => { /* delete one */ }

  export default { index, create, read, update, remove }
  ```

**2. Service** (`*.service.ts`)
- Contains business logic and database operations
- Uses Prisma Client for database access
- Exports functions that return Promises
- Handles errors and returns null on failure when appropriate
- Example:
  ```typescript
  import { PrismaClient } from "../../generated/prisma"

  const prisma = new PrismaClient()

  export const getItems = async () => { /* ... */ }
  export const createItem = async (data: CreateDTO) => { /* ... */ }
  ```

**3. Router** (`*.router.ts`)
- Defines HTTP routes for the resource
- Applies middleware (validation, authorization) to specific routes
- Connects routes to controller methods
- Example:
  ```typescript
  import { Router } from "express"
  import controller from "./resource.controller"
  import { validate } from "../../middlewares/validate"
  import schema from "./resource.schema"

  const router = Router()

  router.get("/", controller.index)
  router.post("/", validate(schema), controller.create)
  router.get("/:id", controller.read)
  router.put("/:id", controller.update)
  router.delete("/:id", controller.remove)

  export default router
  ```

**4. Types** (`*.types.ts`)
- Defines DTOs (Data Transfer Objects) using TypeScript utilities
- Uses `Pick<>`, `Omit<>` to derive types from Prisma models
- Example:
  ```typescript
  import { User } from "../../generated/prisma"

  export type CreateUserDTO = Pick<User, "name" | "email" | "password">
  export type UserDTO = Omit<User, "password">
  ```

**5. Schema** (`*.schema.ts`)
- Joi validation schemas for request body validation
- Applied via the `validate` middleware
- Example:
  ```typescript
  import Joi from "joi"

  const userSchema = Joi.object().keys({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  export default userSchema
  ```

**6. Constants** (`*.constants.ts`)
- Enums and constant values specific to the resource
- Example:
  ```typescript
  export enum UserTypes {
    "admin" = 1,
    "client" = 2,
  }

  export enum ProductStatus {
    "active" = 1,
    "inactive" = 0,
  }
  ```

### Common Patterns

**Naming Conventions:**
- Files: `kebab-case` (e.g., `user-profile.controller.ts`)
- Variables/Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants/Enums: `PascalCase` for enum name, specific casing for values
- Database tables: `snake_case` (mapped via `@@map()` in Prisma)

**DTOs (Data Transfer Objects):**
- Use TypeScript utility types (`Pick`, `Omit`, `Partial`) to derive from Prisma types
- Suffix with `DTO` (e.g., `CreateUserDTO`, `UpdateProductDTO`)
- Never expose password fields in response DTOs

**Error Handling:**
- Use try-catch blocks in controllers
- Return appropriate HTTP status codes from `http-status-codes`
- Log errors to console (consider structured logging in production)
- Return `null` from service functions when operations fail

**Validation:**
- Use Joi for request body validation
- Apply via `validate(schema)` middleware in routes
- Set `abortEarly: false` to return all validation errors

**Authorization:**
- Check user type from `req.session.userType`
- Use middleware for protected routes (e.g., `checkAuthorization`)
- Store `userId` and `userType` in session after login

**Session Management:**
- Extend `express-session` types for custom session data:
  ```typescript
  declare module "express-session" {
    interface SessionData {
      userType: number
      userId: string
    }
  }
  ```

**Database:**
- Use UUIDs for primary keys (`@default(uuid())`)
- Always include `created_at` and `updated_at` timestamps
- Use appropriate MySQL types via `@db.*` annotations
- Generate Prisma client to `src/generated/prisma` for better IDE support

**Prisma Best Practices:**
- Output generated client to `src/generated/prisma`
- Use `skipDuplicates: true` in seed scripts
- Use `upsert` for idempotent seed operations
- Include `binaryTargets` for Docker compatibility: `["native", "linux-musl-openssl-3.0.x"]`

### Middleware Patterns

**Validation Middleware:**
```typescript
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
    }
    next()
  }
}
```

**Authorization Middleware:**
```typescript
const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userType && req.session.userType === UserTypes.admin) {
    next()
  } else {
    res.status(StatusCodes.FORBIDDEN).json(ReasonPhrases.FORBIDDEN)
  }
}
```

### Dependencies

Core backend dependencies from PW2 course:
- `express` (v5.x) - Web framework
- `@prisma/client` - Database ORM
- `prisma` - Schema management and migrations
- `bcryptjs` - Password hashing
- `express-session` - Session management
- `@quixo3/prisma-session-store` - Prisma-based session store
- `http-status-codes` - Standardized HTTP codes and messages
- `joi` - Request validation
- `cookie-parser` - Cookie parsing
- `dotenv` - Environment variables
- `envalid` - Environment validation
- `tsx` - TypeScript execution
- `nodemon` - Development hot-reload

### Reference Project

The reference implementation (loja project) can be found at:
- Location: `~/dev/repos/loja`
- Purpose: E-commerce store for PW2 course
- Same tech stack: Express + Prisma + MySQL + Next.js

When in doubt about architectural decisions, refer to the loja project for consistency.
