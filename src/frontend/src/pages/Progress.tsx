import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, TrendingUp, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { usePersonalRecords, useWorkoutHistory } from "../hooks/useQueries";
import { getWeeklyVolumeData } from "../utils/fitnessUtils";

export default function Progress() {
  const { data: prs, isLoading: prsLoading } = usePersonalRecords();
  const { data: history, isLoading: historyLoading } = useWorkoutHistory();

  const volumeData = getWeeklyVolumeData(history ?? []);
  const maxVolume = Math.max(...volumeData.map((d) => d.volume), 1);

  const personalRecords = prs ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            Your Data
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Progress<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Weekly Volume</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              Last 8 weeks
            </span>
          </div>

          {historyLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div
              data-ocid="progress.volume_chart"
              className="flex items-end gap-2 h-32"
            >
              {volumeData.map((week, idx) => {
                const heightPct =
                  maxVolume > 0 ? (week.volume / maxVolume) * 100 : 0;
                const isCurrentWeek = idx === volumeData.length - 1;

                return (
                  <div
                    key={week.weekKey}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <div className="w-full flex items-end justify-center h-24 group relative">
                      {/* Tooltip */}
                      {week.volume > 0 && (
                        <div className="absolute bottom-full mb-1 bg-popover border border-border rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {week.volume.toLocaleString()} kg
                        </div>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${Math.max(heightPct, week.volume > 0 ? 4 : 0)}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: idx * 0.06,
                          ease: "easeOut",
                        }}
                        className={`w-full rounded-t-md transition-colors ${
                          isCurrentWeek
                            ? "bg-primary glow-primary"
                            : week.volume > 0
                              ? "bg-primary/40 hover:bg-primary/60"
                              : "bg-secondary"
                        }`}
                        style={{ minHeight: week.volume > 0 ? "4px" : "2px" }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isCurrentWeek ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {week.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!historyLoading && volumeData.every((d) => d.volume === 0) && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              No volume data yet. Start logging workouts!
            </p>
          )}
        </motion.div>

        {/* Personal Records */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2 p-6 pb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h2 className="font-display text-lg font-bold">Personal Records</h2>
          </div>

          {prsLoading ? (
            <div className="p-6 pt-0 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : personalRecords.length === 0 ? (
            <div className="p-6 pt-0 text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground text-sm">
                No personal records yet. Log workouts with weights to track your
                PRs!
              </p>
            </div>
          ) : (
            <div data-ocid="progress.pr_table">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider pl-6">
                      Exercise
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider text-right pr-6">
                      Max Weight
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalRecords.map(([exercise, weight], idx) => (
                    <TableRow
                      key={exercise}
                      data-ocid={`progress.pr.item.${idx + 1}`}
                      className="border-border hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium pl-6 py-3">
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                          )}
                          {exercise}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-3">
                        <span className="font-display font-bold text-primary">
                          {weight}
                        </span>
                        <span className="text-muted-foreground text-xs ml-1">
                          kg
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
