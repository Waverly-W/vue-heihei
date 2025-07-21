# Technology Stack

## Frontend Framework
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** as build tool and dev server

## UI & Styling
- **Ant Design Vue 4.x** as primary component library
- **SCSS/Sass** for custom styling
- Global styles in `src/assets/`

## State Management & Routing
- **Pinia** for state management
- **Vue Router 4** for client-side routing

## HTTP & API
- **Axios** for HTTP requests
- Custom HTTP service wrapper in `src/utils/http.ts`
- API proxy configured for `/api` routes to `localhost:8080`

## Development Tools
- **Vue DevTools** plugin enabled
- **TypeScript** strict mode with custom configurations
- **npm-run-all2** for parallel script execution

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Full build with type checking
npm run build-only   # Build without type checking
npm run type-check   # Run TypeScript type checking
```

### Dependencies
```bash
npm install          # Install all dependencies
```

## Environment Configuration
- Environment variables prefixed with `VITE_`
- API base URL configurable via `VITE_API_BASE_URL`
- Development proxy routes `/api` to backend server

## Build Output
- Production builds output to `dist/` directory
- Static assets optimized and bundled by Vite