import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  ChevronRight,
  Droplets,
  Lightbulb,
  Quote,
  Scale,
  Trash2,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { AppPage } from "../App";

const WEIGHT_LOG_KEY = "fittrack_weight_log";
const HYDRATION_KEY = "fittrack_hydration";

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

interface HydrationState {
  date: string; // "YYYY-MM-DD"
  glasses: boolean[];
}

const FITNESS_QUOTES = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
  },
  {
    text: "All progress takes place outside the comfort zone.",
    author: "Michael John Bobak",
  },
  {
    text: "What seems impossible today will one day become your warm-up.",
    author: "Unknown",
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "No matter how slow you go, you are still lapping everybody on the couch.",
    author: "Unknown",
  },
  {
    text: "Strength does not come from the body. It comes from the will of the soul.",
    author: "Gandhi",
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown",
  },
  {
    text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not.",
    author: "Arnold Schwarzenegger",
  },
];

const FITNESS_TIPS = [
  {
    title: "Always Warm Up First",
    content:
      "A 5–10 minute warm-up increases blood flow to your muscles, raises your core temperature, and significantly reduces injury risk. Dynamic stretches and light cardio beats jumping straight to heavy lifts every time.",
  },
  {
    title: "Sleep Is Your Secret Weapon",
    content:
      "Muscles are built during recovery, not during training. Aim for 7–9 hours of quality sleep. Lack of sleep raises cortisol, reduces testosterone, and impairs protein synthesis — all bad for gains.",
  },
  {
    title: "Progressive Overload",
    content:
      "To keep growing stronger, you must consistently challenge your muscles with more weight, reps, or sets over time. Even adding one more rep per session is progress. Track your lifts so you can see the trend.",
  },
  {
    title: "Protein Intake",
    content:
      "Aim for 1.6–2.2g of protein per kg of bodyweight daily. Spread it across 3–5 meals. Lean meats, eggs, dairy, legumes, and quality protein powder are all effective sources.",
  },
  {
    title: "Hydration Is Performance",
    content:
      "Even mild dehydration (2% body weight) can reduce strength by up to 20%. Drink water throughout the day, not just during workouts. Urine should be pale yellow — that's your hydration indicator.",
  },
  {
    title: "Embrace Rest Days",
    content:
      "Rest days aren't lazy days — they're growth days. Overtraining leads to plateau, injury, and burnout. Plan at least 1–2 rest days per week, and consider active recovery like walking or light stretching.",
  },
];

function loadWeightLog(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(WEIGHT_LOG_KEY);
    if (raw) return JSON.parse(raw) as WeightEntry[];
  } catch {
    // ignore
  }
  return [];
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadHydration(): HydrationState {
  try {
    const raw = localStorage.getItem(HYDRATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HydrationState;
      if (parsed.date === getTodayStr()) return parsed;
    }
  } catch {
    // ignore
  }
  return { date: getTodayStr(), glasses: Array(8).fill(false) };
}

interface MoreProps {
  onNavigate: (page: AppPage) => void;
}

export default function More({ onNavigate }: MoreProps) {
  // Weight Log
  const [weightLog, setWeightLog] = useState<WeightEntry[]>(loadWeightLog);
  const [weightInput, setWeightInput] = useState("");
  const [weightDate, setWeightDate] = useState(getTodayStr());

  // Hydration
  const [hydration, setHydration] = useState<HydrationState>(loadHydration);

  // Quotes
  const [quoteIdx, setQuoteIdx] = useState(() =>
    Math.floor(Math.random() * FITNESS_QUOTES.length),
  );
  const nextQuoteRef = useRef(quoteIdx);

  // Persist weight log
  useEffect(() => {
    localStorage.setItem(WEIGHT_LOG_KEY, JSON.stringify(weightLog));
  }, [weightLog]);

  // Persist hydration (reset daily)
  useEffect(() => {
    const today = getTodayStr();
    if (hydration.date !== today) {
      const fresh: HydrationState = {
        date: today,
        glasses: Array(8).fill(false),
      };
      setHydration(fresh);
      localStorage.setItem(HYDRATION_KEY, JSON.stringify(fresh));
    } else {
      localStorage.setItem(HYDRATION_KEY, JSON.stringify(hydration));
    }
  }, [hydration]);

  const handleLogWeight = () => {
    const w = Number(weightInput);
    if (!weightInput || Number.isNaN(w) || w <= 0 || w > 500) {
      toast.error("Enter a valid weight (kg)");
      return;
    }
    const entry: WeightEntry = {
      id: `${Date.now()}`,
      date: weightDate,
      weight: w,
    };
    setWeightLog((prev) => {
      // Remove any entry for the same date and add new
      const filtered = prev.filter((e) => e.date !== weightDate);
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
    });
    setWeightInput("");
    toast.success(`${w}kg logged for ${weightDate}`);
  };

  const deleteWeightEntry = (id: string) => {
    setWeightLog((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleGlass = (idx: number) => {
    setHydration((prev) => {
      const glasses = [...prev.glasses];
      glasses[idx] = !glasses[idx];
      return { ...prev, glasses };
    });
  };

  const filledGlasses = hydration.glasses.filter(Boolean).length;
  const mlDrunk = filledGlasses * 250;

  const handleNextQuote = () => {
    nextQuoteRef.current = (quoteIdx + 1) % FITNESS_QUOTES.length;
    setQuoteIdx(nextQuoteRef.current);
  };

  const chartData = weightLog
    .slice(-10)
    .map((e) => ({ date: e.date.slice(5), weight: e.weight }));

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
            Extra Tools
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            More<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">Profile</div>
              <div className="text-xs text-muted-foreground">Settings</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("diet")}
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">Diet Plan</div>
              <div className="text-xs text-muted-foreground">Nutrition</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
          </button>
        </div>

        {/* Body Weight Log */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Body Weight Log</h2>
          </div>

          {/* Input */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Weight (kg) *
                </Label>
                <Input
                  data-ocid="more.weight.input"
                  type="number"
                  min="1"
                  max="500"
                  step="0.1"
                  placeholder="e.g. 82.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogWeight()}
                  className="bg-secondary border-border h-10"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Date
                </Label>
                <Input
                  type="date"
                  value={weightDate}
                  max={getTodayStr()}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="bg-secondary border-border h-10"
                />
              </div>
            </div>
            <Button
              data-ocid="more.weight.log_button"
              onClick={handleLogWeight}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              <Scale className="w-4 h-4 mr-2" />
              Log Weight
            </Button>
          </div>

          {/* Chart */}
          {chartData.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-xl p-4 mb-4"
            >
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                Weight Trend
              </p>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart
                  data={chartData}
                  margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 250)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "oklch(0.58 0.02 250)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.58 0.02 250)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0.008 250)",
                      border: "1px solid oklch(0.28 0.01 250)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "oklch(0.94 0.01 90)" }}
                    itemStyle={{ color: "oklch(0.84 0.22 140)" }}
                    formatter={(v: number) => [`${v} kg`, "Weight"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="oklch(0.84 0.22 140)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.84 0.22 140)", r: 3 }}
                    activeDot={{ r: 5, fill: "oklch(0.84 0.22 140)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Weight Entries List */}
          {weightLog.length === 0 ? (
            <div
              data-ocid="more.weight.empty_state"
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <Scale className="w-7 h-7 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-muted-foreground text-sm">
                No weight entries yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...weightLog]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 10)
                .map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    data-ocid={`more.weight.item.${idx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3"
                  >
                    <div className="font-display font-bold text-primary text-lg">
                      {entry.weight}
                      <span className="text-xs font-body text-muted-foreground ml-0.5">
                        kg
                      </span>
                    </div>
                    <div className="flex-1 text-xs text-muted-foreground">
                      {new Date(`${entry.date}T12:00:00`).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteWeightEntry(entry.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
            </div>
          )}
        </section>

        {/* Hydration Tracker */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">
              Hydration Tracker
            </h2>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-display text-2xl font-black text-primary">
                  {filledGlasses}
                </span>
                <span className="text-muted-foreground text-sm">
                  {" "}
                  / 8 glasses
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {mlDrunk}ml
                </span>{" "}
                / 2000ml
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden mb-5">
              <motion.div
                animate={{ width: `${(filledGlasses / 8) * 100}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            {/* Glass Icons */}
            <div className="grid grid-cols-8 gap-1.5">
              {([0, 1, 2, 3, 4, 5, 6, 7] as const).map((glassIndex) => {
                const filled = hydration.glasses[glassIndex];
                return (
                  <button
                    key={glassIndex}
                    type="button"
                    data-ocid={`more.hydration.glass.${glassIndex + 1}`}
                    onClick={() => toggleGlass(glassIndex)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
                      filled
                        ? "bg-primary/20 border border-primary/60 scale-105"
                        : "bg-secondary border border-border hover:border-primary/40 hover:bg-primary/5"
                    }`}
                    aria-label={`Glass ${glassIndex + 1} ${filled ? "(drunk)" : "(not drunk)"}`}
                    title={
                      filled ? "Click to unmark" : "Click to mark as drunk"
                    }
                  >
                    <Droplets
                      className={`w-4 h-4 ${filled ? "text-primary" : "text-muted-foreground/40"}`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Tap a glass to toggle · resets daily · 250ml per glass
            </p>
          </div>
        </section>

        {/* Motivational Quotes */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Daily Motivation</h2>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Quote className="w-6 h-6 text-primary/30 mb-2" />
                <p className="text-base font-medium leading-relaxed italic">
                  "{FITNESS_QUOTES[quoteIdx].text}"
                </p>
                <p className="text-sm text-muted-foreground mt-2 font-semibold">
                  — {FITNESS_QUOTES[quoteIdx].author}
                </p>
              </motion.div>
            </AnimatePresence>
            <Button
              data-ocid="more.quotes.next_button"
              variant="outline"
              onClick={handleNextQuote}
              className="w-full border-border hover:border-primary/40 hover:bg-primary/5"
            >
              New Quote
            </Button>
          </div>
        </section>

        {/* Fitness Tips */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Fitness Tips</h2>
          </div>
          <Accordion type="multiple" className="space-y-2">
            {FITNESS_TIPS.map((tip, idx) => (
              <AccordionItem
                key={tip.title}
                value={tip.title}
                data-ocid={`more.tips.item.${idx + 1}`}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3 text-left">
                    <span className="w-6 h-6 rounded-md bg-primary/15 text-primary font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    {tip.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border">
                  <div className="pt-3">{tip.content}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

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
