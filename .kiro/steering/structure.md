# Project Structure

## Root Level
- **Configuration**: `vite.config.ts`, `tsconfig.*.json`, `package.json`
- **Environment**: `.env`, `.env.development` files
- **Entry Point**: `index.html`, `src/main.ts`

## Source Directory (`src/`)

### Core Application
- `App.vue` - Root application component with minimal styling
- `main.ts` - Application entry point with plugin registration
- `shims-vue.d.ts` - TypeScript declarations for Vue files

### Views (`src/views/`)
Main page components following feature-based organization:
- `HomeView.vue` - Main layout with nested routing
- `Login.vue` - Authentication page
- `PuzzleManagement.vue` - Main puzzle listing and management
- `CreatePuzzle.vue` / `EditPuzzle.vue` - Puzzle creation and editing
- `ReviewCenter.vue` - Puzzle review and approval
- `Reports.vue` - Analytics and reporting
- Settings pages: `Settings.vue`, `GeneralSettings.vue`, `UserSettings.vue`, `EnumManagement.vue`

### Components (`src/components/`)
Reusable UI components:
- `PuzzleForm.vue` - Form component for puzzle input
- `Sidebar.vue` - Navigation sidebar
- `icons/` - Icon components

### Routing (`src/router/`)
- `index.ts` - Vue Router configuration with nested routes
- Uses history mode with meta titles for Chinese localization

### State Management (`src/stores/`)
- Pinia stores for application state
- `counter.ts` - Example store (likely to be replaced)

### Utilities (`src/utils/`)
- `http.ts` - Axios wrapper with interceptors and error handling
- Centralized HTTP service with authentication token support

### Types (`src/types/`)
- `PuzzleTypes.ts` - TypeScript interfaces for puzzle-related data structures

### Assets (`src/assets/`)
- `base.css`, `main.css` - Base styling
- `global.scss` - Global SCSS styles
- `logo.png`, `logo.svg` - Application branding

## Naming Conventions
- **Views**: PascalCase with descriptive names (`PuzzleManagement.vue`)
- **Components**: PascalCase for reusable components
- **Files**: camelCase for utilities, PascalCase for components
- **Routes**: kebab-case for URL paths, camelCase for route names

## Architecture Patterns
- **Single File Components**: Vue SFC structure with `<template>`, `<script>`, `<style>`
- **Composition API**: Preferred over Options API for new components
- **Centralized HTTP**: All API calls through `src/utils/http.ts`
- **Route-based Code Splitting**: Views loaded as separate chunks
- **Nested Routing**: Main layout with child routes for different sections