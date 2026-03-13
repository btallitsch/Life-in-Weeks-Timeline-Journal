# Life in Weeks — Timeline Journal

A visual life-tracking application representing your lifespan as ~4,000 weeks on a grid. Each square is one week of your life — click any to journal, tag, rate, and reflect.

## Features

- **Visual Timeline Grid** — 52×N grid (one row per year of life), color-coded by status: past, journaled, milestone, planned, current (pulsing gold), future
- **Weekly Journal** — rich text, mood/productivity/creativity/exercise metrics per week
- **Tags** — 15 built-in life themes (career, travel, health, creativity, …) with color-coded filter bar
- **Milestones** — star any week as a milestone with a title; view all in the Milestones panel
- **Future Planning** — mark future weeks with plans and goals
- **Insights Dashboard** — mood timeline (Recharts), tag distribution bars, mood distribution chart, summary stats
- **Local Persistence** — all data stored in `localStorage`, nothing sent to any server

## Stack

- **React 18 + TypeScript** (Vite)
- **Recharts** for analytics charts
- **Lucide React** for icons
- **CSS Modules** approach with CSS custom properties (design tokens)
- **useReducer + Context** for state management
- **localStorage** for persistence

## Project Structure

```
src/
  types/          — All TypeScript interfaces, tag constants
  utils/
    dateUtils.ts  — Week index ↔ date math, progress calculations
    analytics.ts  — Mood timeline, tag stats, year summaries
  store/
    reducer.ts    — Pure reducer with all action types
    AppContext.tsx — React context provider + localStorage sync
  hooks/
    useWeeks.ts   — Grid data hook (week info, entry lookup, filter check)
  components/
    Setup/        — First-time onboarding flow (name, birthdate, lifespan)
    Navigation/   — TopNav with view switcher, progress bar
    Grid/         — WeeksGrid, WeekCell, GridFilters, GridLegend
    Journal/      — JournalModal (4 tabs: journal, metrics, tags, plans)
    Analytics/    — AnalyticsDashboard (charts, stats)
    Milestones/   — MilestonesPanel (milestone + plan cards)
  pages/          — (reserved for future route-based pages)
```

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` — deploy to Vercel, Netlify, or any static host.
