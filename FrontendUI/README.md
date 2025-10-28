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

4. Run unit tests
   npm test

5. Lint & format
   npm run lint
   npm run format

6. E2E tests (placeholder)
   npm run cypress:open

## Authentication

- Currently uses a scaffolded in-memory token set on login. The Axios client attaches the token as a Bearer header.
- For production, switch to server-set httpOnly cookie and update getAuthToken() accordingly.

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
