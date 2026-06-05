import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Dumbbell, Flame, Plus, Target } from "lucide-react";
import { type Variants, motion } from "motion/react";
import type { AppPage } from "../App";
import {
  useGoal,
  useUserProfile,
  useWorkoutHistory,
} from "../hooks/useQueries";
import {
  calculateStreak,
  countWorkoutsThisWeek,
  formatRelativeTime,
  nsToDate,
} from "../utils/fitnessUtils";
import { capitalize, muscleBadgeClass } from "../utils/fitnessUtils";

interface DashboardProps {
  onNavigate: (page: AppPage) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: history, isLoading: historyLoading } = useWorkoutHistory();
  const { data: goal, isLoading: goalLoading } = useGoal();

  const isLoading = profileLoading || historyLoading || goalLoading;
  const userName = profile?.name || "Athlete";
  const sessions = history ?? [];
  const streak = calculateStreak(sessions);
  const weeklyCount = countWorkoutsThisWeek(sessions);
  const weeklyGoal = Number(goal?.weeklyFrequency ?? 4);
  const goalProgress = Math.min(100, (weeklyCount / weeklyGoal) * 100);

  const recentSessions = [...sessions]
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 3);

  const getHourGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            {getHourGreeting()}
          </p>
          {profileLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <h1 className="font-display text-4xl font-black tracking-tight">
              {userName}
              <span className="text-primary">.</span>
            </h1>
          )}
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          {/* Streak */}
          <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-6 translate-x-6" />
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Streak
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-12 w-20" />
            ) : (
              <>
                <div className="font-display text-5xl font-black text-foreground leading-none">
                  {streak}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  consecutive weeks
                </div>
              </>
            )}
          </div>

          {/* Weekly Goal */}
          <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-6 translate-x-6" />
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                This Week
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-12 w-20" />
            ) : (
              <>
                <div className="font-display text-5xl font-black leading-none">
                  <span className="text-primary">{weeklyCount}</span>
                  <span className="text-muted-foreground text-2xl">
                    /{weeklyGoal}
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Log Workout CTA */}
        <motion.div variants={itemVariants}>
          <Button
            data-ocid="dashboard.log_workout_button"
            className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 rounded-xl"
            onClick={() => onNavigate("log")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Workout
          </Button>
        </motion.div>

        {/* Recent Workouts */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold">Recent Workouts</h2>
            <button
              type="button"
              onClick={() => onNavigate("history")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : recentSessions.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">
                No workouts yet. Log your first session!
              </p>
            </div>
          ) : (
            <div
              data-ocid="dashboard.recent_workouts.list"
              className="space-y-3"
            >
              {recentSessions.map((session, idx) => {
                const date = nsToDate(session.timestamp);
                const exerciseCount = session.exercises.length;
                const muscles = [
                  ...new Set(
                    session.exercises.map((e) => e.exercise.muscleGroup),
                  ),
                ];
                const ocidIndex = idx + 1;

                return (
                  <motion.div
                    key={session.timestamp.toString()}
                    data-ocid={`dashboard.recent_workouts.item.${ocidIndex}`}
                    whileHover={{ scale: 1.01 }}
                    className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => onNavigate("history")}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(date)}
                      </div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {muscles.slice(0, 3).map((m) => (
                          <span
                            key={m}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${muscleBadgeClass(m)}`}
                          >
                            {capitalize(m)}
                          </span>
                        ))}
                        {muscles.length > 3 && (
                          <span className="text-[10px] text-muted-foreground px-2 py-0.5">
                            +{muscles.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
