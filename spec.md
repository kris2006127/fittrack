# FitTrack

## Current State
- Authorization system with role-based access control
- Workout logging: pick from a predefined exercise list (15 exercises, 7 muscle groups), log sets/reps/weight/duration
- Workout history: full session log with expandable details
- Progress: personal records + weekly volume bar chart (last 8 weeks)
- Profile: set name and weekly frequency goal
- Dashboard: streak counter, weekly goal progress, recent workouts

## Requested Changes (Diff)

### Add
- **Custom workout log**: Users can log a workout exercise that is NOT from the predefined list by entering a custom exercise name and muscle group, sets/reps/weight/duration. This is stored the same way as regular exercises.
- **Diet Plan**: A page where users can create and manage a personal diet plan. Includes daily calorie goal, macros (protein/carbs/fat in grams), and meal entries (meal name, foods, notes). Stored per user.
- **Workout Plan**: A page where users can create a weekly workout plan (schedule). Each day of the week can have a planned workout with exercise name, sets, reps, and notes. Stored per user.
- **Music**: A curated "Music for Workout" section/page with embedded playlist links (YouTube, Spotify embed links) and genre suggestions (e.g. Hip-Hop, EDM, Rock). Since external embeds may not always work, provide a static curated list of popular workout music genres with recommended artists/playlists as links that open in new tab.
- **More section**: A page with extra fitness resources — hydration tracker (daily water intake log), body weight log (track weight over time), motivational quotes (static curated list), and fitness tips.

### Modify
- **Log Workout page**: Add a toggle/tab to switch between "From List" and "Custom Exercise" modes. In custom mode, show a text input for exercise name, a muscle group selector, plus sets/reps/weight/duration fields.
- **Navigation**: Add new nav items for Diet Plan, Workout Plan, Music, and More.

### Remove
- Nothing removed.

## Implementation Plan
1. Backend: Add `CustomExerciseLog` variant or reuse `Exercise` type with a `isCustom` flag. Add diet plan storage (`DietPlan` type: calorie goal, macros, meals array). Add workout plan storage (`WorkoutPlan` type: array of `DayPlan` with day, exercises, notes). Add body weight log. Add hydration log.
2. Backend functions: `saveDietPlan`, `getDietPlan`, `saveWorkoutPlan`, `getWorkoutPlan`, `addBodyWeightEntry`, `getBodyWeightLog`, `addHydrationEntry`, `getHydrationLog`.
3. Frontend - Log Workout: Add "Custom Exercise" tab with name input + muscle group dropdown, same sets/reps/weight/duration fields. Custom exercises flow into `addWorkoutSession` same as predefined ones.
4. Frontend - Diet Plan page: Form to set daily calorie/macro goals. Add meal entries (name + foods + notes). Display current plan.
5. Frontend - Workout Plan page: Weekly schedule grid. Each day has add/edit exercise slots with name, sets, reps, notes.
6. Frontend - Music page: Static curated list of workout music genres with popular playlist links (Spotify, YouTube) opening in new tab. Optionally embed a YouTube playlist if CSP allows.
7. Frontend - More page: Body weight log chart, hydration tracker (daily glasses/ml), motivational quotes carousel, fitness tips list.
8. Update navigation to include all new pages.
