# Task — Sofa-Bed Booking App (Via Magellano 3)

- **Task ID:** sofa-booking-app
- **Owner:** Copilot + User
- **Created:** 2025-12-26
- **Status:** in_progress
- **Related:** package.json, src/App.tsx

## Goal

Build a stylish, editorial single-page React app for booking a sofa-bed in a shared Milan apartment. Friends & family only — no payments, no accounts. Calendar-based booking with conflict prevention, playful house rules, and a fashion-forward aesthetic. Fully static, deployable to Vercel/Netlify/GitHub Pages.

## Constraints

- No backend — bookings stored in static JSON, loaded at runtime
- No authentication service — simple shared password gate
- No payment processing
- Must work on free static hosting
- Editorial/fashion-inspired design (serif + sans-serif, neutral + accent)
- Mobile-responsive

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PasswordGate (if !authenticated)        │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Layout                            │   │
│  │  ┌────────────┐                                     │   │
│  │  │   Header   │  (Logo, Nav Tabs)                   │   │
│  │  └────────────┘                                     │   │
│  │  ┌────────────────────────────────────────────┐     │   │
│  │  │              Main Content                   │     │   │
│  │  │  ┌──────────────────────────────────────┐  │     │   │
│  │  │  │  Hero Section (Intro + Manifesto)    │  │     │   │
│  │  │  └──────────────────────────────────────┘  │     │   │
│  │  │  ┌──────────────────────────────────────┐  │     │   │
│  │  │  │  Calendar + BookingForm              │  │     │   │
│  │  │  │  (useBookings hook manages state)    │  │     │   │
│  │  │  └──────────────────────────────────────┘  │     │   │
│  │  │  ┌──────────────────────────────────────┐  │     │   │
│  │  │  │  Tab Sections:                       │  │     │   │
│  │  │  │  - Gallery                           │  │     │   │
│  │  │  │  - House Rules                       │  │     │   │
│  │  │  │  - Guestbook                         │  │     │   │
│  │  │  └──────────────────────────────────────┘  │     │   │
│  │  └────────────────────────────────────────────┘     │   │
│  │  ┌────────────┐                                     │   │
│  │  │   Footer   │                                     │   │
│  │  └────────────┘                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Data Flow:
┌──────────────┐    fetch     ┌──────────────────┐
│ bookings.json│ ──────────▶  │ useBookings hook │
└──────────────┘              │ (in-memory state)│
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              ┌──────────┐      ┌────────────┐    ┌─────────────┐
              │ Calendar │      │BookingForm │    │ Guestbook   │
              │ (display)│      │(add booking│    │ (past stays)│
              └──────────┘      │ + conflict │    └─────────────┘
                                │  check)    │
                                └────────────┘
```

## Chosen Approach

**Approach:** Option A — Single-Page App with Tab Navigation
**Summary:** All content in one scrollable page. Calendar as hero section, secondary content (gallery, rules, guestbook) as tab-navigable sections below.
**Reasoning:** Matches editorial aesthetic, no extra dependencies, simpler state management, faster build.
**Trade-offs:** Less structured URL navigation (no deep-linking to sections).
**Effort:** Medium
**Risk:** Low

## Test Scenarios

- [ ] Test 1: Password gate blocks access until correct phrase entered → Expected: App hidden, gate visible
- [ ] Test 2: Calendar displays current month with correct days → Expected: Correct day count, starts on right weekday
- [ ] Test 3: Booked dates show visual indicator → Expected: Dates with bookings highlighted
- [ ] Test 4: Overlapping booking attempt rejected → Expected: Error message, booking not added
- [ ] Test 5: Valid booking adds to in-memory state → Expected: Calendar updates, instructions shown
- [ ] Test 6: Month navigation works → Expected: Previous/next month displays correctly
- [ ] Test 7: Tab navigation switches content → Expected: Gallery/Rules/Guestbook sections toggle

## User Approval

- **Status:** approved
- **User Decision:** "procede"
- **Modifications Requested:** None

## Plan (Checklist)

### Phase 1: Foundation
- [x] Set up project structure (folders, types)
- [x] Configure Tailwind with design tokens (colors, fonts)
- [x] Create base Layout components (Header, Footer)
- [x] Add Google Fonts (Playfair Display, Inter)

### Phase 2: Auth & Data
- [x] Create PasswordGate component
- [x] Create useAuth hook (localStorage persistence)
- [x] Create bookings.json with sample data
- [x] Create useBookings hook (fetch, state, conflict detection)
- [x] Define TypeScript types for Booking

### Phase 3: Calendar & Booking
- [x] Build MonthView calendar component
- [x] Add month navigation (prev/next)
- [x] Show booking indicators on calendar
- [x] Build BookingForm component
- [x] Implement overlap/conflict validation
- [x] Show "how to save" instructions after booking

### Phase 4: Content Sections
- [x] Build Hero section (intro, manifesto)
- [x] Build Gallery section (sofa photos)
- [x] Build Rules section (playful house rules)
- [x] Build Guestbook section (past bookings archive)
- [x] Implement tab navigation between sections

### Phase 5: Polish & Deploy
- [x] Mobile responsiveness pass
- [x] Add subtle animations/transitions
- [x] Update index.html (title, favicon, meta)
- [ ] Test build and static hosting compatibility

## Working Notes (Append)

- Created project structure: types, hooks, components organized by feature
- Used Tailwind v4 with CSS imports, custom design tokens in index.css
- Password gate uses lazy initialization from localStorage
- Calendar supports date range selection (click start, click end)
- Booking conflict detection compares date ranges
- Responsive grid: 2-col calendar + 1-col form on desktop, stacked on mobile
- All text in Italian for local flavor
- Gallery uses Unsplash placeholder images
- Fixed React strict mode lint warnings by avoiding useEffect for synchronous derived state

## Next Actions (Always Fresh)

1. Run dev server to test UI
2. Test booking flow end-to-end
3. Verify build works for static hosting

## Progress Snapshot (Optional)

- What changed last: All phases 1-4 complete, lint errors fixed
- Open edits: Final testing
- Next micro-step: Start dev server
