# Robot Framework Test Manager - Frontend UI

A modern React-based web application for managing Robot Framework test scripts, test cases, execution, queue, run history, and logs.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (RBAC)
- **Test Management**: Create, edit, delete, and organize test scripts and test cases
- **Execution Control**: Execute tests ad-hoc or add them to a queue for scheduled execution
- **Queue Management**: View and manage queued test cases with priority support
- **Run History**: Browse execution history with filtering, sorting, and detailed views
- **Log Access**: View and download execution logs for troubleshooting
- **Responsive Design**: Mobile-friendly UI that works on all screen sizes
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support

## Tech Stack

- **React 18**: Modern React with hooks
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with responsive design
- **Jest & React Testing Library**: Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see BackendAPI container)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your Backend API URL
# REACT_APP_API_URL=http://localhost:8000/api/v1
```

### Development

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

The application will be available at http://localhost:3000

### Production Build

```bash
# Create production build
npm run build

# Build Docker image
docker build -t robot-test-manager-ui .

# Run with Docker
docker run -p 3000:80 \
  -e REACT_APP_API_URL=http://your-backend-api:8000/api/v1 \
  robot-test-manager-ui
```

### Docker Compose

```bash
# Start with docker-compose
docker-compose up -d

# Stop
docker-compose down
```

## Project Structure

```
FrontendUI/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── context/           # React Context providers
│   │   └── AuthContext.js # Authentication context
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   ├── Dashboard.js   # Main dashboard with test cards
│   │   ├── TestDetail.js  # Test details and case management
│   │   ├── CreateTest.js  # Wizard for creating tests
│   │   ├── Queue.js       # Queue management
│   │   └── History.js     # Run history and logs
│   ├── services/          # API services
│   │   └── api.js         # Axios client and API calls
│   ├── App.js             # Main app component with routing
│   ├── App.css            # Global styles
│   └── index.js           # Application entry point
├── Dockerfile             # Production Docker build
├── docker-compose.yml     # Docker Compose configuration
├── nginx.conf             # Nginx configuration
└── package.json           # Dependencies and scripts
```

## API Integration

The frontend communicates with the Backend API via RESTful endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Tests**: `/api/v1/tests/*`
- **Cases**: `/api/v1/cases/*`
- **Execution**: `/api/v1/execute`
- **Queue**: `/api/v1/queue/*`
- **History**: `/api/v1/history/*`
- **Logs**: `/api/v1/logs/*`

API configuration is set via the `REACT_APP_API_URL` environment variable.

## Authentication

The application uses JWT-based authentication:

1. User logs in with username/password
2. Backend returns JWT access token
3. Token is stored in localStorage
4. All subsequent API requests include token in Authorization header
5. Token is automatically refreshed or user is logged out on expiration

### Demo Credentials

- Username: `admin`
- Password: `admin`

## Testing

The application includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test -- --coverage
```

Test coverage targets:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Code Quality

The project enforces code quality with:

- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting (via ESLint)
- **Git hooks**: Pre-commit linting (optional)

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix
```

## Accessibility

The UI is designed with accessibility in mind:

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus indicators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `REACT_APP_SITE_URL` | Site URL for redirects | `http://localhost:3000` |

## Deployment

### Production Deployment

1. Build the Docker image
2. Push to container registry
3. Deploy to Kubernetes/cloud platform
4. Configure environment variables
5. Set up SSL/TLS termination
6. Configure CDN for static assets (optional)

### Nginx Configuration

The included `nginx.conf` provides:
- SPA routing support
- Static asset caching
- Gzip compression
- Security headers
- Health check endpoint

## Troubleshooting

### Common Issues

**API connection refused**
- Check that Backend API is running
- Verify `REACT_APP_API_URL` is correct
- Check CORS configuration on backend

**Login fails**
- Verify backend credentials
- Check browser console for errors
- Ensure backend auth endpoints are working

**Build fails**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node.js version

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Ensure all tests pass
4. Run linting before committing
5. Update documentation as needed

## License

Copyright © 2024 Robot Framework Test Manager

## Support

For issues or questions:
- Check the documentation
- Review Backend API documentation
- Contact the development team
