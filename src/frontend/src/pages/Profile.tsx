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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Loader2,
  LogOut,
  Save,
  Target,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGoal,
  useSaveUserProfile,
  useSetGoal,
  useUserProfile,
} from "../hooks/useQueries";

export default function Profile() {
  const { clear, identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: goal, isLoading: goalLoading } = useGoal();
  const saveProfile = useSaveUserProfile();
  const setGoal = useSetGoal();

  const [name, setName] = useState("");
  const [weeklyFreq, setWeeklyFreq] = useState("4");
  const [nameSaved, setNameSaved] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile]);

  useEffect(() => {
    if (goal?.weeklyFrequency) setWeeklyFreq(String(goal.weeklyFrequency));
  }, [goal]);

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      setNameSaved(true);
      toast.success("Name updated!");
      setTimeout(() => setNameSaved(false), 2000);
    } catch {
      toast.error("Failed to save name");
    }
  };

  const handleSaveGoal = async () => {
    try {
      await setGoal.mutateAsync({
        weeklyFrequency: BigInt(weeklyFreq),
      });
      setGoalSaved(true);
      toast.success("Goal updated!");
      setTimeout(() => setGoalSaved(false), 2000);
    } catch {
      toast.error("Failed to save goal");
    }
  };

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-6)}`
    : "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-1">
            Settings
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Profile<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              {profileLoading ? (
                <Skeleton className="h-5 w-32 mb-1" />
              ) : (
                <div className="font-display font-bold text-lg">
                  {profile?.name || "Athlete"}
                </div>
              )}
              <div className="text-xs text-muted-foreground font-mono truncate">
                {shortPrincipal}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="font-display text-base font-bold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Display Name
          </h2>
          <div className="space-y-3">
            {profileLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Label
                  htmlFor="name-input"
                  className="text-sm text-muted-foreground"
                >
                  Your name
                </Label>
                <Input
                  id="name-input"
                  data-ocid="profile.name_input"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="bg-secondary border-border h-10"
                />
                <Button
                  data-ocid="profile.name_save_button"
                  onClick={handleSaveName}
                  disabled={saveProfile.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saveProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : nameSaved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Name
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="font-display text-base font-bold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Weekly Workout Goal
          </h2>
          <div className="space-y-3">
            {goalLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Label
                  htmlFor="goal-select"
                  className="text-sm text-muted-foreground"
                >
                  Workouts per week
                </Label>
                <Select value={weeklyFreq} onValueChange={setWeeklyFreq}>
                  <SelectTrigger
                    id="goal-select"
                    data-ocid="profile.goal_select"
                    className="bg-secondary border-border h-10"
                  >
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <SelectItem
                        key={n}
                        value={String(n)}
                        className="cursor-pointer"
                      >
                        {n} day{n !== 1 ? "s" : ""} per week
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  data-ocid="profile.goal_save_button"
                  onClick={handleSaveGoal}
                  disabled={setGoal.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {setGoal.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : goalSaved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Goal
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <Separator className="mb-6 bg-border" />
          <Button
            data-ocid="profile.logout_button"
            variant="destructive"
            className="w-full h-11 font-semibold"
            onClick={clear}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>

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
      </div>
    </div>
  );
}
