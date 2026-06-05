import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useWorkoutHistory } from "../hooks/useQueries";
import {
  capitalize,
  formatDate,
  muscleBadgeClass,
  nsToDate,
} from "../utils/fitnessUtils";

export default function History() {
  const { data: history, isLoading } = useWorkoutHistory();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const sessions = [...(history ?? [])].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            All Sessions
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            History<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Session Count */}
        {!isLoading && sessions.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Dumbbell className="w-4 h-4" />
            <span>
              {sessions.length} workout{sessions.length !== 1 ? "s" : ""} logged
            </span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div data-ocid="history.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sessions.length === 0 && (
          <motion.div
            data-ocid="history.empty_state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-12 text-center"
          >
            <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="font-display text-lg font-bold mb-2">
              No workouts yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Start logging your sessions to see your history here.
            </p>
          </motion.div>
        )}

        {/* Session List */}
        {!isLoading && sessions.length > 0 && (
          <div data-ocid="history.list" className="space-y-3">
            {sessions.map((session, idx) => {
              const date = nsToDate(session.timestamp);
              const isExpanded = expandedIdx === idx;
              const totalVolume = session.exercises.reduce((sum, ex) => {
                return sum + Number(ex.sets) * Number(ex.reps) * ex.weightKg;
              }, 0);
              const ocidIndex = idx + 1;

              return (
                <motion.div
                  key={session.timestamp.toString()}
                  data-ocid={`history.item.${ocidIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/50 transition-colors"
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {session.exercises.length} exercise
                        {session.exercises.length !== 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(date)}
                        {totalVolume > 0 && (
                          <>
                            <span className="text-border">·</span>
                            <span>
                              {totalVolume.toLocaleString()} kg volume
                            </span>
                          </>
                        )}
                      </div>
                      {/* Muscle Group Preview */}
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {[
                          ...new Set(
                            session.exercises.map(
                              (e) => e.exercise.muscleGroup,
                            ),
                          ),
                        ]
                          .slice(0, 4)
                          .map((m) => (
                            <span
                              key={m}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${muscleBadgeClass(m)}`}
                            >
                              {capitalize(m)}
                            </span>
                          ))}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-2">
                        {session.exercises.map((exLog, exIdx) => (
                          <div
                            key={`${exLog.exercise.name}-${exIdx}`}
                            className="flex items-center gap-3 py-2"
                          >
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${muscleBadgeClass(exLog.exercise.muscleGroup)} w-20 text-center flex-shrink-0`}
                            >
                              {capitalize(exLog.exercise.muscleGroup)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {exLog.exercise.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {exLog.exercise.muscleGroup === "cardio" ? (
                                  <>
                                    {Number(exLog.sets)} sets ·{" "}
                                    {exLog.durationMin} min
                                  </>
                                ) : (
                                  <>
                                    {Number(exLog.sets)} × {Number(exLog.reps)}
                                    {exLog.weightKg > 0 &&
                                      ` @ ${exLog.weightKg}kg`}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
