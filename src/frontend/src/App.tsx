import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Dashboard from "./pages/Dashboard";
import DietPlan from "./pages/DietPlan";
import History from "./pages/History";
import LogWorkout from "./pages/LogWorkout";
import LoginPage from "./pages/LoginPage";
import More from "./pages/More";
import Music from "./pages/Music";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import WorkoutPlan from "./pages/WorkoutPlan";

export type AppPage =
  | "dashboard"
  | "log"
  | "history"
  | "progress"
  | "profile"
  | "diet"
  | "plan"
  | "music"
  | "more";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-body text-sm tracking-wide">
            Loading FitTrack...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster theme="dark" />
      </>
    );
  }

  return (
    <>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === "dashboard" && (
          <Dashboard onNavigate={setCurrentPage} />
        )}
        {currentPage === "log" && <LogWorkout onNavigate={setCurrentPage} />}
        {currentPage === "history" && <History />}
        {currentPage === "progress" && <Progress />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "diet" && <DietPlan />}
        {currentPage === "plan" && <WorkoutPlan />}
        {currentPage === "music" && <Music />}
        {currentPage === "more" && <More onNavigate={setCurrentPage} />}
      </AppLayout>
      <Toaster theme="dark" />
    </>
  );
}
