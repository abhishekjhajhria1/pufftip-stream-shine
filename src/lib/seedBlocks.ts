import type { Block } from "@/lib/useStreamerConfig";

/**
 * Default content blocks for each example streamer. These render on the
 * public profile when the owner hasn't customized their own blocks yet,
 * so visitors always land on a fully-populated page.
 */

function inDays(d: number) {
  return new Date(Date.now() + d * 86400000).toISOString();
}

export const SEED_BLOCKS: Record<string, Block[]> = {
  smokeyjazz: [
    { id: "sj-ann", kind: "announcement", color: "yellow", title: "tonight: rainy guitar set",
      body: "8pm CET. bring headphones. taking song requests via tip notes — drop the link." },
    { id: "sj-cd",  kind: "countdown", title: "next stream in", label: "rainy guitar set", targetISO: inDays(2) },
    { id: "sj-sch", kind: "schedule", title: "this week",
      rows: [
        { day: "mon", time: "8pm", what: "chill coding + lo-fi" },
        { day: "wed", time: "9pm", what: "guitar / requests" },
        { day: "fri", time: "10pm", what: "long stream, no plan" },
        { day: "sun", time: "3pm", what: "vinyl listening party" },
      ] },
    { id: "sj-soc", kind: "socials", title: "find me elsewhere",
      items: [
        { platform: "twitch",  handle: "smokeyjazz",  url: "https://twitch.tv/" },
        { platform: "youtube", handle: "@smokeyjazz", url: "https://youtube.com/" },
        { platform: "twitter", handle: "@smokeyjazz", url: "https://twitter.com/" },
        { platform: "discord", handle: "the smoking section", url: "https://discord.gg/" },
      ] },
    { id: "sj-poll", kind: "poll", title: "tonight's vote", question: "what should i open with?",
      options: [
        { label: "the rain one", votes: 24 },
        { label: "the slow one", votes: 12 },
        { label: "covers night", votes: 9 },
      ] },
    { id: "sj-test", kind: "testimonials", title: "kind words from the chat",
      items: [
        { from: "miso",    quote: "the only stream i actually keep open while i work.", color: "yellow" },
        { from: "ghostr",  quote: "the rain one made me cry on the subway. 10/10.",      color: "pink" },
        { from: "anon",    quote: "i tipped once and now i have a personality.",         color: "teal" },
      ] },
    { id: "sj-faq", kind: "faq", title: "frequently asked",
      items: [
        { q: "what guitar is that?", a: "a beat-up fender telecaster. it has personality (rust)." },
        { q: "can i request a song?", a: "yep — drop it in your tip note and i'll work it in." },
        { q: "where can i get the lo-fi sets?", a: "bandcamp link is in the socials block above." },
      ] },
  ],

  ghostroast: [
    { id: "gr-ann", kind: "announcement", color: "pink", title: "WR attempt friday",
      body: "going for sub-1:30 on RE4 PRO. if i fail i'm streaming till i don't. wear a diaper." },
    { id: "gr-cd",  kind: "countdown", title: "WR attempt in", label: "RE4 sub-1:30", targetISO: inDays(4) },
    { id: "gr-vid", kind: "video", title: "last week's jumpscare reel", youtubeId: "dQw4w9WgXcQ",
      caption: "the chair flew. i flew. the cat ascended." },
    { id: "gr-merch", kind: "merch", title: "ghost shop",
      items: [
        { name: "haunted tee",      emoji: "👕", price: "0.4 SOL" },
        { name: "cat-screams pin",  emoji: "📌", price: "0.05 SOL" },
        { name: "signed boo poster",emoji: "👻", price: "1.2 SOL" },
      ] },
    { id: "gr-soc", kind: "socials", title: "the rest of me",
      items: [
        { platform: "twitch",   handle: "ghostroast",  url: "https://twitch.tv/" },
        { platform: "youtube",  handle: "@ghostroast", url: "https://youtube.com/" },
        { platform: "tiktok",   handle: "@ghostroast", url: "https://tiktok.com/" },
        { platform: "discord",  handle: "the haunted house", url: "https://discord.gg/" },
      ] },
  ],

  lateshift: [
    { id: "ls-ann", kind: "announcement", color: "teal", title: "shipping pufftip clone tonight",
      body: "we will build a tip page in 3 hours from a blank vite project. probably fail. probably ship." },
    { id: "ls-sch", kind: "schedule", title: "schedule (tentative, as always)",
      rows: [
        { day: "tue", time: "11pm", what: "side project night" },
        { day: "thu", time: "11pm", what: "library reading" },
        { day: "sat", time: "3am",  what: "the actual late shift" },
      ] },
    { id: "ls-soc", kind: "socials", title: "links",
      items: [
        { platform: "github",  handle: "lateshift", url: "https://github.com/" },
        { platform: "twitter", handle: "@lateshift",url: "https://twitter.com/" },
        { platform: "youtube", handle: "@lateshift",url: "https://youtube.com/" },
      ] },
    { id: "ls-poll", kind: "poll", title: "stack vote", question: "what should i build next?",
      options: [
        { label: "rust CLI",     votes: 14 },
        { label: "another SaaS", votes: 3 },
        { label: "literally anything else", votes: 22 },
      ] },
  ],

  misokitchen: [
    { id: "mk-ann", kind: "announcement", color: "green", title: "ramen wednesday is back",
      body: "tonkotsu broth, 18 hours in. tipping unlocks toppings. corn? egg? both? you decide." },
    { id: "mk-cd",  kind: "countdown", title: "next bowl in", label: "ramen wednesday", targetISO: inDays(3) },
    { id: "mk-gal", kind: "gallery", title: "recent bowls",
      items: [
        { emoji: "🍜", caption: "tonkotsu",  hue: 30  },
        { emoji: "🍥", caption: "shoyu",     hue: 200 },
        { emoji: "🥢", caption: "tsukemen",  hue: 60  },
        { emoji: "🥚", caption: "egg!!",     hue: 80  },
      ] },
    { id: "mk-merch", kind: "merch", title: "tiny shop",
      items: [
        { name: "recipe zine", emoji: "📖", price: "0.2 SOL" },
        { name: "apron",       emoji: "🧑‍🍳", price: "0.6 SOL" },
      ] },
    { id: "mk-test", kind: "testimonials", title: "the kitchen says",
      items: [
        { from: "noodlefan", quote: "i made the dashi recipe and cried.", color: "yellow" },
        { from: "anon",      quote: "watching this is therapy + dinner.",  color: "teal" },
      ] },
  ],

  zerogpete: [
    { id: "zp-ann", kind: "announcement", color: "yellow", title: "rocket #13 launches saturday",
      body: "we hit 60 SPM on yellow science. now we go big. spaghetti not included (it is)." },
    { id: "zp-cd", kind: "countdown", title: "launch in", label: "rocket #13", targetISO: inDays(5) },
    { id: "zp-faq", kind: "faq", title: "factory FAQ",
      items: [
        { q: "main bus or city block?", a: "yes." },
        { q: "what mods are you running?", a: "vanilla + alien biomes + a lot of patience." },
      ] },
    { id: "zp-soc", kind: "socials", title: "outposts",
      items: [
        { platform: "twitch",  handle: "zerogpete", url: "https://twitch.tv/" },
        { platform: "youtube", handle: "@zerogpete", url: "https://youtube.com/" },
        { platform: "discord", handle: "the spaghetti server", url: "https://discord.gg/" },
      ] },
  ],

  polaroid_kid: [
    { id: "pk-ann", kind: "announcement", color: "pink", title: "night walk: chinatown",
      body: "sunday 9pm. film camera only. if you tip you can pick a corner i have to shoot." },
    { id: "pk-gal", kind: "gallery", title: "this week's roll",
      items: [
        { emoji: "📷", caption: "alley #4",   hue: 320 },
        { emoji: "🌃", caption: "neon laundry", hue: 280 },
        { emoji: "🍕", caption: "2am slice",  hue: 30  },
        { emoji: "🐈", caption: "bodega cat", hue: 60  },
      ] },
    { id: "pk-soc", kind: "socials", title: "where the photos live",
      items: [
        { platform: "instagram", handle: "@polaroid_kid", url: "https://instagram.com/" },
        { platform: "tiktok",    handle: "@polaroid_kid", url: "https://tiktok.com/" },
      ] },
    { id: "pk-test", kind: "testimonials", title: "the people responded",
      items: [
        { from: "miso",   quote: "the dumpster pic is genuinely a masterpiece.", color: "pink" },
        { from: "anon",   quote: "tipped for a roll of film. they sent me a print. legend.", color: "yellow" },
      ] },
  ],
};