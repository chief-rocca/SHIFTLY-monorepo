Shiftly: Engineering Proof of Concept (POC) Sprint Plan
Version: 1.0

Objective: deliver a "substantial," production-grade infrastructure demonstration within 36 hours to validate engineering capability and secure deposit.

1. Executive Summary
This sprint focuses on the "Golden Path" user journey: A Client posts a shift on the Web Portal, and it appears instantly on the Worker's Mobile App.

This demonstrates mastery of:

Full Stack Architecture: (Frontend, Backend, Database, Mobile).

Real-time Systems: (WebSockets/Postgres Realtime).

Modern Infrastructure: (Monorepo, CI/CD ready).

2. Technical Architecture
We are utilizing a Monorepo strategy to ensure code sharing and type safety, mirroring the architecture of scale-ups like Timee or Vercel.

Repository Manager: Turborepo

Web Portal: Next.js + Tailwind CSS + shadcn/ui (Hosted on Vercel)

Mobile App: React Native Expo (Hosted on Expo EAS)

Backend/Database: Supabase (Managed PostgreSQL)

Orchestration: GitHub Actions

Directory Structure
Plaintext

shiftly-monorepo/
├── apps/
│   ├── web/          # Next.js (Client Admin Panel)
│   └── mobile/       # Expo (Worker App)
├── packages/
│   ├── database/     # Shared Types & Logic
│   └── config/       # Shared ESLint/TS Configurations
├── turbo.json        # Build Orchestration
└── package.json      # Root Dependencies
3. Implementation Phases (36-Hour Timeline)
Phase 1: The Foundation (Hours 0–4)
Objective: Initialize the Monorepo and secure the Database.

Tasks:

Scaffold project: npx create-turbo@latest .

Inject Expo app: npx create-expo-app@latest mobile --template blank-typescript.

Initialize Git: git init, set remote to shiftly-monorepo.

Database Setup: Provision Supabase project shiftly-backend.

Phase 2: The Web Command Center (Hours 4–12)
Objective: Build the interface for the "Client" to post shifts.

Tasks:

Install UI Library: npx shadcn-ui@latest init (Style: New York, Slate).

Add Components: button, input, card, toast.

Feature: Build CreateShiftForm.tsx using react-hook-form and zod.

Integration: Connect form submission to Supabase shifts table.

Phase 3: The Mobile "Proof of Life" (Hours 12–24)
Objective: Build the interface for the "Worker" to view shifts.

Tasks:

Install dependencies: npm install @supabase/supabase-js.

Feature: Build ShiftList component using FlatList.

"The Flex": Implement Supabase Realtime subscription (.on('postgres_changes')) so the list updates without refreshing.

Phase 4: Polish & Deploy (Hours 24–36)
Objective: Ensure the demo is visually impressive and bug-free.

Tasks:

Web Polish: Add a "Success" toast notification upon submission.

Mobile Polish: Ensure text is readable and cards have shadow/elevation.

Dry Run: Test the flow with the phone disconnected from the computer (over 4G/5G).

4. Technical Appendix (Copy-Paste Ready)
A. Database Schema (SQL)
Run this in the Supabase SQL Editor to configure the backend instantly.

SQL

create table shifts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text not null,
  pay_rate numeric not null,
  start_time timestamptz default now(),
  created_at timestamptz default now()
);

-- ENABLE REALTIME
alter publication supabase_realtime add table shifts;
B. Environment Variables (.env.local)
Required in both apps/web and apps/mobile (use EXPO_PUBLIC_ prefix for mobile).

Plaintext

NEXT_PUBLIC_SUPABASE_URL=[YOUR_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_KEY]
5. The Demo Script (The "Money" Moment)
Scene: You are with the partner. Laptop open, Phone in hand.

Setup: "I want to show you the core engine. This isn't a mock-up; this is a live production environment."

The Action: Hand them the phone (with the Shiftly app open).

The Trigger: On your laptop, type: "Urgent: Event Security - $45/hr" and hit Post.

The Result: Watch their face as the shift card slides onto the phone screen in their hand, instantly.

The Closing Line: "That was the hard part. The infrastructure is now live. We are ready to scale."
