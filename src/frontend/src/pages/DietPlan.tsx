import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Apple, Save, Target, Trash2, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DIET_GOALS_KEY = "fittrack_diet_goals";
const MEALS_KEY = "fittrack_meals";

interface DietGoals {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface Meal {
  id: string;
  mealName: string;
  foods: string;
  notes: string;
  timestamp: number;
}

const defaultGoals: DietGoals = {
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

function loadGoals(): DietGoals {
  try {
    const raw = localStorage.getItem(DIET_GOALS_KEY);
    if (raw) return JSON.parse(raw) as DietGoals;
  } catch {
    // ignore
  }
  return defaultGoals;
}

function loadMeals(): Meal[] {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    if (raw) return JSON.parse(raw) as Meal[];
  } catch {
    // ignore
  }
  return [];
}

export default function DietPlan() {
  const [goals, setGoals] = useState<DietGoals>(loadGoals);
  const [meals, setMeals] = useState<Meal[]>(loadMeals);

  const [mealForm, setMealForm] = useState({
    mealName: "",
    foods: "",
    notes: "",
  });

  // Persist meals
  useEffect(() => {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  }, [meals]);

  const handleSaveGoals = () => {
    localStorage.setItem(DIET_GOALS_KEY, JSON.stringify(goals));
    toast.success("Goals saved!");
  };

  const handleAddMeal = () => {
    if (!mealForm.mealName.trim()) {
      toast.error("Meal name is required");
      return;
    }
    if (!mealForm.foods.trim()) {
      toast.error("Please list the foods in this meal");
      return;
    }
    const newMeal: Meal = {
      id: `${Date.now()}-${Math.random()}`,
      mealName: mealForm.mealName.trim(),
      foods: mealForm.foods.trim(),
      notes: mealForm.notes.trim(),
      timestamp: Date.now(),
    };
    setMeals((prev) => [newMeal, ...prev]);
    setMealForm({ mealName: "", foods: "", notes: "" });
    toast.success("Meal logged!");
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    toast.success("Meal removed");
  };

  const hasGoals = goals.calories || goals.protein || goals.carbs || goals.fat;

  const macros = [
    {
      label: "Protein",
      value: goals.protein,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      unit: "g",
    },
    {
      label: "Carbs",
      value: goals.carbs,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      unit: "g",
    },
    {
      label: "Fat",
      value: goals.fat,
      color: "bg-rose-500",
      textColor: "text-rose-400",
      unit: "g",
    },
  ];

  // Total macro calories (approximate)
  const totalMacroCalories =
    Number(goals.protein || 0) * 4 +
    Number(goals.carbs || 0) * 4 +
    Number(goals.fat || 0) * 9;

  const getProgress = (macro: { value: string; unit: string }) => {
    if (!totalMacroCalories || !macro.value) return 0;
    return Math.round(
      (Number(macro.value || 0) / (totalMacroCalories / 4)) * 100,
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            Nutrition
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Diet Plan<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Summary Banner */}
        {hasGoals && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">
                  Daily Goals
                </div>
                {goals.calories && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-primary font-semibold">
                      {goals.calories}
                    </span>{" "}
                    kcal target
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {macros.map((macro) =>
                macro.value ? (
                  <div key={macro.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-xs font-semibold ${macro.textColor}`}
                      >
                        {macro.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {macro.value}
                        {macro.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, getProgress(macro))}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full ${macro.color} rounded-full`}
                      />
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </motion.div>
        )}

        {/* Daily Goals Form */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-display text-base font-bold flex items-center gap-2">
            <Apple className="w-4 h-4 text-primary" />
            Set Daily Goals
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Calories (kcal)
              </Label>
              <Input
                data-ocid="diet.calories.input"
                type="number"
                min="0"
                placeholder="e.g. 2200"
                value={goals.calories}
                onChange={(e) =>
                  setGoals((prev) => ({ ...prev, calories: e.target.value }))
                }
                className="bg-secondary border-border h-10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Protein (g)
              </Label>
              <Input
                data-ocid="diet.protein.input"
                type="number"
                min="0"
                placeholder="e.g. 150"
                value={goals.protein}
                onChange={(e) =>
                  setGoals((prev) => ({ ...prev, protein: e.target.value }))
                }
                className="bg-secondary border-border h-10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Carbs (g)
              </Label>
              <Input
                data-ocid="diet.carbs.input"
                type="number"
                min="0"
                placeholder="e.g. 250"
                value={goals.carbs}
                onChange={(e) =>
                  setGoals((prev) => ({ ...prev, carbs: e.target.value }))
                }
                className="bg-secondary border-border h-10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Fat (g)
              </Label>
              <Input
                data-ocid="diet.fat.input"
                type="number"
                min="0"
                placeholder="e.g. 70"
                value={goals.fat}
                onChange={(e) =>
                  setGoals((prev) => ({ ...prev, fat: e.target.value }))
                }
                className="bg-secondary border-border h-10"
              />
            </div>
          </div>
          <Button
            data-ocid="diet.goals.save_button"
            onClick={handleSaveGoals}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Goals
          </Button>
        </div>

        {/* Add Meal Form */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-display text-base font-bold flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            Log a Meal
          </h2>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Meal Name *
              </Label>
              <Input
                data-ocid="diet.meal_name.input"
                placeholder="e.g. Breakfast, Post-Workout Snack..."
                value={mealForm.mealName}
                onChange={(e) =>
                  setMealForm((prev) => ({ ...prev, mealName: e.target.value }))
                }
                className="bg-secondary border-border h-10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Foods *
              </Label>
              <Textarea
                data-ocid="diet.meal_foods.textarea"
                placeholder="e.g. Oats 80g, banana, 250ml whole milk, whey protein 30g..."
                value={mealForm.foods}
                onChange={(e) =>
                  setMealForm((prev) => ({ ...prev, foods: e.target.value }))
                }
                className="bg-secondary border-border resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Notes (optional)
              </Label>
              <Textarea
                data-ocid="diet.meal_notes.textarea"
                placeholder="Any notes — timing, calories, how you felt..."
                value={mealForm.notes}
                onChange={(e) =>
                  setMealForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="bg-secondary border-border resize-none"
                rows={2}
              />
            </div>
            <Button
              data-ocid="diet.meal.add_button"
              onClick={handleAddMeal}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Log Meal
            </Button>
          </div>
        </div>

        {/* Meals List */}
        <div>
          <h2 className="font-display text-lg font-bold mb-3">Today's Meals</h2>
          {meals.length === 0 ? (
            <div
              data-ocid="diet.meal.empty_state"
              className="bg-card border border-border rounded-xl p-8 text-center"
            >
              <UtensilsCrossed className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground text-sm">
                No meals logged yet. Start tracking your nutrition!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  data-ocid={`diet.meal.item.${idx + 1}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UtensilsCrossed className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {meal.mealName}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {meal.foods}
                      </div>
                      {meal.notes && (
                        <div className="text-xs text-muted-foreground/70 mt-1 italic">
                          {meal.notes}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground/50 mt-1">
                        {new Date(meal.timestamp).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid={`diet.meal.delete_button.${idx + 1}`}
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                      aria-label="Delete meal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
