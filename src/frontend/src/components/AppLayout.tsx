import { cn } from "@/lib/utils";
import {
  Apple,
  CalendarDays,
  Dumbbell,
  History,
  LayoutDashboard,
  MoreHorizontal,
  Music2,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { AppPage } from "../App";

interface NavItem {
  id: AppPage;
  label: string;
  icon: typeof LayoutDashboard;
  ocid: string;
}

// All nav items shown in sidebar
const allNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  { id: "log", label: "Log", icon: Dumbbell, ocid: "nav.log_link" },
  { id: "history", label: "History", icon: History, ocid: "nav.history_link" },
  {
    id: "progress",
    label: "Progress",
    icon: TrendingUp,
    ocid: "nav.progress_link",
  },
  { id: "profile", label: "Profile", icon: User, ocid: "nav.profile_link" },
  { id: "diet", label: "Diet Plan", icon: Apple, ocid: "nav.diet_link" },
  {
    id: "plan",
    label: "Workout Plan",
    icon: CalendarDays,
    ocid: "nav.plan_link",
  },
  { id: "music", label: "Music", icon: Music2, ocid: "nav.music_link" },
  { id: "more", label: "More", icon: MoreHorizontal, ocid: "nav.more_link" },
];

// Mobile bottom bar: only 5 most important items
const mobileNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  { id: "log", label: "Log", icon: Dumbbell, ocid: "nav.log_link" },
  { id: "history", label: "History", icon: History, ocid: "nav.history_link" },
  {
    id: "progress",
    label: "Progress",
    icon: TrendingUp,
    ocid: "nav.progress_link",
  },
  { id: "more", label: "More", icon: MoreHorizontal, ocid: "nav.more_link" },
];

interface AppLayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export default function AppLayout({
  children,
  currentPage,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-border sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              FitTrack
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive && "drop-shadow-[0_0_6px_oklch(0.84_0.22_140)]",
                  )}
                />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar/95 backdrop-blur-xl border-t border-border z-50">
        <div className="flex items-stretch">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all duration-200 min-h-[56px]",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive && "drop-shadow-[0_0_6px_oklch(0.84_0.22_140)]",
                    )}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
