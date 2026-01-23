# SHIFTLY

**Democratising job opportunities by optimising the relationships between job seekers and employers.**

SHIFTLY is a platform that connects job seekers with short-term and flexible work opportunities, making it easier for employers to find qualified candidates and for workers to discover jobs that match their skills and availability.

## 🏗️ Architecture

This is a monorepo managed with [Turborepo](https://turborepo.dev/), containing web, mobile, and shared packages for the SHIFTLY platform.

### Apps

- **`apps/web`** - Next.js web application for employer portal and job management
- **`apps/mobile`** - React Native (Expo) mobile app for job seekers
- **`apps/docs`** - Documentation site (Next.js)

### Packages

- **`packages/database`** - Shared Supabase client and TypeScript types for database schemas
- **`packages/ui`** - Shared React component library
- **`packages/eslint-config`** - Shared ESLint configurations
- **`packages/typescript-config`** - Shared TypeScript configurations

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Production-ready React framework for the web app with server-side rendering and optimized performance |
| **React Native (Expo)** | Cross-platform mobile development framework for iOS and Android with native capabilities |
| **TypeScript** | Type-safe development across all packages to catch errors early and improve code quality |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development with consistent design tokens |
| **NativeWind** | Tailwind CSS for React Native, enabling design system consistency across web and mobile |
| **shadcn/ui** | High-quality, accessible React components built on Radix UI primitives |

### Backend & Infrastructure

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database with real-time subscriptions, authentication, and storage - chosen for rapid development and built-in features |
| **Vercel** | Deployment platform for Next.js apps with edge functions and automatic optimization |

### State Management & Forms

| Technology | Purpose |
|------------|---------|
| **React Hook Form** | Performant form validation with minimal re-renders |
| **Zod** | TypeScript-first schema validation for runtime type safety |

### Development Tools

| Technology | Purpose |
|------------|---------|
| **Turborepo** | High-performance build system for monorepos with intelligent caching |
| **ESLint** | Code linting to maintain consistent code quality |
| **Prettier** | Code formatting for consistency across the codebase |

### UI Components & Icons

| Technology | Purpose |
|------------|---------|
| **Lucide React** | Beautiful, consistent icon library for web |
| **Lucide React Native** | Native-optimized icons for mobile |
| **next-themes** | Dark mode support with system preference detection |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** 10.9.3 or higher
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/SHIFTLY-monorepo.git
cd SHIFTLY-monorepo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each app directory
   - Add your Supabase credentials and other required environment variables

### Development

Run all apps in development mode:
```bash
npm run dev
```

Run a specific app:
```bash
# Web app
npx turbo dev --filter=web

# Mobile app
cd apps/mobile
npm run ios       # iOS
npm run android   # Android
```

### Building

Build all apps and packages:
```bash
npx turbo build
```

Build a specific app:
```bash
npx turbo build --filter=web
```

## 📱 Mobile App

The mobile app is built with Expo and React Native, targeting both iOS and Android platforms.

### Running on Devices

**iOS:**
```bash
cd apps/mobile
npm run ios
```

**Android:**
```bash
cd apps/mobile
npm run android
```

**Development Server:**
```bash
cd apps/mobile
npm start
```

## 🗄️ Database

The platform uses Supabase (PostgreSQL) for data storage. Database migrations are located in the root directory:

- `supabase_migration_job_templates.sql` - Job posting templates schema
- `supabase_migration_job_postings.sql` - Job postings schema

### Key Database Features

- **Job Posting Templates** - Reusable templates for common job types
- **Job Postings** - Active job listings with scheduling and applicant management
- **Experience Groups** - Targeted job visibility based on worker experience
- **Visibility Controls** - Public/private job postings with certification requirements

## 📝 Code Quality

The project uses ESLint and TypeScript for code quality:

```bash
# Lint all packages
npm run lint

# Type check
npm run check-types

# Format code
npm run format
```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass and code is properly formatted
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Useful Links

- [Turborepo Documentation](https://turborepo.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
