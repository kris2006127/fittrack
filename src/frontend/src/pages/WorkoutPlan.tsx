import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Dumbbell, Moon, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PLAN_KEY = "fittrack_workout_plan";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface PlannedExercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

interface DayPlan {
  isRest: boolean;
  exercises: PlannedExercise[];
}

type WeeklyPlan = Record<DayKey, DayPlan>;

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const defaultPlan = (): WeeklyPlan => ({
  monday: {
    isRest: false,
    exercises: [
      { id: "1", name: "Bench Press", sets: "4", reps: "8", notes: "" },
    ],
  },
  tuesday: {
    isRest: false,
    exercises: [{ id: "2", name: "Squats", sets: "4", reps: "10", notes: "" }],
  },
  wednesday: { isRest: true, exercises: [] },
  thursday: {
    isRest: false,
    exercises: [
      {
        id: "3",
        name: "Deadlift",
        sets: "3",
        reps: "6",
        notes: "Focus on form",
      },
    ],
  },
  friday: {
    isRest: false,
    exercises: [{ id: "4", name: "Pull-ups", sets: "4", reps: "8", notes: "" }],
  },
  saturday: {
    isRest: false,
    exercises: [
      { id: "5", name: "Cardio", sets: "1", reps: "30", notes: "30 min run" },
    ],
  },
  sunday: { isRest: true, exercises: [] },
});

function loadPlan(): WeeklyPlan {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<WeeklyPlan>;
      // Ensure all days exist
      const plan = defaultPlan();
      for (const day of DAYS) {
        if (parsed[day.key]) plan[day.key] = parsed[day.key] as DayPlan;
      }
      return plan;
    }
  } catch {
    // ignore
  }
  return defaultPlan();
}

interface AddExerciseFormProps {
  onAdd: (ex: Omit<PlannedExercise, "id">) => void;
  onCancel: () => void;
}

function AddExerciseForm({ onAdd, onCancel }: AddExerciseFormProps) {
  const [form, setForm] = useState({
    name: "",
    sets: "3",
    reps: "10",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onAdd({
      name: form.name.trim(),
      sets: form.sets,
      reps: form.reps,
      notes: form.notes,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-3 bg-secondary/50 rounded-lg p-3 space-y-2 border border-border">
        <Input
          placeholder="Exercise name *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="bg-secondary border-border h-9 text-sm"
          autoFocus
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              Sets
            </Label>
            <Input
              type="number"
              min="1"
              value={form.sets}
              onChange={(e) => setForm((p) => ({ ...p, sets: e.target.value }))}
              className="bg-secondary border-border h-8 text-center text-sm"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              Reps
            </Label>
            <Input
              type="number"
              min="1"
              value={form.reps}
              onChange={(e) => setForm((p) => ({ ...p, reps: e.target.value }))}
              className="bg-secondary border-border h-8 text-center text-sm"
            />
          </div>
        </div>
        <Textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="bg-secondary border-border resize-none text-sm"
          rows={2}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 h-8"
          >
            Add
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-border h-8"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkoutPlan() {
  const [plan, setPlan] = useState<WeeklyPlan>(loadPlan);
  const [addingExerciseTo, setAddingExerciseTo] = useState<DayKey | null>(null);

  // Auto-save on change
  useEffect(() => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan]);

  const toggleRest = (day: DayKey) => {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isRest: !prev[day].isRest,
        exercises: prev[day].isRest ? prev[day].exercises : [],
      },
    }));
  };

  const addExercise = (day: DayKey, ex: Omit<PlannedExercise, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: [...prev[day].exercises, { ...ex, id }],
      },
    }));
    setAddingExerciseTo(null);
  };

  const deleteExercise = (day: DayKey, exId: string) => {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: prev[day].exercises.filter((e) => e.id !== exId),
      },
    }));
  };

  // Get today's day key
  const todayKey =
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].key;

  // Count training days
  const trainingDays = DAYS.filter((d) => !plan[d.key].isRest).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            Weekly Schedule
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Workout Plan<span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="text-primary font-semibold">{trainingDays}</span>{" "}
            training days · {7 - trainingDays} rest days
          </p>
        </div>

        {/* Days Grid */}
        <div className="space-y-3">
          {DAYS.map((day, dayIdx) => {
            const dayPlan = plan[day.key];
            const isToday = day.key === todayKey;
            return (
              <motion.div
                key={day.key}
                data-ocid={`plan.day.${day.key}.card`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: dayIdx * 0.05 }}
                className={`bg-card border rounded-xl overflow-hidden ${
                  isToday ? "border-primary/50" : "border-border"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center gap-3 p-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-sm ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : dayPlan.isRest
                          ? "bg-secondary text-muted-foreground"
                          : "bg-secondary text-foreground"
                    }`}
                  >
                    {day.short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{day.label}</span>
                      {isToday && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">
                          Today
                        </span>
                      )}
                      {dayPlan.isRest && (
                        <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                          Rest Day
                        </span>
                      )}
                    </div>
                    {!dayPlan.isRest && dayPlan.exercises.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {dayPlan.exercises.length} exercise
                        {dayPlan.exercises.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        data-ocid={`plan.day.${day.key}.rest.checkbox`}
                        id={`rest-${day.key}`}
                        checked={dayPlan.isRest}
                        onCheckedChange={() => toggleRest(day.key)}
                        className="border-border data-[state=checked]:bg-muted data-[state=checked]:border-muted-foreground"
                      />
                      <label
                        htmlFor={`rest-${day.key}`}
                        className="text-xs text-muted-foreground cursor-pointer select-none flex items-center gap-1"
                      >
                        <Moon className="w-3 h-3" />
                        Rest
                      </label>
                    </div>
                  </div>
                </div>

                {/* Exercises */}
                {!dayPlan.isRest && (
                  <div className="px-4 pb-4 space-y-2">
                    {dayPlan.exercises.map((ex, exIdx) => (
                      <motion.div
                        key={ex.id}
                        data-ocid={`plan.exercise.item.${exIdx + 1}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="flex items-center gap-3 bg-secondary/60 rounded-lg p-2.5 group"
                      >
                        <Dumbbell className="w-4 h-4 text-primary/60 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {ex.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ex.sets} sets × {ex.reps} reps
                            {ex.notes && ` · ${ex.notes}`}
                          </div>
                        </div>
                        <button
                          type="button"
                          data-ocid={`plan.exercise.delete_button.${exIdx + 1}`}
                          onClick={() => deleteExercise(day.key, ex.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Remove exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}

                    {/* Add Exercise */}
                    <AnimatePresence>
                      {addingExerciseTo === day.key ? (
                        <AddExerciseForm
                          key="add-form"
                          onAdd={(ex) => addExercise(day.key, ex)}
                          onCancel={() => setAddingExerciseTo(null)}
                        />
                      ) : (
                        <motion.button
                          key="add-btn"
                          type="button"
                          data-ocid="plan.add_exercise.button"
                          onClick={() => setAddingExerciseTo(day.key)}
                          className="w-full flex items-center gap-2 py-2 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border border-dashed border-border hover:border-primary/40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add exercise
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-border flex items-start gap-3">
          <CalendarDays className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Your plan saves automatically. Toggle "Rest" for recovery days. Use
            the <span className="text-foreground font-medium">Log Workout</span>{" "}
            page to record what you actually completed.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
