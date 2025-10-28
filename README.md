# robot-framework-test-manager-fullstack-application-for-test-script-management-36-154

FrontendUI API base configuration:
- Copy FrontendUI/.env.example to FrontendUI/.env
- Set VITE_API_BASE_URL (default http://localhost:8000/api/v1)
- Do not hardcode API URLs; Axios client reads from env.