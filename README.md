# Cyphr Anime Explorer

A modern, responsive anime discovery platform built with Next.js and the Jikan API. Features include anime browsing, detailed information pages, favorites management, and advanced filtering capabilities.

## Setup and Installation

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/cyphr-dev/cyphr-animexplorer.git
cd cyphr-animexplorer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:4000](http://localhost:4000).

### Available Scripts

- `npm run dev` - Start development server on port 4000
- `npm run build` - Build the application for production
- `npm run start` - Start production server on port 4000
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

### Core Technologies

**Frontend Framework**

- **Next.js 16** with App Router for modern React development
- **TypeScript** for type safety and enhanced developer experience
- **Tailwind CSS** with custom configuration for responsive design
- **Radix UI** components for accessible, unstyled UI primitives

**State Management**

- **Zustand** for lightweight, performant client-side state management
- **TanStack React Query** for server state management, caching, and background refetching
- Local storage persistence for favorites functionality

**API Integration**

- **Jikan API v4** for comprehensive anime data
- Custom rate limiting to respect API constraints
- Optimized caching strategies with 5-minute stale time

### Architecture Patterns

**Hybrid SSR/CSR Approach**

- **SSR Pages**: Home and anime details for SEO optimization and faster initial loads
- **CSR Pages**: Browse and favorites for enhanced interactivity and real-time updates
- Strategic data fetching with `Promise.allSettled` for graceful error handling

**Component Architecture**

- Modular, reusable components following single responsibility principle
- Custom hooks for API calls and state management (`useAnime`, `useFavoritesStore`)
- Consistent prop interfaces and TypeScript definitions

**Responsive Design**

- Mobile-first approach with Tailwind CSS breakpoints
- Adaptive layouts: grid view for desktop, optimized list view for mobile
- Progressive enhancement for touch interfaces

### Data Flow

```
User Interaction → Component State → Custom Hooks → API Layer → Cache Layer → UI Update
                                  ↓
                              Zustand Store (Client State)
                                  ↓
                              LocalStorage (Persistence)
```

### Key Features

**Performance Optimizations**

- React Query with intelligent caching and background updates
- Image optimization with Next.js Image component
- Static generation for SEO-critical pages
- Infinite scroll with virtualization for large datasets

**User Experience**

- Comprehensive loading states with skeleton UI
- Error boundaries and graceful error handling
- Advanced filtering with real-time search
- Persistent favorites across browser sessions

## Project Structure

```
cyphr-animexplorer/
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles and Tailwind directives
│   ├── layout.tsx               # Root layout with providers
│   ├── loading.tsx              # Global loading UI
│   ├── page.tsx                 # Home page (SSR)
│   ├── browse/                  # Browse anime section
│   │   ├── loading.tsx          # Browse loading state
│   │   ├── page.tsx             # Browse page (CSR)
│   │   └── anime/[slug]/        # Dynamic anime details
│   │       ├── error.tsx        # Error boundary
│   │       ├── loading.tsx      # Detail loading state
│   │       ├── not-found.tsx    # 404 handling
│   │       └── page.tsx         # Anime details (SSR)
│   └── favorites/               # User favorites
│       ├── loading.tsx          # Favorites loading state
│       └── page.tsx             # Favorites page (CSR)
├── components/                   # Reusable UI components
│   ├── AnimeCard.tsx            # Grid/list anime display
│   ├── AnimeDetailsHeader.tsx   # Anime page header
│   ├── AnimeDetailsSidebar.tsx  # Anime metadata sidebar
│   ├── AnimeSearchBar.tsx       # Advanced filtering interface
│   ├── BrowseAnimeList.tsx      # Main browse functionality
│   ├── FavoritesAnimeList.tsx   # Favorites management
│   └── ui/                      # Base UI components (Radix + Tailwind)
│       ├── button.tsx           # Button variants
│       ├── card.tsx             # Card layouts
│       ├── input.tsx            # Form inputs
│       ├── skeleton.tsx         # Loading placeholders
│       └── ...                  # Other UI primitives
├── lib/                         # Core utilities and configurations
│   ├── utils.ts                 # Utility functions (cn, etc.)
│   ├── api/                     # API layer
│   │   ├── jikan.ts             # Jikan API client
│   │   └── rateLimiter.ts       # Request rate limiting
│   ├── hooks/                   # Custom React hooks
│   │   └── useAnime.ts          # React Query hooks for anime data
│   ├── providers/               # React context providers
│   │   └── query-provider.tsx   # TanStack Query configuration
│   ├── store/                   # State management
│   │   ├── index.ts             # Store exports
│   │   └── useFavoritesStore.ts # Zustand favorites store
│   └── types/                   # TypeScript definitions
│       ├── anime.ts             # Anime data interfaces
│       └── store.ts             # Store type definitions
└── public/                      # Static assets
    ├── manifest.json            # PWA configuration
    └── robots.txt               # SEO configuration
```

### Code Quality Standards

**TypeScript Implementation**

- Strict type checking with comprehensive interfaces
- Generic types for reusable components
- Proper error handling with typed exceptions

**Component Design Principles**

- Single Responsibility Principle for focused, testable components
- Consistent prop interfaces with optional parameters
- Separation of concerns between UI and business logic

**Performance Considerations**

- Memoization with `useMemo` and `useCallback` where appropriate
- Optimistic updates for better perceived performance
- Lazy loading and code splitting for optimal bundle sizes

## API Integration

The application integrates with the Jikan API v4 for anime data:

- **Base URL**: `https://api.jikan.moe/v4`
- **Rate Limiting**: Built-in request throttling
- **Caching**: 5-minute stale time for optimal performance
- **Error Handling**: Graceful fallbacks and retry mechanisms

## Development

The codebase follows modern React patterns with:

- Functional components with hooks
- Custom hooks for business logic
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for consistent styling

For deployment, the application is optimized for platforms like Vercel with static generation and edge runtime support.
