import { Button } from "@/components/ui/button";
import { Dumbbell, Target, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  { icon: Dumbbell, label: "Track Every Workout" },
  { icon: Target, label: "Set Weekly Goals" },
  { icon: TrendingUp, label: "Visualize Progress" },
  { icon: Zap, label: "Break Personal Records" },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left: Hero / Branding */}
      <div className="relative lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/fittrack-hero.dim_1200x800.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/80" />

        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-black text-3xl tracking-tight">
              FitTrack
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl lg:text-6xl font-black leading-none tracking-tight mb-4 text-balance">
            Train <span className="text-primary">Smarter.</span>
            <br />
            Push <span className="text-primary">Harder.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10 font-body">
            Track every rep, every set, every personal record. Your fitness
            journey, quantified and motivated.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Login */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl font-bold mb-2">
                Get Started
              </h2>
              <p className="text-muted-foreground text-sm">
                Sign in securely to access your fitness data
              </p>
            </div>

            <Button
              data-ocid="login.primary_button"
              className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300"
              onClick={login}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Powered by Internet Computer's decentralized identity system. No
              passwords. No data collection.
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
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
    </div>
  );
}
