# FitTrack

A full-stack fitness tracking app built on the Internet Computer, featuring workout logging, diet planning, progress analytics, and more.

# Features

# Dashboard
- Streak counter — tracks consecutive active days
- Weekly goal progress bar
- Quick overview of recent workout sessions

# Log Workout
- Searchable exercise library with 15+ exercises across 7 muscle groups
- Log sets, reps, and weight per exercise
- **Custom Exercise** tab — log any exercise not in the library by entering a name, muscle group, sets, reps, and weight/duration

# History
- Full session log with expandable workout details

# Progress
- Personal records for each exercise
- Weekly volume bar chart (last 8 weeks)

# Diet Plan
- Set daily calorie and macro (protein/carbs/fat) goals
- Log meals with food items and notes
- Macro progress bars showing daily totals vs. goals

# Workout Plan
- 7-day weekly planner
- Rest day toggles per day
- Schedule exercises for each day of the week

# Music
- 5 curated genre cards: EDM, Hip-Hop, Rock/Metal, Pop, Latin
- Direct links to Spotify and YouTube playlists for each genre

# More
- Body weight trend chart — log and visualize weight over time
- Hydration tracker — 8-glass daily water intake tracker
- Motivational quotes — daily fitness inspiration
- Fitness tips — expandable accordion of training and nutrition tips

# Profile
- Set your display name
- Set your weekly workout frequency goal
  

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + TypeScript + Tailwind CSS   |
| Backend   | Motoko (Internet Computer canister) |
| Auth      | Internet Identity                   |
| Hosting   | Internet Computer (ICP)             |



## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+
- [MOPS](https://mops.one/) (Motoko package manager)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) v0.24+

### Install Dependencies

# Install frontend dependencies
cd src/frontend
pnpm install --prefer-offline

# Install backend dependencies
cd src/backend
mops install
Run Locally
# Start the local ICP replica
dfx start --background

# Deploy canisters locally
dfx deploy

# Generate TypeScript bindings from backend
pnpm bindgen

# Start the frontend dev server
cd src/frontend
pnpm dev
The app will be available at http://localhost:3000.

Type Checking
# Frontend
cd src/frontend
pnpm typecheck

# Backend
cd src/backend
mops check --fix
Build for Production
# Frontend
cd src/frontend
pnpm build
Deployment
This app is deployed to the Internet Computer network. After making changes:

dfx deploy --network ic




