import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { type Exercise, MuscleGroup } from "../backend.d";
import { useAddWorkoutSession, useExercises } from "../hooks/useQueries";
import { capitalize, muscleBadgeClass } from "../utils/fitnessUtils";

interface ExerciseEntry {
  exercise: Exercise;
  sets: string;
  reps: string;
  weightKg: string;
  durationMin: string;
  expanded: boolean;
}

interface LogWorkoutProps {
  onNavigate: (page: AppPage) => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  MuscleGroup.chest,
  MuscleGroup.back,
  MuscleGroup.legs,
  MuscleGroup.arms,
  MuscleGroup.shoulders,
  MuscleGroup.core,
  MuscleGroup.cardio,
];

const defaultCustomForm = {
  name: "",
  muscleGroup: MuscleGroup.chest,
  sets: "3",
  reps: "10",
  weightKg: "20",
  durationMin: "0",
};

export default function LogWorkout({ onNavigate }: LogWorkoutProps) {
  const { data: exercises, isLoading } = useExercises();
  const addSession = useAddWorkoutSession();

  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | "all">("all");
  const [selectedExercises, setSelectedExercises] = useState<ExerciseEntry[]>(
    [],
  );

  // Custom exercise form state
  const [customForm, setCustomForm] = useState(defaultCustomForm);

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((ex) => {
      const matchesSearch = ex.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesGroup =
        filterGroup === "all" || ex.muscleGroup === filterGroup;
      return matchesSearch && matchesGroup;
    });
  }, [exercises, search, filterGroup]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    for (const ex of filteredExercises) {
      const group = ex.muscleGroup;
      if (!groups[group]) groups[group] = [];
      groups[group].push(ex);
    }
    return groups;
  }, [filteredExercises]);

  const isSelected = (ex: Exercise) =>
    selectedExercises.some((e) => e.exercise.name === ex.name);

  const toggleExercise = (ex: Exercise) => {
    if (isSelected(ex)) {
      setSelectedExercises((prev) =>
        prev.filter((e) => e.exercise.name !== ex.name),
      );
    } else {
      setSelectedExercises((prev) => [
        ...prev,
        {
          exercise: ex,
          sets: "3",
          reps: "10",
          weightKg: ex.muscleGroup === MuscleGroup.cardio ? "0" : "20",
          durationMin: ex.muscleGroup === MuscleGroup.cardio ? "30" : "0",
          expanded: true,
        },
      ]);
    }
  };

  const handleAddCustomExercise = () => {
    if (!customForm.name.trim()) {
      toast.error("Exercise name is required");
      return;
    }
    const sets = Number(customForm.sets);
    const reps = Number(customForm.reps);
    if (sets < 1 || reps < 1) {
      toast.error("Sets and reps must be at least 1");
      return;
    }

    const exercise: Exercise = {
      name: customForm.name.trim(),
      muscleGroup: customForm.muscleGroup,
    };

    // Avoid duplicates by name
    if (selectedExercises.some((e) => e.exercise.name === exercise.name)) {
      toast.error("Exercise with this name already added");
      return;
    }

    setSelectedExercises((prev) => [
      ...prev,
      {
        exercise,
        sets: customForm.sets,
        reps: customForm.reps,
        weightKg: customForm.weightKg,
        durationMin: customForm.durationMin,
        expanded: true,
      },
    ]);
    setCustomForm(defaultCustomForm);
    toast.success(`"${exercise.name}" added to session`);
  };

  const updateEntry = (
    name: string,
    field: keyof Omit<ExerciseEntry, "exercise" | "expanded">,
    value: string,
  ) => {
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.exercise.name === name ? { ...e, [field]: value } : e,
      ),
    );
  };

  const toggleExpanded = (name: string) => {
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.exercise.name === name ? { ...e, expanded: !e.expanded } : e,
      ),
    );
  };

  const handleSubmit = async () => {
    if (selectedExercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }

    const hasInvalidEntry = selectedExercises.some((e) => {
      const sets = Number(e.sets);
      const reps = Number(e.reps);
      return sets < 1 || reps < 1;
    });

    if (hasInvalidEntry) {
      toast.error("Sets and reps must be at least 1");
      return;
    }

    try {
      await addSession.mutateAsync({
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        exercises: selectedExercises.map((e) => ({
          exercise: e.exercise,
          sets: BigInt(Math.max(1, Number(e.sets) || 1)),
          reps: BigInt(Math.max(1, Number(e.reps) || 1)),
          weightKg: Number(e.weightKg) || 0,
          durationMin: Number(e.durationMin) || 0,
        })),
      });

      toast.success("Workout logged! 💪");
      setSelectedExercises([]);
      onNavigate("dashboard");
    } catch {
      toast.error("Failed to save workout. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            New Session
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Log Workout<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Selected Exercises */}
        <AnimatePresence>
          {selectedExercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <h2 className="font-display text-lg font-bold">
                Selected ({selectedExercises.length})
              </h2>
              {selectedExercises.map((entry, idx) => {
                const isCardio =
                  entry.exercise.muscleGroup === MuscleGroup.cardio;
                return (
                  <motion.div
                    key={entry.exercise.name}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-card border border-primary/30 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 p-4 cursor-pointer text-left"
                      onClick={() => toggleExpanded(entry.exercise.name)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {entry.exercise.name}
                        </div>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${muscleBadgeClass(entry.exercise.muscleGroup)}`}
                        >
                          {capitalize(entry.exercise.muscleGroup)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExercise(entry.exercise);
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Remove exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {entry.expanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {entry.expanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-border pt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Sets
                              </Label>
                              <Input
                                data-ocid={
                                  idx === 0 ? "log.sets.input" : undefined
                                }
                                type="number"
                                min="1"
                                value={entry.sets}
                                onChange={(e) =>
                                  updateEntry(
                                    entry.exercise.name,
                                    "sets",
                                    e.target.value,
                                  )
                                }
                                className="h-9 text-center bg-secondary border-border"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Reps
                              </Label>
                              <Input
                                data-ocid={
                                  idx === 0 ? "log.reps.input" : undefined
                                }
                                type="number"
                                min="1"
                                value={entry.reps}
                                onChange={(e) =>
                                  updateEntry(
                                    entry.exercise.name,
                                    "reps",
                                    e.target.value,
                                  )
                                }
                                className="h-9 text-center bg-secondary border-border"
                              />
                            </div>
                            {!isCardio && (
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Weight (kg)
                                </Label>
                                <Input
                                  data-ocid={
                                    idx === 0 ? "log.weight.input" : undefined
                                  }
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={entry.weightKg}
                                  onChange={(e) =>
                                    updateEntry(
                                      entry.exercise.name,
                                      "weightKg",
                                      e.target.value,
                                    )
                                  }
                                  className="h-9 text-center bg-secondary border-border"
                                />
                              </div>
                            )}
                            {isCardio && (
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Duration (min)
                                </Label>
                                <Input
                                  data-ocid={
                                    idx === 0 ? "log.duration.input" : undefined
                                  }
                                  type="number"
                                  min="0"
                                  value={entry.durationMin}
                                  onChange={(e) =>
                                    updateEntry(
                                      entry.exercise.name,
                                      "durationMin",
                                      e.target.value,
                                    )
                                  }
                                  className="h-9 text-center bg-secondary border-border"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              <Button
                data-ocid="log.session.submit_button"
                className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary rounded-xl"
                onClick={handleSubmit}
                disabled={addSession.isPending}
              >
                {addSession.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Save Workout
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Toggle: Library vs Custom */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          <button
            type="button"
            data-ocid="log.library_tab"
            onClick={() => setActiveTab("library")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "library"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            From Library
          </button>
          <button
            type="button"
            data-ocid="log.custom_tab"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "custom"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Exercise
          </button>
        </div>

        {/* Custom Exercise Form */}
        <AnimatePresence mode="wait">
          {activeTab === "custom" && (
            <motion.div
              key="custom-form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-5 space-y-4"
            >
              <h2 className="font-display text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Add Custom Exercise
              </h2>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Exercise Name *
                  </Label>
                  <Input
                    data-ocid="log.custom_name.input"
                    placeholder="e.g. Dragon Flag, Nordic Curl..."
                    value={customForm.name}
                    onChange={(e) =>
                      setCustomForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="bg-secondary border-border h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Muscle Group *
                  </Label>
                  <Select
                    value={customForm.muscleGroup}
                    onValueChange={(val) =>
                      setCustomForm((prev) => ({
                        ...prev,
                        muscleGroup: val as MuscleGroup,
                      }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="log.custom_musclegroup.select"
                      className="bg-secondary border-border h-10"
                    >
                      <SelectValue placeholder="Select muscle group" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {MUSCLE_GROUPS.map((mg) => (
                        <SelectItem
                          key={mg}
                          value={mg}
                          className="cursor-pointer"
                        >
                          {capitalize(mg)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Sets
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={customForm.sets}
                      onChange={(e) =>
                        setCustomForm((prev) => ({
                          ...prev,
                          sets: e.target.value,
                        }))
                      }
                      className="h-9 text-center bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Reps
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={customForm.reps}
                      onChange={(e) =>
                        setCustomForm((prev) => ({
                          ...prev,
                          reps: e.target.value,
                        }))
                      }
                      className="h-9 text-center bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Weight (kg)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={customForm.weightKg}
                      onChange={(e) =>
                        setCustomForm((prev) => ({
                          ...prev,
                          weightKg: e.target.value,
                        }))
                      }
                      className="h-9 text-center bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Duration (min)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={customForm.durationMin}
                      onChange={(e) =>
                        setCustomForm((prev) => ({
                          ...prev,
                          durationMin: e.target.value,
                        }))
                      }
                      className="h-9 text-center bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button
                  data-ocid="log.custom_add.button"
                  onClick={handleAddCustomExercise}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Library */}
        <AnimatePresence mode="wait">
          {activeTab === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-lg font-bold mb-3">
                Exercise Library
              </h2>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="log.exercise_search_input"
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border h-10"
                />
              </div>

              {/* Muscle Group Filter */}
              <div className="flex gap-2 flex-wrap mb-4">
                <button
                  type="button"
                  onClick={() => setFilterGroup("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filterGroup === "all"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {MUSCLE_GROUPS.map((group) => (
                  <button
                    type="button"
                    key={group}
                    onClick={() =>
                      setFilterGroup(filterGroup === group ? "all" : group)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      filterGroup === group
                        ? `${muscleBadgeClass(group)} border-opacity-100`
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {capitalize(group)}
                  </button>
                ))}
              </div>

              {/* Exercise List */}
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : Object.keys(groupedExercises).length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    No exercises found. Try a different search.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedExercises).map(([group, exs]) => (
                    <div key={group}>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${muscleBadgeClass(group)}`}
                        >
                          {capitalize(group)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {exs.length} exercise{exs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {exs.map((ex, idx) => {
                          const selected = isSelected(ex);
                          const globalIdx =
                            filteredExercises.findIndex(
                              (e) => e.name === ex.name,
                            ) + 1;
                          return (
                            <motion.button
                              key={ex.name}
                              data-ocid={
                                idx === 0 &&
                                group === Object.keys(groupedExercises)[0]
                                  ? "log.exercise.item.1"
                                  : `log.exercise.item.${globalIdx}`
                              }
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleExercise(ex)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                                selected
                                  ? "bg-primary/15 border-primary/50 text-foreground"
                                  : "bg-card border-border hover:border-border/80 hover:bg-secondary"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  selected
                                    ? "border-primary bg-primary"
                                    : "border-border"
                                }`}
                              >
                                {selected && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                                )}
                              </div>
                              <span className="text-sm font-medium flex-1">
                                {ex.name}
                              </span>
                              {selected && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-primary/40 text-primary"
                                >
                                  Added
                                </Badge>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add CTA when exercises are selected */}
        {selectedExercises.length > 0 && <div className="h-4" />}
      </div>
    </div>
  );
}
