import { ExternalLink, Headphones, Music2, Zap } from "lucide-react";
import { motion } from "motion/react";

interface Playlist {
  name: string;
  url: string;
  platform: "Spotify" | "YouTube";
}

interface Genre {
  name: string;
  description: string;
  artists: string[];
  playlists: Playlist[];
  color: string;
  bgColor: string;
  accentColor: string;
  icon: string;
}

const genres: Genre[] = [
  {
    name: "EDM / Electronic",
    description:
      "High-energy beats built for peak performance. Drop into a zone and push through every rep.",
    artists: [
      "Calvin Harris",
      "Martin Garrix",
      "Tiësto",
      "Skrillex",
      "Marshmello",
    ],
    playlists: [
      {
        name: "Beast Mode EDM",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
        platform: "Spotify",
      },
      {
        name: "Workout EDM",
        url: "https://open.spotify.com/playlist/37i9dQZF1DWUVpAXiEPK8P",
        platform: "Spotify",
      },
      {
        name: "Gym EDM Mix",
        url: "https://www.youtube.com/results?search_query=gym+edm+workout+mix+2024",
        platform: "YouTube",
      },
    ],
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    accentColor: "border-cyan-500/30",
    icon: "⚡",
  },
  {
    name: "Hip-Hop",
    description:
      "Raw, confident energy from the streets to the weight room. Pure motivation.",
    artists: [
      "Eminem",
      "Kanye West",
      "Jay-Z",
      "Kendrick Lamar",
      "Travis Scott",
    ],
    playlists: [
      {
        name: "Workout Rap",
        url: "https://open.spotify.com/playlist/37i9dQZF1DWZjqjZMudx9T",
        platform: "Spotify",
      },
      {
        name: "Hip-Hop Workout",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX186v583rmzp",
        platform: "Spotify",
      },
      {
        name: "Best Hip-Hop Gym Mix",
        url: "https://www.youtube.com/results?search_query=best+hip+hop+gym+workout+2024",
        platform: "YouTube",
      },
    ],
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    accentColor: "border-amber-500/30",
    icon: "🔥",
  },
  {
    name: "Rock / Metal",
    description:
      "Shred with the heaviest riffs ever recorded. Turn aggression into fuel.",
    artists: [
      "Metallica",
      "AC/DC",
      "Linkin Park",
      "System of a Down",
      "Pantera",
    ],
    playlists: [
      {
        name: "Metal Workout",
        url: "https://open.spotify.com/playlist/37i9dQZF1DWWOaP4H0w5b0",
        platform: "Spotify",
      },
      {
        name: "Rock Workout",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh",
        platform: "Spotify",
      },
      {
        name: "Gym Rock Metal Mix",
        url: "https://www.youtube.com/results?search_query=rock+metal+gym+workout+playlist",
        platform: "YouTube",
      },
    ],
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    accentColor: "border-red-500/30",
    icon: "🎸",
  },
  {
    name: "Pop Workout",
    description:
      "Infectious hooks and production that keeps the tempo high and spirits higher.",
    artists: [
      "Dua Lipa",
      "The Weeknd",
      "Harry Styles",
      "Billie Eilish",
      "Post Malone",
    ],
    playlists: [
      {
        name: "Pop Workout",
        url: "https://open.spotify.com/playlist/37i9dQZF1DXaXB8fQg7xof",
        platform: "Spotify",
      },
      {
        name: "Pop Hits Workout",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd",
        platform: "Spotify",
      },
      {
        name: "Best Pop Workout Mix",
        url: "https://www.youtube.com/results?search_query=pop+workout+hits+2024",
        platform: "YouTube",
      },
    ],
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    accentColor: "border-pink-500/30",
    icon: "💜",
  },
  {
    name: "Latin / Reggaeton",
    description:
      "The rhythm of the tropics fuels explosive movement and unstoppable energy.",
    artists: ["Bad Bunny", "J Balvin", "Daddy Yankee", "Maluma", "Ozuna"],
    playlists: [
      {
        name: "Reggaeton Workout",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX41mbaMRspS4",
        platform: "Spotify",
      },
      {
        name: "Latin Gym",
        url: "https://open.spotify.com/playlist/37i9dQZF1DXa2PvUpywmrr",
        platform: "Spotify",
      },
      {
        name: "Reggaeton Fitness Mix",
        url: "https://www.youtube.com/results?search_query=reggaeton+workout+fitness+mix+2024",
        platform: "YouTube",
      },
    ],
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    accentColor: "border-green-500/30",
    icon: "🌴",
  },
];

const headphoneTips = [
  {
    title: "Wireless is Non-Negotiable",
    tip: "Go truly wireless or opt for a secure over-ear Bluetooth headphone. Nothing kills momentum like a cable getting snagged mid-squat.",
  },
  {
    title: "Look for IP54+ Water Resistance",
    tip: "Sweat and splashes are inevitable. Choose headphones rated IP54 or higher so moisture doesn't damage the drivers.",
  },
  {
    title: "Secure Fit Over Sound Quality",
    tip: "For high-intensity sessions, prioritize a secure fit with ear wings or hooks over raw audio quality — slipping earbuds are a safety hazard.",
  },
  {
    title: "Battery Life Matters",
    tip: "Aim for 6+ hours of playback on a single charge. Nothing's worse than your music cutting out mid-deadlift.",
  },
  {
    title: "Ambient Mode for Outdoor Runs",
    tip: "If you train outdoors, use headphones with a transparency or ambient mode so you can hear traffic and stay safe.",
  },
];

export default function Music() {
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
            Soundtrack
          </p>
          <h1 className="font-display text-4xl font-black tracking-tight">
            Music for Your Workout<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Now Playing Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 rounded-xl p-6"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/15 rounded-full blur-xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Music2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-display text-xl font-black tracking-tight">
                Find your rhythm.
              </p>
              <p className="text-muted-foreground text-sm">
                Train harder. The right playlist can add 15% more reps — science
                says so.
              </p>
            </div>
            <Zap className="w-8 h-8 text-primary/40 flex-shrink-0 ml-auto" />
          </div>
        </motion.div>

        {/* Genre Cards */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">Browse by Genre</h2>
          {genres.map((genre, idx) => (
            <motion.div
              key={genre.name}
              data-ocid={`music.genre.item.${idx + 1}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.07 }}
              className={`bg-card border ${genre.accentColor} rounded-xl p-5 space-y-4`}
            >
              {/* Genre Header */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${genre.bgColor} flex items-center justify-center flex-shrink-0 text-xl`}
                >
                  {genre.icon}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-display text-base font-bold ${genre.color}`}
                  >
                    {genre.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {genre.description}
                  </p>
                </div>
              </div>

              {/* Artists */}
              <div>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-1.5 font-medium">
                  Artists
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {genre.artists.map((artist) => (
                    <span
                      key={artist}
                      className={`text-xs px-2.5 py-1 rounded-full ${genre.bgColor} ${genre.color} font-medium border ${genre.accentColor}`}
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>

              {/* Playlists */}
              <div>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2 font-medium">
                  Playlists
                </p>
                <div className="space-y-2">
                  {genre.playlists.map((playlist, pIdx) => (
                    <a
                      key={playlist.name}
                      data-ocid={`music.playlist.link.${idx * 3 + pIdx + 1}`}
                      href={playlist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-2.5 rounded-lg ${genre.bgColor} border ${genre.accentColor} hover:opacity-80 transition-opacity group`}
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
                        {playlist.platform === "Spotify" ? (
                          <span className="text-green-400 text-xs font-bold">
                            S
                          </span>
                        ) : (
                          <span className="text-red-400 text-xs font-bold">
                            YT
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${genre.color} truncate`}
                        >
                          {playlist.name}
                        </div>
                        <div className="text-xs text-muted-foreground/60">
                          {playlist.platform}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Headphone Tips */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">
              Best Headphones for Working Out
            </h2>
          </div>
          <div className="space-y-3">
            {headphoneTips.map((tip, idx) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.06 }}
                className="bg-card border border-border rounded-xl p-4 flex gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5 font-display font-bold text-primary text-sm">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-semibold text-sm mb-0.5">
                    {tip.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {tip.tip}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
