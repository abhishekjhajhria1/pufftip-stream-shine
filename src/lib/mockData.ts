export type Streamer = {
  handle: string;
  name: string;
  tagline: string;
  bio: string;
  avatarHue: number; // for generated polaroid color
  live: boolean;
  followers: string;
  totalReceived: number; // SOL
  game: string;
};

export type Tip = {
  id: string;
  from: string;
  amount: number; // SOL
  message: string;
  ago: string;
  color?: "yellow" | "pink" | "teal" | "green";
};

export type WishlistItem = {
  id: string;
  title: string;
  why: string;
  goal: number; // SOL
  raised: number; // SOL
  emoji: string;
};

export const STREAMERS: Streamer[] = [
  {
    handle: "smokeyjazz",
    name: "Smokey Jazz",
    tagline: "late-night chill streams + lo-fi sets",
    bio: "i play guitar, code, and chain-smoke metaphors. tip me a coffee or a kebab — your call.",
    avatarHue: 25,
    live: true,
    followers: "12.4k",
    totalReceived: 412.8,
    game: "Just Chatting",
  },
  {
    handle: "ghostroast",
    name: "Ghost Roast",
    tagline: "horror speedruns w/ commentary",
    bio: "speedrunning the scariest games and yelling at my cat. tips fund the therapy.",
    avatarHue: 280,
    live: true,
    followers: "48.1k",
    totalReceived: 1820.4,
    game: "Resident Evil 4",
  },
  {
    handle: "lateshift",
    name: "Late Shift",
    tagline: "we code at 3am",
    bio: "indie dev streams. building weird things in TypeScript. vibe-driven development.",
    avatarHue: 200,
    live: false,
    followers: "6.2k",
    totalReceived: 88.3,
    game: "VS Code",
  },
  {
    handle: "misokitchen",
    name: "Miso Kitchen",
    tagline: "ramen, knives, chaos",
    bio: "cooking ramen on stream every wednesday. tips go to better ingredients (and a new wok).",
    avatarHue: 60,
    live: false,
    followers: "21.7k",
    totalReceived: 522.1,
    game: "IRL",
  },
  {
    handle: "zerogpete",
    name: "Zero-G Pete",
    tagline: "factorio rocket builds",
    bio: "engineer brain, no chill. building the world's largest spaghetti factory live.",
    avatarHue: 140,
    live: true,
    followers: "33.9k",
    totalReceived: 778.2,
    game: "Factorio",
  },
  {
    handle: "polaroid_kid",
    name: "Polaroid Kid",
    tagline: "indie photo walks + chats",
    bio: "i take pictures of dumpsters and call it art. you should tip me.",
    avatarHue: 320,
    live: false,
    followers: "4.1k",
    totalReceived: 41.6,
    game: "IRL",
  },
];

export const SEED_TIPS: Record<string, Tip[]> = {
  smokeyjazz: [
    { id: "t1", from: "cryptowhale", amount: 2.5, message: "this set goes hard. smoke break for u", ago: "2m", color: "yellow" },
    { id: "t2", from: "miso", amount: 0.5, message: "play the one with the rain again pls", ago: "11m", color: "pink" },
    { id: "t3", from: "ghostr", amount: 1.2, message: "kebab fund +1", ago: "34m", color: "teal" },
    { id: "t4", from: "anon", amount: 0.18, message: "saw u on stream, instant follow", ago: "1h", color: "green" },
    { id: "t5", from: "lateshift", amount: 0.75, message: "ur lo-fi made me ship the feature", ago: "2h", color: "yellow" },
  ],
  ghostroast: [
    { id: "g1", from: "spookz", amount: 5.0, message: "AHHH that jumpscare omg", ago: "now", color: "pink" },
    { id: "g2", from: "miso", amount: 0.5, message: "tell ur cat i love him", ago: "8m", color: "yellow" },
    { id: "g3", from: "anon", amount: 0.3, message: "wr attempt incoming?", ago: "20m", color: "teal" },
  ],
  lateshift: [
    { id: "l1", from: "devbro", amount: 0.4, message: "what theme is that", ago: "5m", color: "teal" },
    { id: "l2", from: "anon", amount: 0.1, message: "ship it ship it ship it", ago: "1h", color: "yellow" },
  ],
  misokitchen: [
    { id: "m1", from: "noodlefan", amount: 1.0, message: "drop the dashi recipe", ago: "12m", color: "pink" },
    { id: "m2", from: "anon", amount: 0.25, message: "wok fund \u2764", ago: "40m", color: "green" },
  ],
  zerogpete: [
    { id: "z1", from: "factorybro", amount: 3.2, message: "main bus is ART", ago: "now", color: "green" },
    { id: "z2", from: "anon", amount: 0.5, message: "rocket by friday??", ago: "15m", color: "yellow" },
  ],
  polaroid_kid: [
    { id: "p1", from: "miso", amount: 0.2, message: "the dumpster pic was beautiful actually", ago: "3h", color: "pink" },
  ],
};

export const WISHLISTS: Record<string, WishlistItem[]> = {
  smokeyjazz: [
    { id: "w1", title: "New condenser mic", why: "the current one picks up my neighbor yelling", goal: 8, raised: 5.2, emoji: "🎙️" },
    { id: "w2", title: "Rent (this month)", why: "landlord doesn't accept lo-fi vibes", goal: 12, raised: 4.1, emoji: "🏠" },
    { id: "w3", title: "Coffee for the week", why: "5 streams = 5 coffees minimum", goal: 1.5, raised: 1.5, emoji: "☕" },
    { id: "w4", title: "Smoke break fund", why: "the house compliment, but for me", goal: 0.5, raised: 0.18, emoji: "🚬" },
  ],
  ghostroast: [
    { id: "g_w1", title: "Cat therapy bills", why: "she has seen things", goal: 6, raised: 2.8, emoji: "🐈" },
    { id: "g_w2", title: "Better headphones", why: "to hear the monsters louder", goal: 4, raised: 1.0, emoji: "🎧" },
  ],
  lateshift: [
    { id: "l_w1", title: "Mechanical keyboard", why: "the current one is a war crime", goal: 3, raised: 0.6, emoji: "⌨️" },
  ],
  misokitchen: [
    { id: "m_w1", title: "Carbon steel wok", why: "my landlord hates me already", goal: 2.5, raised: 1.8, emoji: "🍜" },
    { id: "m_w2", title: "New chef knife", why: "current one is a butter knife in disguise", goal: 4, raised: 0.9, emoji: "🔪" },
  ],
  zerogpete: [
    { id: "z_w1", title: "Second monitor", why: "for the spaghetti", goal: 5, raised: 4.4, emoji: "🖥️" },
  ],
  polaroid_kid: [
    { id: "p_w1", title: "Actual film for camera", why: "shooting digital is cheating", goal: 1.2, raised: 0.3, emoji: "📷" },
  ],
};

export const TICKER_FEED = [
  "cryptowhale → smokeyjazz · 2.5 SOL",
  "spookz → ghostroast · 5.0 SOL",
  "factorybro → zerogpete · 3.2 SOL",
  "noodlefan → misokitchen · 1.0 SOL",
  "miso → smokeyjazz · 0.5 SOL",
  "devbro → lateshift · 0.4 SOL",
  "anon → polaroid_kid · 0.2 SOL",
  "ghostr → smokeyjazz · 1.2 SOL",
];

export function getStreamer(handle: string): Streamer | undefined {
  return STREAMERS.find((s) => s.handle === handle);
}
