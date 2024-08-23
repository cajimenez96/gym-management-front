# Gym Management Application Frontend

A modern, responsive web application for efficient gym management. This frontend project provides an intuitive interface
for gym owners and administrators to manage members, memberships, payments, and check-ins.

Integrates seamlessly with
the [backend application](https://github.com/HanifCarroll/gym-management-server-express).

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture Overview](#architecture-overview)
4. [Getting Started](#getting-started)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Component Structure](#component-structure)
8. [State Management](#state-management)
9. [Styling](#styling)
10. [Code Quality and Formatting](#code-quality-and-formatting)
11. [License](#license)
12. [Contact Information](#contact-information)

## Features

- Member registration and management
- Membership plan creation and management
- Payment processing with Stripe integration
- Member check-in system

## Technologies Used

- TypeScript
- Vite
- React 18
- Tanstack Router
- Material-UI (MUI) for UI components
- React Query for server state management
- Axios for API requests
- Vitest and React Testing Library for testing
- MSW (Mock Service Worker) for API mocking in tests
- Date-fns for date manipulation

## Architecture Overview

This project follows a modified Clean Architecture approach. The application is
built using Vite, TypeScript, and React, and is organized into feature modules.

Each module has some or all of the following components:

- Models: Data models representing core business objects
- Repositories: Implementations for data access and manipulation
- Services: Implementations for business logic
- Pages: React components that represent a page or view
- Hooks: Custom hooks for logic used in the pages
- Components: React components used in the pages
- Index File: Barrel file that acts as a public interface for the module

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/HanifCarroll/gym-management-client-react.git
   ```

2. Navigate to the project directory:

   ```
   cd gym-management-client-react
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Environment Setup

1. Copy the `.env.example` file to `.env`:

   ```
   cp .env.example .env
   ```

2. Edit `.env` and set the required environment variables:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

The api base url should be wherever you are running the corresponding gym-management-server project.

Your stripe publishable key can be retrieved from your Stripe dashboard.

Please make sure that test mode is enabled and that you grab the corresponding key. It should start with pk*test*.

## Running the Application

To run the application in development mode:

```
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing

This project uses Vitest for unit and integration testing, along with React Testing Library for component testing.

To run tests:

```
npm test
```

For watch mode:

```
npm run test:watch
```

## Component Structure

The application follows a modular component structure:

- `src/components`: React components used throughout the application.
- `src/context`: React contexts and accompanying hooks.
- `src/modules`: Feature modules, each containing a set of related components, hooks, pages, and logic.
- `src/routes`: Application routes that reference page components.

## State Management

This application uses a combination of React Query for server state management and local React state (via `useState`)
for UI state.

## Styling

Styling is primarily handled through Material-UI (MUI), which provides a consistent and customizable design system.

## Code Quality and Formatting

To ensure code quality and consistency, this project uses:

- **Prettier**: For consistent code formatting

    - Configuration in `.prettierrc`
    - Run formatter: `npm run format`

- **ESLint**: For static code analysis

    - Configuration in `.eslintrc.js`
    - Run linter: `npm run lint`

- **lint-staged**: For running linters on git staged files

    - Configuration in `package.json`

- **Husky**: For running git hooks
    - Pre-commit hook to run lint-staged

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact Information

For any inquiries about this project, please contact:

Hanif Carroll

Email: [HanifCarroll@gmail.com](mailto:HanifCarroll@gmail.com)

LinkedIn: https://www.linkedin.com/in/hanifcarroll

GitHub: https://github.com/HanifCarroll
