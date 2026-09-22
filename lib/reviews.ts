/**
 * Real App Store reviews, fetched 2026-09-22 from Apple's public RSS feed:
 * https://itunes.apple.com/us/rss/customerreviews/id=6747948555/sortby=mostrecent/json
 * Text is verbatim (trimmed to the first sentences). Only 4- and 5-star written reviews are shown.
 * Empty this array to omit the Reviews section.
 */
export type Review = { name: string; platform: "App Store" | "Google Play"; stars: 4 | 5; title: string; text: string; date: string };
export const reviews: Review[] = [
  { name: "Kari Ocie", platform: "App Store", stars: 5, title: "Quick notes after meetings", text: "I just talk through the main points while walking back to my desk and it turns into clean text I can paste into my planner.", date: "2026-04-07" },
  { name: "Harris_Harolde", platform: "App Store", stars: 5, title: "Turning thoughts into text", text: "Seeing my scattered thoughts turned into readable text actually helps me sort things out.", date: "2026-04-07" },
  { name: "worden lauryn", platform: "App Store", stars: 5, title: "Great for long drives", text: "I just spoke naturally and let it convert to text. When I got home, all my thoughts were saved and organized enough to work with.", date: "2026-04-06" },
  { name: "Pryor Pickens", platform: "App Store", stars: 5, title: "Quick meeting notes tool", text: "I just set my phone down and let it record while I talk or when others are sharing updates. It saves me from missing small details.", date: "2026-04-06" },
  { name: "Claudine Kinder", platform: "App Store", stars: 4, title: "Quick Voice Memos on Walks", text: "I just talk and it turns my thoughts into text I can review later. Way better than trying to type while moving.", date: "2026-04-09" },
  { name: "Joe Naridated", platform: "App Store", stars: 4, title: "Helps during busy meetings", text: "It catches most of what’s said, even when people talk quickly. Saves me from missing small details.", date: "2026-04-08" },
  { name: "Liliana_Piay", platform: "App Store", stars: 4, title: "Hands-free grocery lists", text: "Now I just speak my grocery list out loud and it shows up as text. Super convenient when my hands are busy.", date: "2026-04-08" },
];
