# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ragbase** is a React + TypeScript frontend for a Knowledge Management and RAG (Retrieval-Augmented Generation) pipeline. The application provides a UI for viewing documents, knowledge bases, and chat interfaces that connect to backend RAG services.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# The app will be available on port 3002 (mapped to container port 80)
# It connects to the "jeff" network for backend integration

# Build Docker image manually
docker build -t km-frontend .
```

## Architecture

### Component Structure

The app uses a simple, flat component architecture:
- [src/main.tsx](src/main.tsx) - Entry point with React StrictMode
- [src/App.tsx](src/App.tsx) - Root component wrapper
- [src/components/KnowledgeManagementApp.tsx](src/components/KnowledgeManagementApp.tsx) - Main application component containing all UI

### Key Design Patterns

**Single-Component App**: The entire UI is contained in `KnowledgeManagementApp.tsx`. Navigation is handled via local state (`active`), with different views rendered conditionally based on the active tab.

**Missing UI Components**: The code imports from `@/components/ui/*` (Card, Button, Input, Table), but these components don't exist in the codebase. These are likely shadcn/ui components that need to be created or the imports are placeholders for a planned component library.

**Backend Integration**:
- Environment variables are defined in `.env` for configuration
- `VITE_CHAT_ENDPOINT` points to `/api/chat` for RAG queries
- nginx.conf includes commented-out proxy configuration for n8n webhook integration at `/api/chat/`
- The app expects to run in a Docker network named "jeff" to communicate with backend services

### Styling

- TailwindCSS for all styling (configured in [tailwind.config.js](tailwind.config.js))
- Design system uses slate color palette
- Responsive layouts with flexbox and grid

### Data Flow

Currently, the app displays **static/mock data**:
- Dashboard shows hardcoded metrics (vectors, documents, pipelines)
- Documents table displays sample entries
- No API integration is implemented yet

The chat functionality is UI-only and not connected to the backend endpoint.

## Important Notes

**UI Component Library Issue**: Before adding new features, resolve the missing UI components. Either:
1. Install and configure shadcn/ui components
2. Create the missing components manually ([card.tsx](src/components/ui/card.tsx), [button.tsx](src/components/ui/button.tsx), [input.tsx](src/components/ui/input.tsx), [table.tsx](src/components/ui/table.tsx))
3. Replace with alternative component library

**TypeScript Configuration**: No tsconfig.json exists. This may cause type-checking issues. The project uses TypeScript but relies on Vite's esbuild for compilation without strict type checking.

**Planned Integration**: The nginx configuration suggests the app will proxy `/api/chat/` requests to an n8n service for RAG processing. This is currently commented out.
