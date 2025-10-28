# Test Management FrontendUI (React + TypeScript)

This is the React + TypeScript frontend for the Robot Framework Test Manager. It implements:
- Dashboard with test cards
- Stepwise test creation
- Test case detail and configuration panel
- Queue visualization with controls
- Run history and log viewer
- Notifications (toasts)
- RBAC-aware UI states
- API client services for /tests, /cases, /execute, /queue, /history, /logs

It uses React Router, React Query, Axios, react-hook-form + zod, Jest/RTL, and Cypress placeholders.
WCAG 2.1 basics are included: keyboard focus management, ARIA labels, skip link, and proper landmarks.

## Quick start

1. Install dependencies
   npm install

2. Copy environment
   cp .env.example .env
   # Adjust VITE_API_BASE_URL to your backend

3. Start dev server
   npm run dev
   # App at http://localhost:5173
   # In development a small banner shows the current API base URL for convenience.
   # Default (if not set) -> http://localhost:8000/api/v1

4. Run unit tests
   npm test

5. Lint & format
   npm run lint
   npm run format

6. E2E tests (placeholder)
   npm run cypress:open

## Authentication

- Uses backend-issued JWT access tokens (and optional refresh tokens) returned from `/auth/login` and `/auth/refresh`.
- Access token is attached as Bearer header via Axios interceptors. On 401, the client will attempt a single refresh; on failure it clears state and redirects to `/login`.
- User claims (id, name, role) are taken from the backend response `user` field when available, otherwise decoded from the access token payload.
- Tokens are persisted in sessionStorage for this scaffold. For production, prefer server-set httpOnly cookies and adapt getAuthToken/refresh accordingly.

## Project scripts

- dev: Vite dev server
- build: TypeScript build + Vite build
- preview: Serve built app locally
- test: Jest+RTL
- cypress:*: Cypress e2e

## Notes

- API endpoints and types follow the provided OpenAPI spec.
- Basic error/loading states and pagination/filter params are wired in.
- RBAC-aware UI via AccessControl and useAuth.hasRole.

## API base URL configuration

- The frontend reads the backend API base from the Vite env variable `VITE_API_BASE_URL`.
- Default for local development is `http://localhost:8000/api/v1` (see `.env.example`).
- To point to another environment, set `VITE_API_BASE_URL` in your `.env`:
  VITE_API_BASE_URL=https://your-backend.example.com/api/v1
- Do not hardcode API URLs in code; all requests use a centralized Axios client (`src/api/client.ts`) that respects this variable.
- During development, a small banner appears below the header showing the currently configured API base.
