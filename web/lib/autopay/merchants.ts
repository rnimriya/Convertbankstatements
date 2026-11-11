/**
 * AutoPay Khoj — Merchant Dictionary (Day 1: 156 merchants,
 * Day 2: expanded to 300, Day 7 gate: +NYTimes = 301 — 2026-11-11)
 *
 * Purpose: turn raw bank-statement narrations like
 *   "UPI/NETFLIX/9876543210/YESB" or "MANDATE/SPOTIFY INDIA/HDFC"
 * into a clean merchant name + category, so the recurrence engine
 * (Day 3) can group charges and the report can speak human language.
 *
 * Rules baked into this file:
 *  - Patterns are UPPERCASE substrings as they appear in real statement
 *    narrations (Indian + global banks). Matching is case-insensitive
 *    substring, LONGEST pattern first — so "JIOHOTSTAR" wins over "JIO"
 *    and "AMAZON PRIME" wins over "AMAZON".
 *  - amountRange is a BROAD sanity band for the merchant's common plans
 *    (used by the engine only to raise/lower confidence — never shown to
 *    the user as the merchant's price). Prices change; bands are wide
 *    on purpose.
 *  - Generic recurring debits that are NOT a single merchant — bank loan
 *    EMIs ("EMI", "LOAN"), NACH mandates with lender names, salary etc. —
 *    are deliberately NOT faked as merchants here. The Day-3 engine
 *    handles them as generic patterns separately.
 *  - No bank login, no mandate access: this dictionary only READS the
 *    statement the user already uploaded to ConvertStatement.
 */

export type AutopayCategory =
  | "OTT Video"
  | "Music & Audio"
  | "Telecom & Broadband"
  | "Software, Cloud & AI"
  | "Food & Shopping Membership"
  | "Fitness & Health"
  | "Insurance"
  | "Investments & Finance"
  | "Utilities"
  | "Education"
  | "News & Reading"
  | "Gaming";

export type PaymentRail =
  | "upi"
  | "card"
  | "nach"
  | "play-store"
  | "app-store"
  | "netbanking"
  | "wallet";

export type BillingCycle = "monthly" | "quarterly" | "half-yearly" | "yearly";

export interface AutopayMerchant {
  /** Stable slug — used in cancel-guide URLs: /autopay-audit/cancel/<id> */
  id: string;
  /** Clean display name shown in the audit report. */
  name: string;
  /** UPPERCASE narration substrings that identify this merchant. */
  patterns: string[];
  category: AutopayCategory;
  /** IN = India-specific, GLOBAL = sold worldwide, US = US-specific. */
  market: "IN" | "GLOBAL" | "US";
  currency: "INR" | "USD";
  /** Broad [min, max] band of common plan prices — confidence signal only. */
  amountRange: [number, number];
  cycles: BillingCycle[];
  /** Rails this merchant commonly charges through. */
  rails: PaymentRail[];
  /** Known for free-trial → paid conversion (engine watches the first charge). */
  trialProne?: boolean;
}

export const AUTOPAY_MERCHANTS: AutopayMerchant[] = [
  // ── OTT Video (16) ──────────────────────────────────────────────────
  { id: "netflix", name: "Netflix", patterns: ["NETFLIX"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [149, 649], cycles: ["monthly"], rails: ["upi", "card", "play-store", "app-store"], trialProne: true },
  { id: "amazon-prime", name: "Amazon Prime", patterns: ["AMAZON PRIME", "AMZN PRIME", "PRIME VIDEO", "AMAZONPRIME"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [179, 1499], cycles: ["monthly", "yearly"], rails: ["upi", "card"], trialProne: true },
  { id: "jiohotstar", name: "JioHotstar", patterns: ["JIOHOTSTAR", "JIO HOTSTAR", "DISNEY+ HOTSTAR", "DISNEY HOTSTAR", "HOTSTAR"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [49, 1499], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store", "app-store"] },
  { id: "zee5", name: "ZEE5", patterns: ["ZEE5", "ZEE ENTERTAINMENT"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 1199], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"] },
  { id: "sonyliv", name: "Sony LIV", patterns: ["SONYLIV", "SONY LIV", "SONY PICTURES NETWORKS"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 1499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"] },
  { id: "youtube-premium", name: "YouTube Premium", patterns: ["YOUTUBE PREMIUM", "YOUTUBEPRM", "GOOGLE YOUTUBE"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [79, 1499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"], trialProne: true },
  { id: "apple-tv-plus", name: "Apple TV+", patterns: ["APPLE TV"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [99, 999], cycles: ["monthly", "yearly"], rails: ["app-store", "card"], trialProne: true },
  { id: "jiocinema", name: "JioCinema Premium", patterns: ["JIOCINEMA", "JIO CINEMA"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [29, 599], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "aha", name: "aha Video", patterns: ["AHA VIDEO", "ARGHA MEDIA"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 899], cycles: ["quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "sun-nxt", name: "Sun NXT", patterns: ["SUNNXT", "SUN NXT", "SUN TV NETWORK"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [50, 799], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "lionsgate-play", name: "Lionsgate Play", patterns: ["LIONSGATE"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [99, 699], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "crunchyroll", name: "Crunchyroll", patterns: ["CRUNCHYROLL"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [79, 999], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "mubi", name: "MUBI", patterns: ["MUBI"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [199, 1999], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "hoichoi", name: "hoichoi", patterns: ["HOICHOI"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [149, 899], cycles: ["quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "discovery-plus", name: "discovery+", patterns: ["DISCOVERY PLUS", "DISCOVERY+"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [99, 499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "paramount-plus", name: "Paramount+", patterns: ["PARAMOUNT"], category: "OTT Video", market: "US", currency: "USD", amountRange: [6, 14], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },

  // ── Music & Audio (12) ──────────────────────────────────────────────
  { id: "spotify", name: "Spotify", patterns: ["SPOTIFY"], category: "Music & Audio", market: "GLOBAL", currency: "INR", amountRange: [29, 149], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"], trialProne: true },
  { id: "apple-music", name: "Apple Music", patterns: ["APPLE MUSIC"], category: "Music & Audio", market: "GLOBAL", currency: "INR", amountRange: [49, 149], cycles: ["monthly"], rails: ["app-store", "card"], trialProne: true },
  { id: "youtube-music", name: "YouTube Music", patterns: ["YOUTUBE MUSIC"], category: "Music & Audio", market: "GLOBAL", currency: "INR", amountRange: [59, 1099], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "jiosaavn", name: "JioSaavn", patterns: ["JIOSAAVN", "SAAVN"], category: "Music & Audio", market: "IN", currency: "INR", amountRange: [49, 749], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"] },
  { id: "gaana", name: "Gaana Plus", patterns: ["GAANA"], category: "Music & Audio", market: "IN", currency: "INR", amountRange: [49, 399], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "amazon-music", name: "Amazon Music", patterns: ["AMAZON MUSIC", "AMAZONMUSIC"], category: "Music & Audio", market: "GLOBAL", currency: "INR", amountRange: [89, 1069], cycles: ["monthly", "yearly"], rails: ["upi", "card"] },
  { id: "audible", name: "Audible", patterns: ["AUDIBLE"], category: "Music & Audio", market: "GLOBAL", currency: "INR", amountRange: [199, 1499], cycles: ["monthly", "yearly"], rails: ["card", "upi"], trialProne: true },
  { id: "pocket-fm", name: "Pocket FM", patterns: ["POCKET FM", "POCKETFM"], category: "Music & Audio", market: "IN", currency: "INR", amountRange: [49, 899], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "play-store"] },
  { id: "kuku-fm", name: "Kuku FM", patterns: ["KUKU FM", "KUKUFM", "MEBIGO LABS"], category: "Music & Audio", market: "IN", currency: "INR", amountRange: [99, 899], cycles: ["monthly", "yearly"], rails: ["upi", "play-store"] },
  { id: "hungama", name: "Hungama Music", patterns: ["HUNGAMA"], category: "Music & Audio", market: "IN", currency: "INR", amountRange: [49, 499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "storytel", name: "Storytel", patterns: ["STORYTEL"], category: "Music & Audio", market: "GLOBAL", currency: "INR", amountRange: [149, 999], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "deezer", name: "Deezer", patterns: ["DEEZER"], category: "Music & Audio", market: "GLOBAL", currency: "USD", amountRange: [5, 15], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },

  // ── Telecom & Broadband (18) ────────────────────────────────────────
  { id: "reliance-jio", name: "Reliance Jio", patterns: ["RELIANCE JIO", "JIO PAYMENT", "JIOPAY", "JIO INFOCOMM", "JIO AUTOPAY", "JIO RECHARGE", "MYJIO"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [19, 3599], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "netbanking", "wallet"] },
  { id: "jiofiber", name: "JioFiber", patterns: ["JIOFIBER", "JIO FIBER"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [399, 8499], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "airtel-xstream", name: "Airtel Xstream Fiber", patterns: ["AIRTEL XSTREAM", "XSTREAM FIBER"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [499, 1599], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "airtel", name: "Bharti Airtel", patterns: ["AIRTEL", "BHARTI AIRTEL"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [19, 3999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "netbanking", "wallet"] },
  { id: "vodafone-idea", name: "Vi (Vodafone Idea)", patterns: ["VODAFONE IDEA", "VODAFONE", "IDEA CELLULAR", "VI POSTPAID", "VI AUTOPAY"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [19, 2999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "netbanking", "wallet"] },
  { id: "bsnl", name: "BSNL", patterns: ["BSNL", "BHARAT SANCHAR"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [49, 1999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "act-fibernet", name: "ACT Fibernet", patterns: ["ACT FIBERNET", "ACTFIBER", "ATRIA CONVERGENCE"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [549, 1499], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "hathway", name: "Hathway Broadband", patterns: ["HATHWAY"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [499, 1299], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "excitel", name: "Excitel Broadband", patterns: ["EXCITEL"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [424, 899], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "spectra", name: "Spectra Broadband", patterns: ["SPECTRA", "CITYCOM NETWORKS"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [749, 1999], cycles: ["monthly", "quarterly"], rails: ["upi", "card", "netbanking"] },
  { id: "you-broadband", name: "YOU Broadband", patterns: ["YOU BROADBAND", "YOU TELECOM"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [499, 1299], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "tata-play", name: "Tata Play", patterns: ["TATA PLAY", "TATAPLAY", "TATA SKY"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [99, 3599], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "netbanking", "wallet"] },
  { id: "dish-tv", name: "Dish TV / d2h", patterns: ["DISH TV", "DISHTV", "D2H LIMITED", "VIDEOCON D2H"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [99, 2999], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "sun-direct", name: "Sun Direct", patterns: ["SUN DIRECT", "SUNDIRECT"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [59, 1999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card"] },
  { id: "airtel-digital-tv", name: "Airtel Digital TV", patterns: ["AIRTEL DIGITAL TV", "AIRTEL DTH"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [99, 2999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "wallet"] },
  { id: "mtnl", name: "MTNL", patterns: ["MTNL", "MAHANAGAR TELEPHONE"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [199, 1499], cycles: ["monthly", "quarterly"], rails: ["upi", "netbanking"] },
  { id: "railwire", name: "RailWire Broadband", patterns: ["RAILWIRE", "RAILTEL"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [399, 1499], cycles: ["monthly", "quarterly"], rails: ["upi", "card", "netbanking"] },
  { id: "den-broadband", name: "DEN / Local Cable Broadband", patterns: ["DEN NETWORKS", "DEN BROADBAND"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [399, 1499], cycles: ["monthly", "quarterly"], rails: ["upi", "card"] },

  // ── Software, Cloud & AI (28) ───────────────────────────────────────
  { id: "google-one", name: "Google One", patterns: ["GOOGLE ONE", "GOOGLE *ONE", "GOOGLEONE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [35, 1300], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"], trialProne: true },
  { id: "icloud-plus", name: "iCloud+", patterns: ["ICLOUD", "APPLE ICLOUD"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [75, 749], cycles: ["monthly"], rails: ["app-store", "card"] },
  { id: "microsoft-365", name: "Microsoft 365", patterns: ["MICROSOFT 365", "MICROSOFT365", "MSFT *365", "MICROSOFT *OFFICE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [489, 9199], cycles: ["monthly", "yearly"], rails: ["card", "upi"], trialProne: true },
  { id: "dropbox", name: "Dropbox", patterns: ["DROPBOX"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [10, 20], cycles: ["monthly", "yearly"], rails: ["card", "app-store", "play-store"], trialProne: true },
  { id: "adobe", name: "Adobe Creative Cloud", patterns: ["ADOBE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [423, 6834], cycles: ["monthly", "yearly"], rails: ["card", "upi"], trialProne: true },
  { id: "canva", name: "Canva Pro", patterns: ["CANVA"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [299, 3999], cycles: ["monthly", "yearly"], rails: ["card", "upi", "play-store", "app-store"], trialProne: true },
  { id: "chatgpt", name: "ChatGPT Plus (OpenAI)", patterns: ["OPENAI", "CHATGPT"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [1699, 1999], cycles: ["monthly"], rails: ["card", "app-store", "play-store"] },
  { id: "claude", name: "Claude Pro (Anthropic)", patterns: ["ANTHROPIC", "CLAUDE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [17, 25], cycles: ["monthly", "yearly"], rails: ["card", "app-store", "play-store"] },
  { id: "google-ai-pro", name: "Google AI Pro (Gemini)", patterns: ["GOOGLE GEMINI", "GEMINI ADVANCED", "GOOGLE AI"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [650, 1950], cycles: ["monthly"], rails: ["card", "play-store"], trialProne: true },
  { id: "perplexity", name: "Perplexity Pro", patterns: ["PERPLEXITY"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [17, 20], cycles: ["monthly", "yearly"], rails: ["card", "app-store", "play-store"] },
  { id: "notion", name: "Notion", patterns: ["NOTION"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [8, 20], cycles: ["monthly", "yearly"], rails: ["card", "app-store", "play-store"], trialProne: true },
  { id: "zoom", name: "Zoom Workplace", patterns: ["ZOOM.US", "ZOOM VIDEO", "ZOOM SUBSCRIPTION"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [1080, 1750], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "grammarly", name: "Grammarly", patterns: ["GRAMMARLY"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [12, 30], cycles: ["monthly", "quarterly", "yearly"], rails: ["card", "play-store"], trialProne: true },
  { id: "linkedin-premium", name: "LinkedIn Premium", patterns: ["LINKEDIN"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [1100, 5400], cycles: ["monthly", "yearly"], rails: ["card", "upi", "app-store", "play-store"], trialProne: true },
  { id: "x-premium", name: "X Premium (Twitter)", patterns: ["TWITTER", "X CORP", "X.COM", "TWITTER PREMIUM"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [215, 900], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "telegram-premium", name: "Telegram Premium", patterns: ["TELEGRAM"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [179, 299], cycles: ["monthly", "yearly"], rails: ["play-store", "app-store", "card"] },
  { id: "nordvpn", name: "NordVPN", patterns: ["NORDVPN", "NORD VPN"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [4, 15], cycles: ["monthly", "yearly"], rails: ["card", "play-store"], trialProne: true },
  { id: "expressvpn", name: "ExpressVPN", patterns: ["EXPRESSVPN", "EXPRESS VPN"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [7, 13], cycles: ["monthly", "half-yearly", "yearly"], rails: ["card", "play-store"] },
  { id: "surfshark", name: "Surfshark VPN", patterns: ["SURFSHARK"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [2, 11], cycles: ["monthly", "yearly"], rails: ["card", "play-store"], trialProne: true },
  { id: "password-manager-1", name: "1Password", patterns: ["1PASSWORD", "AGILEBITS"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [3, 8], cycles: ["monthly", "yearly"], rails: ["card", "app-store", "play-store"] },
  { id: "lastpass", name: "LastPass", patterns: ["LASTPASS", "LOGMEIN"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [3, 7], cycles: ["monthly", "yearly"], rails: ["card", "play-store"], trialProne: true },
  { id: "evernote", name: "Evernote", patterns: ["EVERNOTE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [11, 18], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "apple-one", name: "Apple One", patterns: ["APPLE ONE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [195, 365], cycles: ["monthly"], rails: ["app-store", "card"], trialProne: true },
  { id: "github", name: "GitHub", patterns: ["GITHUB"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [4, 21], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "figma", name: "Figma", patterns: ["FIGMA"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [5, 75], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "slack", name: "Slack", patterns: ["SLACK TECHNOLOGIES", "SLACK.COM"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [7, 15], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "shopify", name: "Shopify", patterns: ["SHOPIFY"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [1499, 17500], cycles: ["monthly", "yearly"], rails: ["card", "upi"], trialProne: true },
  { id: "google-play-subscriptions", name: "Google Play (App Subscriptions)", patterns: ["GOOGLE PLAY", "GOOGLE *PLAY"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [10, 5000], cycles: ["monthly", "yearly"], rails: ["play-store", "upi", "card"] },

  // ── Food & Shopping Membership (8) ──────────────────────────────────
  { id: "swiggy-one", name: "Swiggy One", patterns: ["SWIGGY ONE", "BUNDL TECHNOLOGIES"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 1499], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "zomato-gold", name: "Zomato Gold", patterns: ["ZOMATO GOLD", "ZOMATO MEMBERSHIP"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "zepto-pass", name: "Zepto Pass / Daily", patterns: ["ZEPTO"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [25, 299], cycles: ["monthly"], rails: ["upi", "card", "play-store"] },
  { id: "bigbasket-bbstar", name: "BigBasket bbstar", patterns: ["BIGBASKET", "INNOVATIVE RETAIL", "BBSTAR", "BB STAR"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 599], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card"] },
  { id: "milkbasket", name: "Milkbasket", patterns: ["MILKBASKET", "AAIDEA SOLUTIONS"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [199, 2999], cycles: ["monthly"], rails: ["upi", "card", "wallet"] },
  { id: "country-delight", name: "Country Delight", patterns: ["COUNTRY DELIGHT"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [199, 4999], cycles: ["monthly"], rails: ["upi", "card", "wallet"] },
  { id: "uber-one", name: "Uber One", patterns: ["UBER ONE", "UBER MEMBERSHIP"], category: "Food & Shopping Membership", market: "GLOBAL", currency: "INR", amountRange: [149, 1499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"], trialProne: true },
  { id: "freshtohome", name: "FreshToHome Membership", patterns: ["FRESHTOHOME", "FRESH TO HOME"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 999], cycles: ["monthly", "yearly"], rails: ["upi", "card"] },

  // ── Fitness & Health (10) ───────────────────────────────────────────
  { id: "cultpass", name: "cultpass (Cult.fit)", patterns: ["CULTPASS", "CULT.FIT", "CULTFIT", "CUREFIT"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [999, 25999], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "play-store", "app-store"] },
  { id: "healthifyme", name: "HealthifyMe", patterns: ["HEALTHIFYME", "HEALTHIFY"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [699, 4999], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "play-store"], trialProne: true },
  { id: "practo-prime", name: "Practo", patterns: ["PRACTO"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [99, 2499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "apollo-247", name: "Apollo 24|7 Circle", patterns: ["APOLLO 24", "APOLLO247", "APOLLO PHARMACY"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [99, 499], cycles: ["monthly", "half-yearly", "yearly"], rails: ["upi", "card"] },
  { id: "tata-1mg", name: "Tata 1mg Care Plan", patterns: ["TATA 1MG", "1MG TECHNOLOGIES", "1MG.COM"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [99, 499], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card"] },
  { id: "pharmeasy-plus", name: "PharmEasy Plus", patterns: ["PHARMEASY"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [99, 399], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card"] },
  { id: "medibuddy", name: "MediBuddy", patterns: ["MEDIBUDDY"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [299, 2999], cycles: ["yearly"], rails: ["upi", "card"] },
  { id: "anytime-fitness", name: "Anytime Fitness", patterns: ["ANYTIME FITNESS"], category: "Fitness & Health", market: "GLOBAL", currency: "INR", amountRange: [1500, 25000], cycles: ["monthly", "yearly"], rails: ["nach", "card", "upi"] },
  { id: "golds-gym", name: "Gold's Gym", patterns: ["GOLD'S GYM", "GOLDS GYM"], category: "Fitness & Health", market: "GLOBAL", currency: "INR", amountRange: [2000, 30000], cycles: ["monthly", "quarterly", "yearly"], rails: ["nach", "card", "upi"] },
  { id: "fitpass", name: "FITPASS", patterns: ["FITPASS"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [999, 8999], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["upi", "card", "play-store"] },

  // ── Insurance (12) ──────────────────────────────────────────────────
  { id: "lic", name: "LIC of India", patterns: ["LIC OF INDIA", "LIC PREMIUM", "LIFE INSURANCE CORPORATION"], category: "Insurance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi"] },
  { id: "hdfc-life", name: "HDFC Life", patterns: ["HDFC LIFE"], category: "Insurance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "icici-pru-life", name: "ICICI Prudential Life", patterns: ["ICICI PRUDENTIAL", "ICICI PRU LIFE", "ICICI PRULIFE"], category: "Insurance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "sbi-life", name: "SBI Life", patterns: ["SBI LIFE"], category: "Insurance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi"] },
  { id: "max-life", name: "Axis Max Life Insurance", patterns: ["MAX LIFE", "AXIS MAX LIFE"], category: "Insurance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "bajaj-allianz", name: "Bajaj Allianz", patterns: ["BAJAJ ALLIANZ"], category: "Insurance", market: "IN", currency: "INR", amountRange: [300, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "tata-aia", name: "Tata AIA Life", patterns: ["TATA AIA"], category: "Insurance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly", "quarterly", "half-yearly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "star-health", name: "Star Health Insurance", patterns: ["STAR HEALTH"], category: "Insurance", market: "IN", currency: "INR", amountRange: [1000, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "niva-bupa", name: "Niva Bupa Health", patterns: ["NIVA BUPA", "MAX BUPA"], category: "Insurance", market: "IN", currency: "INR", amountRange: [1000, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "care-health", name: "Care Health Insurance", patterns: ["CARE HEALTH", "RELIGARE HEALTH"], category: "Insurance", market: "IN", currency: "INR", amountRange: [1000, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "hdfc-ergo", name: "HDFC Ergo", patterns: ["HDFC ERGO"], category: "Insurance", market: "IN", currency: "INR", amountRange: [300, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "icici-lombard", name: "ICICI Lombard", patterns: ["ICICI LOMBARD"], category: "Insurance", market: "IN", currency: "INR", amountRange: [300, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },

  // ── Investments & Finance (12) ──────────────────────────────────────
  { id: "cams-sip", name: "Mutual Fund SIP (CAMS)", patterns: ["CAMS", "COMPUTER AGE MANAGEMENT"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly", "quarterly"], rails: ["nach", "netbanking", "upi"] },
  { id: "kfintech-sip", name: "Mutual Fund SIP (KFintech)", patterns: ["KFINTECH", "KFIN TECHNOLOGIES", "KARVY FINTECH"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly", "quarterly"], rails: ["nach", "netbanking", "upi"] },
  { id: "iccl-mf", name: "Mutual Fund SIP (ICCL / BSE Star MF)", patterns: ["ICCL", "INDIAN CLEARING CORPORATION"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly", "quarterly"], rails: ["nach", "netbanking"] },
  { id: "zerodha", name: "Zerodha", patterns: ["ZERODHA"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking", "nach"] },
  { id: "groww", name: "Groww", patterns: ["GROWW", "NEXTBILLION"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking", "nach"] },
  { id: "upstox", name: "Upstox", patterns: ["UPSTOX", "RKSV SECURITIES"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking", "nach"] },
  { id: "angel-one", name: "Angel One", patterns: ["ANGEL ONE", "ANGEL BROKING"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking", "nach"] },
  { id: "bajaj-finserv", name: "Bajaj Finserv / Finance EMI", patterns: ["BAJAJ FINSERV", "BAJAJ FINANCE"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [500, 200000], cycles: ["monthly"], rails: ["nach", "netbanking"] },
  { id: "tata-capital", name: "Tata Capital", patterns: ["TATA CAPITAL"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [500, 300000], cycles: ["monthly"], rails: ["nach", "netbanking"] },
  { id: "home-credit", name: "Home Credit India", patterns: ["HOME CREDIT"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [500, 100000], cycles: ["monthly"], rails: ["nach", "upi"] },
  { id: "policybazaar", name: "Policybazaar", patterns: ["POLICYBAZAAR", "PB FINTECH"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [300, 100000], cycles: ["monthly", "yearly"], rails: ["upi", "card", "nach"] },
  { id: "etmoney", name: "ET Money", patterns: ["ETMONEY", "ET MONEY"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["nach", "upi", "netbanking"] },

  // ── Utilities (12) ──────────────────────────────────────────────────
  { id: "tata-power", name: "Tata Power", patterns: ["TATA POWER", "TATAPOWER"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "adani-electricity", name: "Adani Electricity", patterns: ["ADANI ELECTRICITY", "ADANI ENERGY"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "msedcl", name: "MSEDCL (Mahavitaran)", patterns: ["MSEDCL", "MAHAVITARAN", "MAHADISCOM"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "bescom", name: "BESCOM", patterns: ["BESCOM", "BANGALORE ELECTRICITY"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "bses", name: "BSES (Delhi Power)", patterns: ["BSES"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "tangedco", name: "TANGEDCO (TNEB)", patterns: ["TANGEDCO", "TNEB", "TAMIL NADU ELECTRICITY"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "uppcl", name: "UPPCL (UP Power)", patterns: ["UPPCL", "UTTAR PRADESH POWER"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "mahanagar-gas", name: "Mahanagar Gas (MGL)", patterns: ["MAHANAGAR GAS", "MGL GAS"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 10000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "igl", name: "Indraprastha Gas (IGL)", patterns: ["INDRAPRASTHA GAS", "IGL GAS"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 10000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "hp-gas", name: "HP Gas / LPG", patterns: ["HP GAS", "HINDUSTAN PETROLEUM GAS", "HPCL GAS"], category: "Utilities", market: "IN", currency: "INR", amountRange: [600, 1200], cycles: ["monthly"], rails: ["upi", "card", "netbanking"] },
  { id: "fastag", name: "NETC FASTag Auto-Recharge", patterns: ["FASTAG", "NETC", "NHAI FASTAG"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 5000], cycles: ["monthly"], rails: ["upi", "nach", "wallet", "netbanking"] },
  { id: "park-plus", name: "Park+", patterns: ["PARKPLUS", "PARK PLUS", "RAPIDPARK"], category: "Utilities", market: "IN", currency: "INR", amountRange: [99, 2999], cycles: ["monthly", "yearly"], rails: ["upi", "card", "wallet"] },

  // ── Education (10) ──────────────────────────────────────────────────
  { id: "unacademy", name: "Unacademy", patterns: ["UNACADEMY", "SORTING HAT TECHNOLOGIES"], category: "Education", market: "IN", currency: "INR", amountRange: [499, 60000], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "nach"] },
  { id: "physics-wallah", name: "Physics Wallah", patterns: ["PHYSICS WALLAH", "PHYSICSWALLAH"], category: "Education", market: "IN", currency: "INR", amountRange: [199, 30000], cycles: ["monthly", "yearly"], rails: ["upi", "card"] },
  { id: "vedantu", name: "Vedantu", patterns: ["VEDANTU"], category: "Education", market: "IN", currency: "INR", amountRange: [499, 60000], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "nach"] },
  { id: "byjus", name: "BYJU'S", patterns: ["BYJUS", "BYJU'S", "THINK AND LEARN"], category: "Education", market: "IN", currency: "INR", amountRange: [1000, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "upi", "card"] },
  { id: "upgrad", name: "upGrad", patterns: ["UPGRAD"], category: "Education", market: "IN", currency: "INR", amountRange: [2000, 200000], cycles: ["monthly", "quarterly"], rails: ["nach", "card", "upi"] },
  { id: "coursera", name: "Coursera", patterns: ["COURSERA"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [39, 59], cycles: ["monthly", "yearly"], rails: ["card", "play-store"], trialProne: true },
  { id: "duolingo", name: "Duolingo Plus", patterns: ["DUOLINGO"], category: "Education", market: "GLOBAL", currency: "INR", amountRange: [179, 1799], cycles: ["monthly", "yearly"], rails: ["play-store", "app-store", "card", "upi"], trialProne: true },
  { id: "simplilearn", name: "Simplilearn", patterns: ["SIMPLILEARN"], category: "Education", market: "GLOBAL", currency: "INR", amountRange: [2000, 150000], cycles: ["monthly", "yearly"], rails: ["nach", "card", "upi"] },
  { id: "scaler", name: "Scaler", patterns: ["SCALER", "INTERVIEWBIT"], category: "Education", market: "IN", currency: "INR", amountRange: [5000, 250000], cycles: ["monthly"], rails: ["nach", "card"] },
  { id: "testbook", name: "Testbook Pass", patterns: ["TESTBOOK"], category: "Education", market: "IN", currency: "INR", amountRange: [49, 899], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store"] },

  // ── News & Reading (6) ──────────────────────────────────────────────
  { id: "kindle-unlimited", name: "Kindle Unlimited", patterns: ["KINDLE UNLIMITED", "KINDLEUNLIMITED"], category: "News & Reading", market: "GLOBAL", currency: "INR", amountRange: [169, 199], cycles: ["monthly"], rails: ["card", "upi"], trialProne: true },
  { id: "times-prime", name: "Times Prime", patterns: ["TIMES PRIME", "TIMESPRIME"], category: "News & Reading", market: "IN", currency: "INR", amountRange: [899, 1499], cycles: ["yearly"], rails: ["upi", "card"] },
  { id: "et-prime", name: "ET Prime", patterns: ["ET PRIME", "ECONOMIC TIMES PRIME"], category: "News & Reading", market: "IN", currency: "INR", amountRange: [1199, 3999], cycles: ["yearly"], rails: ["upi", "card"] },
  { id: "medium", name: "Medium Membership", patterns: ["MEDIUM.COM", "MEDIUM MEMBERSHIP"], category: "News & Reading", market: "GLOBAL", currency: "USD", amountRange: [5, 15], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "substack", name: "Substack", patterns: ["SUBSTACK"], category: "News & Reading", market: "GLOBAL", currency: "USD", amountRange: [5, 30], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "magzter", name: "Magzter Gold", patterns: ["MAGZTER"], category: "News & Reading", market: "GLOBAL", currency: "INR", amountRange: [499, 1999], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store", "app-store"] },

  // ── Gaming (6) ──────────────────────────────────────────────────────
  { id: "xbox-game-pass", name: "Xbox Game Pass", patterns: ["XBOX", "GAME PASS"], category: "Gaming", market: "GLOBAL", currency: "INR", amountRange: [349, 1050], cycles: ["monthly"], rails: ["card", "upi"], trialProne: true },
  { id: "playstation-plus", name: "PlayStation Plus", patterns: ["PLAYSTATION", "PSN", "SONY INTERACTIVE"], category: "Gaming", market: "GLOBAL", currency: "INR", amountRange: [499, 6099], cycles: ["monthly", "quarterly", "yearly"], rails: ["card", "play-store"] },
  { id: "ea-play", name: "EA Play", patterns: ["EA PLAY", "ELECTRONIC ARTS"], category: "Gaming", market: "GLOBAL", currency: "INR", amountRange: [79, 1999], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "discord-nitro", name: "Discord Nitro", patterns: ["DISCORD"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [3, 10], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "apple-arcade", name: "Apple Arcade", patterns: ["APPLE ARCADE"], category: "Gaming", market: "GLOBAL", currency: "INR", amountRange: [99, 999], cycles: ["monthly", "yearly"], rails: ["app-store", "card"], trialProne: true },
  { id: "google-play-pass", name: "Google Play Pass", patterns: ["PLAY PASS", "GOOGLE PLAYPASS"], category: "Gaming", market: "GLOBAL", currency: "INR", amountRange: [99, 899], cycles: ["monthly", "yearly"], rails: ["play-store", "upi"] },

  // ── US-specific recurring (6 of 12 planned; rest land on Day 2) ─────
  { id: "hulu", name: "Hulu", patterns: ["HULU"], category: "OTT Video", market: "US", currency: "USD", amountRange: [8, 26], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "max-hbo", name: "Max (HBO)", patterns: ["HBO MAX", "MAX.COM", "WARNER BROS DISCOVERY"], category: "OTT Video", market: "US", currency: "USD", amountRange: [10, 21], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "peacock", name: "Peacock", patterns: ["PEACOCK", "NBCUNIVERSAL"], category: "OTT Video", market: "US", currency: "USD", amountRange: [8, 14], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "disney-plus-us", name: "Disney+ (US/Global)", patterns: ["DISNEY PLUS", "DISNEYPLUS", "DISNEY+"], category: "OTT Video", market: "US", currency: "USD", amountRange: [8, 24], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "planet-fitness", name: "Planet Fitness", patterns: ["PLANET FITNESS"], category: "Fitness & Health", market: "US", currency: "USD", amountRange: [10, 60], cycles: ["monthly", "yearly"], rails: ["card", "nach"] },
  { id: "peloton", name: "Peloton", patterns: ["PELOTON"], category: "Fitness & Health", market: "US", currency: "USD", amountRange: [13, 44], cycles: ["monthly"], rails: ["card", "app-store", "play-store"], trialProne: true },

  // ── Day 2 expansion: regional OTT (12) ──────────────────────────────
  { id: "etv-win", name: "ETV Win", patterns: ["ETV WIN", "ETVWIN"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 699], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "manoramamax", name: "ManoramaMAX", patterns: ["MANORAMAMAX", "MANORAMA MAX"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [89, 899], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "chaupal", name: "Chaupal", patterns: ["CHAUPAL"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 799], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "stage-app", name: "STAGE", patterns: ["STAGE APP", "STAGEAPP"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 699], cycles: ["monthly", "yearly"], rails: ["upi", "play-store"] },
  { id: "shemaroome", name: "ShemarooMe", patterns: ["SHEMAROO"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [49, 699], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "altt", name: "ALTT", patterns: ["ALTT", "ALTBALAJI", "ALT BALAJI"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [100, 599], cycles: ["monthly", "half-yearly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "planet-marathi", name: "Planet Marathi", patterns: ["PLANET MARATHI"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "tarang-plus", name: "Tarang Plus", patterns: ["TARANG PLUS", "TARANGPLUS"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "viu", name: "Viu", patterns: ["VIU.COM", "PCCW OTT", "VUCLIP"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [99, 599], cycles: ["monthly", "yearly"], rails: ["card", "play-store"] },
  { id: "fancode", name: "FanCode", patterns: ["FANCODE", "FAN CODE", "DREAM SPORTS FANCODE"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [49, 999], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"], trialProne: true },
  { id: "eurosport", name: "Eurosport", patterns: ["EUROSPORT"], category: "OTT Video", market: "GLOBAL", currency: "INR", amountRange: [99, 999], cycles: ["monthly", "yearly"], rails: ["card", "play-store"] },
  { id: "klikk", name: "KLiKK", patterns: ["KLIKK", "ANGEL TELEVISION"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 499], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },

  // ── Day 2 expansion: cable & broadband, more (12) ───────────────────
  { id: "airtel-black", name: "Airtel Black", patterns: ["AIRTEL BLACK"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [799, 2499], cycles: ["monthly"], rails: ["upi", "card", "netbanking"] },
  { id: "tata-play-binge", name: "Tata Play Binge", patterns: ["TATA PLAY BINGE", "TATAPLAY BINGE"], category: "OTT Video", market: "IN", currency: "INR", amountRange: [99, 399], cycles: ["monthly"], rails: ["upi", "card", "play-store"] },
  { id: "tata-play-fiber", name: "Tata Play Fiber", patterns: ["TATA PLAY FIBER", "TATA SKY BROADBAND"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [799, 1799], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "gtpl", name: "GTPL Hathway", patterns: ["GTPL"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [299, 1499], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "siti-networks", name: "SITI Networks", patterns: ["SITI NETWORKS", "SITI CABLE", "SITI BROADBAND"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [299, 1499], cycles: ["monthly", "quarterly"], rails: ["upi", "card"] },
  { id: "asianet", name: "Asianet", patterns: ["ASIANET", "ASIANET BROADBAND", "ASIANET DIGITAL"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [299, 1499], cycles: ["monthly", "quarterly"], rails: ["upi", "card", "netbanking"] },
  { id: "alliance-broadband", name: "Alliance Broadband", patterns: ["ALLIANCE BROADBAND"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [399, 1299], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "kerala-vision", name: "Kerala Vision", patterns: ["KERALA VISION"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [299, 1299], cycles: ["monthly", "quarterly"], rails: ["upi", "card"] },
  { id: "fastway", name: "Fastway Cable", patterns: ["FASTWAY"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [199, 999], cycles: ["monthly", "quarterly"], rails: ["upi", "card"] },
  { id: "netplus", name: "Netplus Broadband", patterns: ["NETPLUS"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [499, 999], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "one-broadband", name: "ONE Broadband", patterns: ["ONE BROADBAND", "HIREACH BROADBAND"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [499, 1299], cycles: ["monthly", "quarterly"], rails: ["upi", "card", "netbanking"] },
  { id: "timbl", name: "Timbl Broadband", patterns: ["TIMBL"], category: "Telecom & Broadband", market: "IN", currency: "INR", amountRange: [599, 1299], cycles: ["monthly", "quarterly", "half-yearly"], rails: ["upi", "card", "netbanking"] },

  // ── Day 2 expansion: US telecom & commerce (12) ─────────────────────
  { id: "xfinity", name: "Xfinity (Comcast)", patterns: ["XFINITY", "COMCAST"], category: "Telecom & Broadband", market: "US", currency: "USD", amountRange: [20, 300], cycles: ["monthly"], rails: ["card", "nach"] },
  { id: "verizon", name: "Verizon", patterns: ["VERIZON"], category: "Telecom & Broadband", market: "US", currency: "USD", amountRange: [30, 250], cycles: ["monthly"], rails: ["card", "nach"] },
  { id: "att", name: "AT&T", patterns: ["AT&T", "ATT*BILL", "ATT PAYMENT"], category: "Telecom & Broadband", market: "US", currency: "USD", amountRange: [30, 250], cycles: ["monthly"], rails: ["card", "nach"] },
  { id: "t-mobile", name: "T-Mobile", patterns: ["T-MOBILE", "TMOBILE"], category: "Telecom & Broadband", market: "US", currency: "USD", amountRange: [30, 200], cycles: ["monthly"], rails: ["card", "nach"] },
  { id: "spectrum", name: "Spectrum (Charter)", patterns: ["SPECTRUM", "CHARTER COMM"], category: "Telecom & Broadband", market: "US", currency: "USD", amountRange: [30, 250], cycles: ["monthly"], rails: ["card", "nach"] },
  { id: "cox", name: "Cox Communications", patterns: ["COX COMMUNICATIONS", "COX CABLE"], category: "Telecom & Broadband", market: "US", currency: "USD", amountRange: [30, 250], cycles: ["monthly"], rails: ["card", "nach"] },
  { id: "dashpass", name: "DoorDash DashPass", patterns: ["DASHPASS", "DOORDASH"], category: "Food & Shopping Membership", market: "US", currency: "USD", amountRange: [5, 10], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "instacart-plus", name: "Instacart+", patterns: ["INSTACART"], category: "Food & Shopping Membership", market: "US", currency: "USD", amountRange: [8, 10], cycles: ["monthly", "yearly"], rails: ["card", "app-store"], trialProne: true },
  { id: "walmart-plus", name: "Walmart+", patterns: ["WALMART PLUS", "WALMART+", "WMT PLUS"], category: "Food & Shopping Membership", market: "US", currency: "USD", amountRange: [13, 98], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "ring-protect", name: "Ring Protect", patterns: ["RING PROTECT", "RING.COM", "RING SUBSCRIPTION"], category: "Software, Cloud & AI", market: "US", currency: "USD", amountRange: [5, 20], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "nest-aware", name: "Google Nest Aware", patterns: ["NEST AWARE", "GOOGLE NEST"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [8, 15], cycles: ["monthly", "yearly"], rails: ["card", "play-store"] },
  { id: "hellofresh", name: "HelloFresh", patterns: ["HELLOFRESH", "HELLO FRESH"], category: "Food & Shopping Membership", market: "US", currency: "USD", amountRange: [40, 150], cycles: ["monthly"], rails: ["card"], trialProne: true },

  // ── Day 2 expansion: fitness, wellness & audio, more (12) ───────────
  { id: "strava", name: "Strava", patterns: ["STRAVA"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [6, 12], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "classpass", name: "ClassPass", patterns: ["CLASSPASS", "CLASS PASS"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [49, 159], cycles: ["monthly"], rails: ["card", "app-store"], trialProne: true },
  { id: "headspace", name: "Headspace", patterns: ["HEADSPACE"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [7, 13], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "calm", name: "Calm", patterns: ["CALM.COM", "CALM APP", "CALM INC"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [7, 15], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "myfitnesspal", name: "MyFitnessPal Premium", patterns: ["MYFITNESSPAL", "MY FITNESS PAL"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [10, 20], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "tidal", name: "TIDAL", patterns: ["TIDAL"], category: "Music & Audio", market: "GLOBAL", currency: "USD", amountRange: [6, 11], cycles: ["monthly"], rails: ["card", "play-store", "app-store"], trialProne: true },
  { id: "chess-com", name: "Chess.com Membership", patterns: ["CHESS.COM", "CHESS COM", "CHESSABLE"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [5, 17], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "nintendo-online", name: "Nintendo Switch Online", patterns: ["NINTENDO"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [4, 50], cycles: ["monthly", "quarterly", "yearly"], rails: ["card"] },
  { id: "ubisoft-plus", name: "Ubisoft+", patterns: ["UBISOFT"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [8, 18], cycles: ["monthly"], rails: ["card"] },
  { id: "roblox-premium", name: "Roblox Premium", patterns: ["ROBLOX"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [5, 20], cycles: ["monthly"], rails: ["card", "play-store", "app-store"] },
  { id: "minecraft-realms", name: "Minecraft Realms", patterns: ["MINECRAFT", "MOJANG", "REALMS"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [4, 8], cycles: ["monthly"], rails: ["card", "play-store", "app-store"] },
  { id: "twitch-turbo", name: "Twitch Turbo / Subs", patterns: ["TWITCH"], category: "Gaming", market: "GLOBAL", currency: "USD", amountRange: [5, 12], cycles: ["monthly"], rails: ["card", "app-store"] },

  // ── Day 2 expansion: business software (24) ─────────────────────────
  { id: "google-workspace", name: "Google Workspace", patterns: ["GOOGLE WORKSPACE", "GSUITE", "GOOGLE *GSUITE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [400, 3500], cycles: ["monthly", "yearly"], rails: ["card", "upi"] },
  { id: "zoho", name: "Zoho", patterns: ["ZOHO"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [399, 5000], cycles: ["monthly", "yearly"], rails: ["card", "upi"] },
  { id: "tally", name: "Tally (TallyPrime)", patterns: ["TALLY SOLUTIONS", "TALLYPRIME", "TALLY PRIME", "TALLY ERP"], category: "Software, Cloud & AI", market: "IN", currency: "INR", amountRange: [600, 54000], cycles: ["monthly", "yearly"], rails: ["netbanking", "card", "upi"] },
  { id: "quickbooks", name: "QuickBooks (Intuit)", patterns: ["QUICKBOOKS", "INTUIT QUICKBOOKS", "INTUIT QB"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [11, 275], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "freshdesk", name: "Freshworks / Freshdesk", patterns: ["FRESHWORKS", "FRESHDESK"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [899, 8999], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "freshbooks", name: "FreshBooks", patterns: ["FRESHBOOKS"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [10, 70], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "salesforce", name: "Salesforce", patterns: ["SALESFORCE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [25, 325], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "hubspot", name: "HubSpot", patterns: ["HUBSPOT"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [15, 1200], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "mailchimp", name: "Mailchimp", patterns: ["MAILCHIMP"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [13, 350], cycles: ["monthly"], rails: ["card"], trialProne: true },
  { id: "semrush", name: "Semrush", patterns: ["SEMRUSH"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [117, 500], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "ahrefs", name: "Ahrefs", patterns: ["AHREFS"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [99, 999], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "wix", name: "Wix Premium", patterns: ["WIX.COM", "WIX PREMIUM"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [500, 3000], cycles: ["monthly", "yearly"], rails: ["card", "upi"] },
  { id: "squarespace", name: "Squarespace", patterns: ["SQUARESPACE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [16, 49], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "godaddy", name: "GoDaddy", patterns: ["GODADDY", "GO DADDY"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [99, 9999], cycles: ["monthly", "yearly"], rails: ["card", "upi", "netbanking"] },
  { id: "hostinger", name: "Hostinger", patterns: ["HOSTINGER"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [149, 9999], cycles: ["monthly", "yearly"], rails: ["card", "upi", "netbanking"] },
  { id: "namecheap", name: "Namecheap", patterns: ["NAMECHEAP"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [5, 200], cycles: ["yearly"], rails: ["card"] },
  { id: "cloudflare", name: "Cloudflare", patterns: ["CLOUDFLARE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [5, 250], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "digitalocean", name: "DigitalOcean", patterns: ["DIGITALOCEAN", "DIGITAL OCEAN"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [4, 500], cycles: ["monthly"], rails: ["card"] },
  { id: "aws", name: "Amazon Web Services (AWS)", patterns: ["AMAZON WEB SERVICES", "AWS.AMAZON", "AMAZON AWS", "AWS INDIA", "AWS EMEA", "AWS BILLING"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [1, 10000], cycles: ["monthly"], rails: ["card"] },
  { id: "azure", name: "Microsoft Azure", patterns: ["MICROSOFT AZURE", "MSFT AZURE", "AZURE SERVICES"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [1, 10000], cycles: ["monthly"], rails: ["card"] },
  { id: "atlassian", name: "Atlassian (Jira/Confluence)", patterns: ["ATLASSIAN", "JIRA", "CONFLUENCE"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [7, 150], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "asana", name: "Asana", patterns: ["ASANA"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [11, 31], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "monday", name: "monday.com", patterns: ["MONDAY.COM", "MONDAY COM"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [9, 30], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "zapier", name: "Zapier", patterns: ["ZAPIER"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [20, 600], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },

  // ── Day 2 expansion: AI tools (12) ──────────────────────────────────
  { id: "midjourney", name: "Midjourney", patterns: ["MIDJOURNEY"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [10, 120], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "elevenlabs", name: "ElevenLabs", patterns: ["ELEVENLABS", "ELEVEN LABS"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [5, 330], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "runway", name: "Runway", patterns: ["RUNWAYML", "RUNWAY AI", "RUNWAYML.COM"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [12, 95], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "heygen", name: "HeyGen", patterns: ["HEYGEN", "HEY GEN"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [24, 149], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "synthesia", name: "Synthesia", patterns: ["SYNTHESIA"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [22, 89], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "leonardo-ai", name: "Leonardo AI", patterns: ["LEONARDO AI", "LEONARDOAI", "LEONARDO.AI"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [10, 60], cycles: ["monthly", "yearly"], rails: ["card", "play-store"] },
  { id: "kling-ai", name: "Kling AI", patterns: ["KLING AI", "KLINGAI"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [7, 92], cycles: ["monthly"], rails: ["card", "play-store"] },
  { id: "luma-ai", name: "Luma AI", patterns: ["LUMA AI", "LUMALABS", "LUMA LABS"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [10, 100], cycles: ["monthly", "yearly"], rails: ["card", "app-store"] },
  { id: "suno", name: "Suno", patterns: ["SUNO AI", "SUNO.COM", "SUNO INC"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [8, 24], cycles: ["monthly", "yearly"], rails: ["card", "app-store"] },
  { id: "capcut", name: "CapCut (Commerce)", patterns: ["CAPCUT", "CAP CUT"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "INR", amountRange: [150, 1800], cycles: ["monthly", "yearly"], rails: ["play-store", "app-store", "card"] },
  { id: "descript", name: "Descript", patterns: ["DESCRIPT"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [12, 50], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "otter-ai", name: "Otter.ai", patterns: ["OTTER.AI", "OTTER AI"], category: "Software, Cloud & AI", market: "GLOBAL", currency: "USD", amountRange: [10, 30], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },

  // ── Day 2 expansion: finance & insurance, more (12) ─────────────────
  { id: "paytm-money", name: "Paytm Money", patterns: ["PAYTM MONEY"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking", "nach"] },
  { id: "kuvera", name: "Kuvera", patterns: ["KUVERA"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["nach", "netbanking", "upi"] },
  { id: "dhan", name: "Dhan", patterns: ["DHANHQ", "MONEYLICIOUS", "DHAN APP"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking"] },
  { id: "fivepaisa", name: "5paisa", patterns: ["5PAISA"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking", "nach"] },
  { id: "fyers", name: "Fyers", patterns: ["FYERS"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["upi", "netbanking"] },
  { id: "motilal-oswal", name: "Motilal Oswal", patterns: ["MOTILAL OSWAL"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 1000000], cycles: ["monthly"], rails: ["nach", "netbanking", "upi"] },
  { id: "kreditbee", name: "KreditBee", patterns: ["KREDITBEE", "FINNOVATION"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [500, 100000], cycles: ["monthly"], rails: ["nach", "upi"] },
  { id: "kissht", name: "Kissht", patterns: ["KISSHT", "ONEMONEY"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [500, 100000], cycles: ["monthly"], rails: ["nach", "upi"] },
  { id: "lazypay", name: "LazyPay", patterns: ["LAZYPAY", "LAZY PAY"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 100000], cycles: ["monthly"], rails: ["nach", "upi"] },
  { id: "slice", name: "slice", patterns: ["SLICE CARD", "SLICEPAY", "GARAGEPRENEURS"], category: "Investments & Finance", market: "IN", currency: "INR", amountRange: [100, 200000], cycles: ["monthly"], rails: ["nach", "upi"] },
  { id: "tata-aig", name: "Tata AIG Insurance", patterns: ["TATA AIG"], category: "Insurance", market: "IN", currency: "INR", amountRange: [300, 100000], cycles: ["monthly", "yearly"], rails: ["nach", "netbanking", "upi", "card"] },
  { id: "acko", name: "ACKO Insurance", patterns: ["ACKO"], category: "Insurance", market: "IN", currency: "INR", amountRange: [300, 100000], cycles: ["monthly", "yearly"], rails: ["upi", "card", "netbanking"] },

  // ── Day 2 expansion: state electricity & water boards (14) ──────────
  { id: "kseb", name: "KSEB (Kerala Electricity)", patterns: ["KSEB", "KERALA STATE ELECTRICITY"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "pspcl", name: "PSPCL (Punjab Power)", patterns: ["PSPCL", "PUNJAB STATE POWER"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "cesc", name: "CESC (Kolkata Power)", patterns: ["CESC LIMITED", "CESC LTD", "CESC KOLKATA"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "wbsedcl", name: "WBSEDCL (West Bengal Power)", patterns: ["WBSEDCL", "WEST BENGAL STATE ELECTRICITY"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "jvvnl", name: "Jaipur Vidyut (JVVNL)", patterns: ["JVVNL", "JAIPUR VIDYUT"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "dhbvn", name: "DHBVN (Haryana Power)", patterns: ["DHBVN", "DAKSHIN HARYANA BIJLI", "UHBVN", "UTTAR HARYANA BIJLI"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "apepdcl", name: "APEPDCL (Andhra Power)", patterns: ["APEPDCL", "APSPDCL", "ANDHRA PRADESH EASTERN POWER", "ANDHRA PRADESH SOUTHERN POWER"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "tgspdcl", name: "TGSPDCL (Telangana Power)", patterns: ["TGSPDCL", "TSSPDCL", "TGNPDCL", "TSNPDCL"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "mp-power", name: "MP Power (MPEB)", patterns: ["MPEB", "MP MADHYA KSHETRA", "MP PASCHIM KSHETRA", "MP POORV KSHETRA", "MPPKVVCL", "MPMKVVCL"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "torrent-power", name: "Torrent Power", patterns: ["TORRENT POWER"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "best-undertaking", name: "BEST (Mumbai Power)", patterns: ["BEST UNDERTAKING"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "gujarat-power", name: "Gujarat Power (PGVCL/DGVCL/MGVCL/UGVCL)", patterns: ["PGVCL", "DGVCL", "MGVCL", "UGVCL"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 50000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "bwssb", name: "BWSSB (Bangalore Water)", patterns: ["BWSSB", "BANGALORE WATER SUPPLY"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 10000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },
  { id: "delhi-jal-board", name: "Delhi Jal Board", patterns: ["DELHI JAL"], category: "Utilities", market: "IN", currency: "INR", amountRange: [100, 10000], cycles: ["monthly"], rails: ["upi", "card", "nach", "netbanking"] },

  // ── Day 2 expansion: education, more (12) ───────────────────────────
  { id: "masterclass", name: "MasterClass", patterns: ["MASTERCLASS", "MASTER CLASS INC"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [10, 15], cycles: ["monthly", "yearly"], rails: ["card", "app-store"], trialProne: true },
  { id: "skillshare", name: "Skillshare", patterns: ["SKILLSHARE"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [14, 32], cycles: ["monthly", "yearly"], rails: ["card", "app-store"], trialProne: true },
  { id: "datacamp", name: "DataCamp", patterns: ["DATACAMP", "DATA CAMP INC"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [13, 33], cycles: ["monthly", "yearly"], rails: ["card"], trialProne: true },
  { id: "codecademy", name: "Codecademy", patterns: ["CODECADEMY", "CODE ACADEMY"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [18, 40], cycles: ["monthly", "yearly"], rails: ["card"] },
  { id: "brilliant", name: "Brilliant", patterns: ["BRILLIANT.ORG", "BRILLIANT ORG"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [13, 25], cycles: ["monthly", "yearly"], rails: ["card", "app-store", "play-store"], trialProne: true },
  { id: "chegg", name: "Chegg", patterns: ["CHEGG"], category: "Education", market: "GLOBAL", currency: "USD", amountRange: [15, 30], cycles: ["monthly"], rails: ["card", "app-store"] },
  { id: "adda247", name: "Adda247", patterns: ["ADDA247", "ADDA 247", "METIS EDUVENTURES"], category: "Education", market: "IN", currency: "INR", amountRange: [99, 4999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "oliveboard", name: "Oliveboard", patterns: ["OLIVEBOARD"], category: "Education", market: "IN", currency: "INR", amountRange: [99, 2999], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "embibe", name: "Embibe", patterns: ["EMBIBE"], category: "Education", market: "IN", currency: "INR", amountRange: [199, 9999], cycles: ["monthly", "yearly"], rails: ["upi", "card"] },
  { id: "doubtnut", name: "Doubtnut", patterns: ["DOUBTNUT"], category: "Education", market: "IN", currency: "INR", amountRange: [99, 4999], cycles: ["monthly", "yearly"], rails: ["upi", "card", "play-store"] },
  { id: "internshala", name: "Internshala Trainings", patterns: ["INTERNSHALA"], category: "Education", market: "IN", currency: "INR", amountRange: [999, 9999], cycles: ["yearly"], rails: ["upi", "card", "netbanking"] },
  { id: "allen-digital", name: "ALLEN Digital", patterns: ["ALLEN CAREER", "ALLEN DIGITAL", "BODHI TREE SYSTEMS"], category: "Education", market: "IN", currency: "INR", amountRange: [999, 100000], cycles: ["monthly", "yearly"], rails: ["upi", "card", "nach"] },

  // ── Day 2 expansion: wearables, rentals & commerce (12) ─────────────
  { id: "fitterfly", name: "Fitterfly", patterns: ["FITTERFLY"], category: "Fitness & Health", market: "IN", currency: "INR", amountRange: [2999, 29999], cycles: ["monthly", "quarterly"], rails: ["upi", "card"] },
  { id: "ultrahuman", name: "Ultrahuman", patterns: ["ULTRAHUMAN"], category: "Fitness & Health", market: "GLOBAL", currency: "INR", amountRange: [299, 3499], cycles: ["monthly", "yearly"], rails: ["card", "upi"] },
  { id: "whoop", name: "WHOOP", patterns: ["WHOOP"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [16, 30], cycles: ["monthly", "yearly"], rails: ["card", "app-store"] },
  { id: "oura", name: "Oura Ring Membership", patterns: ["OURA"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [6, 6], cycles: ["monthly"], rails: ["card", "app-store"] },
  { id: "fitbit-premium", name: "Fitbit Premium", patterns: ["FITBIT"], category: "Fitness & Health", market: "GLOBAL", currency: "INR", amountRange: [129, 899], cycles: ["monthly", "yearly"], rails: ["play-store", "app-store", "card"], trialProne: true },
  { id: "les-mills", name: "LES MILLS+", patterns: ["LES MILLS", "LESMILLS"], category: "Fitness & Health", market: "GLOBAL", currency: "USD", amountRange: [10, 15], cycles: ["monthly", "yearly"], rails: ["card", "app-store"], trialProne: true },
  { id: "blinkit", name: "Blinkit", patterns: ["BLINKIT", "GROFERS"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 999], cycles: ["monthly"], rails: ["upi", "card", "play-store"] },
  { id: "licious", name: "Licious", patterns: ["LICIOUS", "DELIGHTFUL GOURMET"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 399], cycles: ["monthly"], rails: ["upi", "card"] },
  { id: "jiomart", name: "JioMart", patterns: ["JIOMART", "JIO MART"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [99, 999], cycles: ["monthly"], rails: ["upi", "card"] },
  { id: "rentomojo", name: "RentoMojo", patterns: ["RENTOMOJO", "EDUNETWORK"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [299, 9999], cycles: ["monthly"], rails: ["upi", "card", "nach"] },
  { id: "furlenco", name: "Furlenco", patterns: ["FURLENCO", "KIERAYA FURNISHING"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [499, 9999], cycles: ["monthly"], rails: ["upi", "card", "nach"] },
  { id: "cityfurnish", name: "Cityfurnish", patterns: ["CITYFURNISH", "CITY FURNISH"], category: "Food & Shopping Membership", market: "IN", currency: "INR", amountRange: [499, 9999], cycles: ["monthly"], rails: ["upi", "card", "nach"] },

  // ── Day 2 expansion: news & reading, more (10) ──────────────────────
  { id: "bloomberg", name: "Bloomberg", patterns: ["BLOOMBERG"], category: "News & Reading", market: "GLOBAL", currency: "USD", amountRange: [35, 50], cycles: ["monthly", "yearly"], rails: ["card", "app-store"], trialProne: true },
  { id: "wsj", name: "Wall Street Journal", patterns: ["WALL STREET JOURNAL", "DOW JONES", "WSJ.COM"], category: "News & Reading", market: "GLOBAL", currency: "USD", amountRange: [10, 39], cycles: ["monthly", "yearly"], rails: ["card", "app-store"] },
  { id: "the-ken", name: "The Ken", patterns: ["THE KEN", "KEN FOLIO"], category: "News & Reading", market: "IN", currency: "INR", amountRange: [1750, 6500], cycles: ["yearly"], rails: ["upi", "card"] },
  { id: "newslaundry", name: "Newslaundry", patterns: ["NEWSLAUNDRY"], category: "News & Reading", market: "IN", currency: "INR", amountRange: [300, 9000], cycles: ["monthly", "quarterly", "yearly"], rails: ["upi", "card"] },
  { id: "the-hindu", name: "The Hindu e-Paper", patterns: ["THE HINDU", "KASTURI AND SONS"], category: "News & Reading", market: "IN", currency: "INR", amountRange: [199, 1999], cycles: ["monthly", "yearly"], rails: ["upi", "card"] },
  { id: "economist", name: "The Economist", patterns: ["THE ECONOMIST", "ECONOMIST NEWSPAPER"], category: "News & Reading", market: "GLOBAL", currency: "USD", amountRange: [20, 25], cycles: ["monthly", "yearly"], rails: ["card", "app-store"] },
  { id: "nytimes", name: "The New York Times", patterns: ["NYTIMES", "NEW YORK TIMES", "NY TIMES"], category: "News & Reading", market: "US", currency: "USD", amountRange: [2, 30], cycles: ["monthly", "yearly"], rails: ["card", "play-store", "app-store"] },
  { id: "pratilipi", name: "Pratilipi", patterns: ["PRATILIPI"], category: "News & Reading", market: "IN", currency: "INR", amountRange: [49, 499], cycles: ["monthly", "yearly"], rails: ["upi", "play-store"] },
  { id: "siriusxm", name: "SiriusXM", patterns: ["SIRIUSXM", "SIRIUS XM"], category: "Music & Audio", market: "US", currency: "USD", amountRange: [11, 22], cycles: ["monthly", "yearly"], rails: ["card", "app-store"] },
  { id: "pandora", name: "Pandora Plus/Premium", patterns: ["PANDORA"], category: "Music & Audio", market: "US", currency: "USD", amountRange: [5, 11], cycles: ["monthly"], rails: ["card", "play-store", "app-store"] },
  { id: "fubo", name: "Fubo", patterns: ["FUBO", "FUBOTV"], category: "OTT Video", market: "US", currency: "USD", amountRange: [33, 95], cycles: ["monthly"], rails: ["card", "app-store"], trialProne: true },
];

/**
 * Identify the merchant behind a raw statement narration.
 *
 * Matching rule: the LONGEST matching pattern across the whole
 * dictionary wins. That single rule is what stops "JIO" (Reliance Jio)
 * from stealing a "JIOHOTSTAR" narration, "AIRTEL" from stealing
 * "AIRTEL BLACK", "SPECTRA" (broadband) from stealing "SPECTRUM"
 * (US cable), and "AMAZON" shopping from stealing "AMAZON PRIME".
 *
 * Returns null when nothing in the dictionary matches — the engine
 * then treats the charge as an unknown recurring candidate, never
 * as a guessed merchant.
 */
/**
 * Store catch-all buckets (e.g. "GOOGLE PLAY ...") describe the BILLER,
 * not the service. When a narration names both the store and a specific
 * service ("GOOGLE PLAY DUOLINGO"), the service wins — the catch-all is
 * only the answer when no specific merchant matches at all.
 */
const CATCH_ALL_IDS = new Set(["google-play-subscriptions"]);

export function normalizeMerchant(description: string): AutopayMerchant | null {
  if (!description) return null;
  const d = description.toUpperCase();
  let best: AutopayMerchant | null = null;
  let bestLen = 0;
  let catchAll: AutopayMerchant | null = null;
  for (const merchant of AUTOPAY_MERCHANTS) {
    for (const pattern of merchant.patterns) {
      if (!d.includes(pattern)) continue;
      if (CATCH_ALL_IDS.has(merchant.id)) {
        catchAll = merchant;
      } else if (pattern.length > bestLen) {
        best = merchant;
        bestLen = pattern.length;
      }
    }
  }
  return best ?? catchAll;
}

export const AUTOPAY_MERCHANT_COUNT = AUTOPAY_MERCHANTS.length;
