import type { MuscleGroup, WorkoutSession } from "../backend.d";

/** Convert nanosecond bigint timestamp to Date */
export function nsToDate(ns: bigint): Date {
  return new Date(Number(ns / BigInt(1_000_000)));
}

/** Get the ISO week number for a date */
export function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Get a "year-week" key like "2025-W12" for a date */
export function getYearWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Get the current week's year-week key */
export function currentWeekKey(): string {
  return getYearWeekKey(new Date());
}

/** Count workouts this week */
export function countWorkoutsThisWeek(sessions: WorkoutSession[]): number {
  const key = currentWeekKey();
  return sessions.filter((s) => getYearWeekKey(nsToDate(s.timestamp)) === key)
    .length;
}

/** Calculate active streak in consecutive weeks (including current week if workout logged) */
export function calculateStreak(sessions: WorkoutSession[]): number {
  if (!sessions.length) return 0;

  const weeksWithWorkout = new Set(
    sessions.map((s) => getYearWeekKey(nsToDate(s.timestamp))),
  );

  let streak = 0;
  const today = new Date();
  const checkDate = new Date(today);

  // Start from current week, walk backwards
  for (let i = 0; i < 104; i++) {
    const key = getYearWeekKey(checkDate);
    if (weeksWithWorkout.has(key)) {
      streak++;
      // Move to previous week
      checkDate.setDate(checkDate.getDate() - 7);
    } else {
      // Allow current week to have no workout yet
      if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 7);
        continue;
      }
      break;
    }
  }
  return streak;
}

/** Calculate total volume (sets * reps * weight) for a session */
export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((total, ex) => {
    return total + Number(ex.sets) * Number(ex.reps) * ex.weightKg;
  }, 0);
}

/** Get last 8 weeks of volume data */
export function getWeeklyVolumeData(
  sessions: WorkoutSession[],
): Array<{ label: string; volume: number; weekKey: string }> {
  const weeks: Array<{ label: string; volume: number; weekKey: string }> = [];
  const today = new Date();

  for (let i = 7; i >= 0; i--) {
    const weekDate = new Date(today);
    weekDate.setDate(today.getDate() - i * 7);
    const key = getYearWeekKey(weekDate);
    const weekSessions = sessions.filter(
      (s) => getYearWeekKey(nsToDate(s.timestamp)) === key,
    );
    const volume = weekSessions.reduce(
      (total, s) => total + sessionVolume(s),
      0,
    );
    const weekNum = getWeekNumber(weekDate);
    weeks.push({ label: `W${weekNum}`, volume, weekKey: key });
  }
  return weeks;
}

/** Format date for display */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format relative time */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  return formatDate(date);
}

/** Get CSS class for muscle group badge */
export function muscleBadgeClass(group: MuscleGroup | string): string {
  const map: Record<string, string> = {
    chest: "badge-chest",
    back: "badge-back",
    legs: "badge-legs",
    arms: "badge-arms",
    shoulders: "badge-shoulders",
    core: "badge-core",
    cardio: "badge-cardio",
  };
  return map[group] ?? "badge-cardio";
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
