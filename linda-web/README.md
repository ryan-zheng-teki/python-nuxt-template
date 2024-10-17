# Linda Web - Nuxt 3 Application

A modern web application built with Nuxt 3, Vue 3, and TypeScript, featuring GraphQL integration and mobile development capabilities.

## Technologies Used

- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS
- Apollo Client (for GraphQL)
- Pinia (for state management)
- Capacitor (for mobile development)

## Prerequisites

- Node.js (v14 or later recommended)
- Yarn package manager

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd linda-web
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Development

To start the development server:

```
yarn dev
```

The application will be available at `http://localhost:3000`.

## Build and Deployment

- To build the application for production:
  ```
  yarn build
  ```

- To generate a static version of the application:
  ```
  yarn generate
  ```

- To preview the production build:
  ```
  yarn preview
  ```

## GraphQL Integration

This project uses Apollo Client for GraphQL integration. The GraphQL endpoint is configured in `nuxt.config.ts`. Make sure to update the endpoint if necessary.

## Mobile Development

This project includes Capacitor for mobile development. To build for Android:

1. Ensure you have the Android development environment set up.
2. Run the build command (you may need to configure this in your scripts).

## License

This project is licensed under the [ISC License](LICENSE).