/**
 * AutoPay Khoj — Cancel Guides (Day 2, 2026-11-11)
 *
 * Every guide has TWO halves, and the user must do BOTH:
 *   1. SERVICE cancel — stop the subscription inside the merchant's
 *      own app/website (steps in CANCEL_GUIDES below).
 *   2. MANDATE cancel — stop the money pipe (UPI AutoPay / card
 *      e-mandate / NACH) using the RAIL_GUIDES for the rail the
 *      charge came through.
 * Cancelling only the service can leave the mandate alive; revoking
 * only the mandate can leave dues building up with the merchant.
 * Every guide page must say this, in plain words.
 *
 * Honesty rules for this file:
 *  - Steps are the merchant's real, public cancellation path,
 *    checked against the merchant / platform help pages on
 *    2026-11-11 (Google Play, App Store, Netflix, Spotify and
 *    Amazon paths re-verified that day).
 *  - Menu names change. Where a label varies by app version, the
 *    step lists the common variants instead of pretending one
 *    exact label fits everyone.
 *  - We never claim one-tap cancellation: a UPI mandate can only
 *    be revoked by the user, in their own UPI app, with their PIN.
 */

export interface RailGuide {
  id: string;
  title: string;
  steps: string[];
  note?: string;
}

/** How to kill the money pipe, per payment rail. */
export const RAIL_GUIDES: Record<string, RailGuide> = {
  "upi-gpay": {
    id: "upi-gpay",
    title: "Cancel a UPI AutoPay mandate in Google Pay",
    steps: [
      "Open Google Pay and tap your profile photo (top right).",
      "Tap Autopay (in some versions: Settings → Automatic payments).",
      "Tap the merchant mandate you want to stop.",
      "Tap Cancel mandate / Cancel automatic payment.",
      "Confirm with your UPI PIN. The mandate stops at once.",
    ],
    note: "Google Pay only shows mandates created in Google Pay. Check PhonePe, Paytm and the NPCI portal too.",
  },
  "upi-phonepe": {
    id: "upi-phonepe",
    title: "Cancel a UPI AutoPay mandate in PhonePe",
    steps: [
      "Open PhonePe and tap your profile photo (top left).",
      "Scroll to Payment Management and tap Autopay (or: UPI Mandates).",
      "Tap the merchant mandate you want to stop.",
      "Tap Revoke mandate.",
      "Confirm with your UPI PIN. The mandate stops at once.",
    ],
    note: "PhonePe only shows mandates created in PhonePe. Check your other UPI apps and the NPCI portal too.",
  },
  "upi-paytm": {
    id: "upi-paytm",
    title: "Cancel a UPI AutoPay mandate in Paytm",
    steps: [
      "Open Paytm and tap the profile icon.",
      "Go to UPI & Payment Settings → UPI Automatic Payments (in some versions: Passbook → UPI Autopay).",
      "Tap the merchant mandate you want to stop.",
      "Tap Cancel mandate.",
      "Confirm with your UPI PIN. The mandate stops at once.",
    ],
    note: "Paytm only shows mandates created in Paytm. Check your other UPI apps and the NPCI portal too.",
  },
  "upi-npci": {
    id: "upi-npci",
    title: "See and cancel ALL UPI mandates at the NPCI UPI Help portal",
    steps: [
      "On your phone or computer, open upihelp.npci.org.in (the official NPCI portal).",
      "Log in with the mobile number linked to your bank account and enter the OTP.",
      "Tap Show my AutoPay Mandates — every UPI mandate from every app appears in one list.",
      "Pick the mandate and choose Pause (stop for some time) or Revoke (stop for good).",
      "Finish the confirmation in the UPI app that created the mandate — the portal may show a button to open that app, or a QR code to scan.",
    ],
    note: "This is the government's free portal and it covers UPI mandates only. Card, Play Store, App Store and NACH charges do not appear here — that full picture is what AutoPay Khoj adds.",
  },
  "play-store": {
    id: "play-store",
    title: "Cancel a subscription billed by Google Play",
    steps: [
      "Open the Google Play app and tap your profile icon (top right). Make sure you are signed in to the Google account that pays.",
      "Tap Payments & subscriptions → Subscriptions.",
      "Tap the subscription you want to stop.",
      "Tap Cancel subscription and follow the instructions.",
    ],
    note: "Deleting the app does NOT cancel the subscription (Google says this clearly). You keep access until the end of the period you already paid for. On a computer: play.google.com → Subscriptions → Manage → Cancel subscription.",
  },
  "app-store": {
    id: "app-store",
    title: "Cancel a subscription billed by Apple (App Store)",
    steps: [
      "On your iPhone or iPad, open Settings.",
      "Tap your name at the top.",
      "Tap Subscriptions.",
      "Tap the subscription you want to stop.",
      "Tap Cancel Subscription and confirm (you may need to scroll down to see it).",
    ],
    note: "If there is no Cancel button and you see an expiry date in red, the subscription is already cancelled. Deleting the app does NOT cancel it. You keep access until the end of the paid period.",
  },
  "card-emandate": {
    id: "card-emandate",
    title: "Cancel a card e-mandate (recurring card charge)",
    steps: [
      "First cancel inside the merchant's own app or website, so the merchant stops raising new charges.",
      "Then open your bank's app or net-banking and go to Cards → E-Mandates / Standing Instructions (menu names differ by bank).",
      "Select the merchant mandate and choose Revoke / Delete.",
      "Confirm with the OTP your bank sends.",
      "Check the next statement — the charge must not appear again.",
    ],
    note: "Card charges never appear in UPI apps or the NPCI portal. Your card statement and your bank's e-mandate page are the only full lists.",
  },
  "nach-bank": {
    id: "nach-bank",
    title: "Cancel a NACH mandate (insurance, SIP, EMI auto-debit)",
    steps: [
      "First stop the plan at the source — the insurer, AMC (mutual fund) or lender portal/app — so no new mandate is created.",
      "Then open your bank's app or net-banking and go to Services → NACH / Mandates (menu names differ by bank).",
      "Select the mandate and choose Cancel / Stop.",
      "If your bank app has no such option, submit a mandate-cancellation request at your home branch — banks must accept it.",
      "Keep the confirmation. Check the next due date — no debit should happen.",
    ],
    note: "For a loan EMI, cancelling the mandate does NOT cancel the loan — the EMI is still due and late payment hurts your credit record. Talk to the lender first.",
  },
};

export interface MerchantCancelGuide {
  merchantId: string;
  /** Where the user most likely started this subscription. */
  startedVia: string;
  /** Half 1: stop the service with the merchant. Simple English steps. */
  serviceSteps: string[];
  /** What happens to access after cancelling. */
  afterCancel: string;
  /** Merchant-specific trap, if any. Plain words, no scare tactics. */
  warning?: string;
}

export const CANCEL_GUIDES: MerchantCancelGuide[] = [
  { merchantId: "netflix", startedVia: "Netflix website or app", serviceSteps: ["Open netflix.com in a browser and sign in (the app cannot cancel every plan).", "Tap your profile icon → Account.", "Under Membership & Billing, tap Cancel Membership.", "Tap Finish Cancellation to confirm."], afterCancel: "You can keep watching until the end of the current billing period. Your profiles and history are kept for 10 months if you return.", warning: "If you pay through a mobile operator or a TV bundle, Netflix's account page will name that partner — cancel with the partner instead." },
  { merchantId: "amazon-prime", startedVia: "Amazon website or app", serviceSteps: ["Open amazon.in (or your Amazon site) and sign in.", "Go to Account & Lists → Prime Membership.", "Tap Manage Membership → End Membership.", "Move past the benefit-reminder screens and tap Cancel Membership on the final screen."], afterCancel: "Prime benefits run until the end of the paid period. If you barely used Prime after a renewal, Amazon may offer a refund — check on the same page.", warning: "Ending Prime also ends Prime Video, Prime delivery and Prime Music together — they are one membership." },
  { merchantId: "jiohotstar", startedVia: "JioHotstar app, or bundled with a Jio/Airtel plan", serviceSteps: ["Open the JioHotstar app and sign in.", "Tap your profile → My Subscription (in some versions: Settings → Subscription).", "Tap Cancel / Turn off auto-renew and confirm."], afterCancel: "You keep access until the end of the paid period.", warning: "If Hotstar came free with your Jio or Airtel recharge plan, there is nothing to cancel in the app — it ends with the recharge plan. Only cancel a mandate if money is being charged separately." },
  { merchantId: "spotify", startedVia: "Spotify website (Premium cannot be cancelled inside the app)", serviceSteps: ["Open spotify.com in a browser and log in.", "Open your Account page → Your plan.", "Tap Change plan, scroll down to Spotify Free.", "Tap Cancel Premium and confirm with Yes, cancel."], afterCancel: "Premium runs until the end of the paid period, then your account moves to the free plan. Your playlists and saved music stay.", warning: "If you subscribed through Google Play or Apple, cancel there instead — Spotify's page will tell you who bills you." },
  { merchantId: "youtube-premium", startedVia: "YouTube app or website, or Google Play", serviceSteps: ["Open youtube.com in a browser and sign in.", "Go to youtube.com/paid_memberships.", "Tap your Premium membership → Deactivate.", "Tap Continue to cancel and confirm."], afterCancel: "Premium runs until the end of the paid period. Downloaded videos stop working after that.", warning: "If you bought Premium inside the iPhone app, it is billed by Apple — cancel in iPhone Settings → your name → Subscriptions." },
  { merchantId: "zee5", startedVia: "ZEE5 app or website", serviceSteps: ["Open zee5.com and sign in.", "Go to your profile → My Subscription / Plans.", "Turn off Auto-Renewal, or tap Cancel Subscription and confirm."], afterCancel: "You keep access until the end of the paid period.", warning: "If ZEE5 was billed by Google Play or Apple, cancel in the Play Store / iPhone Subscriptions list — the app alone will not stop those charges." },
  { merchantId: "sonyliv", startedVia: "Sony LIV app or website", serviceSteps: ["Open sonyliv.com and sign in.", "Go to your profile → My Account → Subscription.", "Tap Cancel / turn off auto-renew and confirm."], afterCancel: "You keep access until the end of the paid period.", warning: "Sony LIV bought through a telecom or TV bundle ends with that bundle — cancel there, not in the app." },
  { merchantId: "disney-plus-us", startedVia: "Disney+ website or app", serviceSteps: ["Open disneyplus.com in a browser and log in.", "Go to your profile → Account.", "Under Subscription, select your Disney+ plan.", "Tap Cancel Subscription and confirm."], afterCancel: "You keep access until the end of the billing period.", warning: "If Disney+ is part of a bundle (for example with Hulu or Max), cancelling can change the whole bundle price — read the bundle screen carefully." },
  { merchantId: "hulu", startedVia: "Hulu website", serviceSteps: ["Open hulu.com in a browser and log in.", "Go to your profile → Account.", "Under Your Subscription, tap Cancel.", "Follow the prompts and tap Cancel Subscription to finish (Hulu may first offer a pause)."], afterCancel: "You keep access until the end of the billing period.", warning: "If Hulu is billed through Roku, Apple, Google Play or a Disney bundle, cancel with that biller — Hulu's page shows who bills you." },
  { merchantId: "google-one", startedVia: "Google One app or website", serviceSteps: ["Open one.google.com and sign in with the paying Google account.", "Go to Settings → Cancel membership.", "Tap Cancel membership again to confirm. (In the Google One app: Settings → Membership settings → Cancel.)"], afterCancel: "Extra storage stays until the end of the paid period, then your storage falls back to the free 15 GB. Files are not deleted, but Gmail, Drive and Photos can stop working if you are over 15 GB.", warning: "Google AI Pro / Gemini plans are managed on the same Google One page in many accounts — check which plan you are cancelling." },
  { merchantId: "icloud-plus", startedVia: "Apple (iPhone Settings)", serviceSteps: ["This plan is billed by Apple — use the App Store rail guide on this page: Settings → your name → Subscriptions.", "To change the storage size instead of cancelling: Settings → your name → iCloud → Manage Account Storage → Change Storage Plan → Downgrade Options."], afterCancel: "iCloud+ runs until the end of the paid period, then storage falls back to the free 5 GB. If your backup is bigger than 5 GB, new backups stop — download or delete old data first." },
  { merchantId: "microsoft-365", startedVia: "Microsoft account website", serviceSteps: ["Open account.microsoft.com and sign in.", "Go to Subscriptions.", "Find Microsoft 365 and tap Manage.", "Tap Cancel subscription (or Turn off recurring billing) and confirm."], afterCancel: "Apps keep working until the end of the paid period. Turning off recurring billing is enough — the subscription simply ends on its expiry date.", warning: "If you bought 365 through Apple or Google Play, cancel there — Microsoft's page will point you to the biller." },
  { merchantId: "adobe", startedVia: "Adobe account website", serviceSteps: ["Open account.adobe.com and sign in.", "Go to Plans → Manage plan.", "Tap Cancel your plan and follow the steps (Adobe may show an offer first).", "You will get a confirmation email — save it."], afterCancel: "Access runs until the end of the paid period in most plans.", warning: "Annual plans paid monthly can carry an early-cancellation fee (often 50% of the remaining months). The cancel screen shows the exact fee BEFORE you confirm — read it, and consider turning off auto-renew at the end of the term instead." },
  { merchantId: "canva", startedVia: "Canva website or app", serviceSteps: ["Open canva.com and sign in with the paying account.", "Click your profile icon → Settings → Billing & plans.", "On your plan, click the menu (three dots) → Cancel subscription.", "Confirm. If you are in a team, you must be the team owner or admin."], afterCancel: "Pro features run until the end of the paid period. Your designs stay in your account.", warning: "If Canva was billed by Google Play or Apple, cancel in that store's subscription list." },
  { merchantId: "chatgpt", startedVia: "ChatGPT website, or the ChatGPT app", serviceSteps: ["If you subscribed on the website: open chatgpt.com, click your profile → Settings → Billing → Manage → Cancel subscription.", "If you subscribed inside the iPhone app: cancel in iPhone Settings → your name → Subscriptions.", "If you subscribed inside the Android app: cancel in Google Play → Payments & subscriptions → Subscriptions."], afterCancel: "Plus runs until the end of the billing period, then the account returns to the free plan. Your chat history stays." },
  { merchantId: "google-play-subscriptions", startedVia: "Google Play (Android)", serviceSteps: ["Use the Google Play rail guide on this page — it cancels any app subscription billed by Google Play.", "Each app must be cancelled one by one in the Subscriptions list; there is no single cancel-all button."], afterCancel: "For every cancelled app, you keep access until the end of the period you already paid for.", warning: "Uninstalling an app never cancels its Play subscription. Always check the Play Subscriptions list after deleting a paid app." },
  { merchantId: "apple-one", startedVia: "Apple (iPhone Settings)", serviceSteps: ["On your iPhone, open Settings and tap your name at the top.", "Tap Subscriptions → Apple One → Cancel Subscription, and confirm. (Full path is also in the App Store rail guide on this page.)"], afterCancel: "All bundled services (Music, TV+, Arcade, iCloud+) run until the end of the paid period, then each falls back to its free level.", warning: "If your family uses the iCloud storage from Apple One, their backups can stop when it ends. Warn family members before cancelling." },
  { merchantId: "apple-music", startedVia: "Apple (iPhone Settings) or Apple Music app", serviceSteps: ["Use the App Store rail guide on this page: Settings → your name → Subscriptions → Apple Music → Cancel Subscription.", "On Android (Apple Music app): tap your profile → Manage Subscription, then cancel."], afterCancel: "Music runs until the end of the paid period. Songs you added to your library become unavailable after that until you rejoin." },

  { merchantId: "reliance-jio", startedVia: "MyJio app auto-recharge / postpaid auto-pay", serviceSteps: ["For a prepaid auto-recharge: open the MyJio app → your number → Recharge settings / AutoPay, and turn it off.", "For Jio postpaid auto-pay: MyJio → Bills & Payments → AutoPay → disable.", "Then also revoke the mandate in the UPI app that created it (see the UPI rail guides on this page)."], afterCancel: "Your current plan keeps working until its validity ends. Only future auto-recharges stop.", warning: "A normal one-time recharge is not a subscription — nothing to cancel. Only cancel if you had switched AutoPay on." },
  { merchantId: "airtel", startedVia: "Airtel Thanks app auto-recharge / postpaid auto-pay", serviceSteps: ["Open the Airtel Thanks app → your account → Payments / AutoPay settings.", "Select the number and turn AutoPay off.", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "Your current plan keeps working until its validity ends.", warning: "Airtel Black and Airtel Xstream Fiber are separate plans with their own billing — check each one separately." },
  { merchantId: "vodafone-idea", startedVia: "Vi app auto-recharge / postpaid auto-pay", serviceSteps: ["Open the Vi app → your account → AutoPay / payment settings.", "Select the number and turn AutoPay off.", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "Your current plan keeps working until its validity ends." },
  { merchantId: "jiofiber", startedVia: "MyJio app / Jio website auto-pay", serviceSteps: ["Open the MyJio app or jio.com and sign in.", "Go to JioFiber → Bills & Payments → AutoPay.", "Disable AutoPay for the account.", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "The current billing cycle is not affected. You will need to pay the next bill by hand if you keep the connection.", warning: "If you are closing the connection fully, raise a disconnection request in the app too — stopping AutoPay alone does not close a broadband account, and bills can keep coming." },
  { merchantId: "airtel-xstream", startedVia: "Airtel Thanks app / Airtel website auto-pay", serviceSteps: ["Open the Airtel Thanks app → Xstream Fiber account → AutoPay settings.", "Turn AutoPay off for the account.", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "The current billing cycle is not affected.", warning: "If you are closing the connection fully, place a disconnection request with Airtel too — stopping AutoPay alone does not close a broadband account, and bills can keep coming." },
  { merchantId: "act-fibernet", startedVia: "ACT app / portal auto-pay", serviceSteps: ["Open the ACT Fibernet app or actcorp.in and sign in.", "Go to Payments → AutoPay / saved payment methods.", "Disable AutoPay (or remove the saved card/mandate).", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "The current billing cycle is not affected.", warning: "If you are closing the connection, raise a disconnection request with ACT — stopping AutoPay does not close the account." },
  { merchantId: "tata-play", startedVia: "Tata Play app / website recharge auto-renew", serviceSteps: ["Open the Tata Play app or tataplay.com and sign in.", "Go to your account → Recharge / Subscription packs.", "If auto-recharge or a recurring pack renewal is on, turn it off.", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "Your current pack keeps running until its expiry date.", warning: "Most Tata Play recharges are one-time, not subscriptions. Only act if you see a repeating charge of the same amount." },
  { merchantId: "dish-tv", startedVia: "Dish TV / d2h app or website auto-recharge", serviceSteps: ["Open the Dish TV or d2h app/website and sign in.", "Go to your account → Recharge / auto-pay settings.", "Turn off auto-recharge if it is on.", "Then also revoke the mandate in the UPI app or bank that created it (see the rail guides on this page)."], afterCancel: "Your current pack keeps running until its expiry date.", warning: "Most DTH recharges are one-time, not subscriptions. Only act if you see a repeating charge of the same amount." },
  { merchantId: "zomato-gold", startedVia: "Zomato app", serviceSteps: ["Open the Zomato app → Profile.", "Tap your Gold membership.", "Tap Manage membership → turn off Auto-renew (or Cancel membership) and confirm."], afterCancel: "Gold works until the end of the paid period.", warning: "If Gold was billed by Google Play, cancel in the Play Store subscription list as well." },
  { merchantId: "swiggy-one", startedVia: "Swiggy app", serviceSteps: ["Open the Swiggy app → your profile.", "Tap Swiggy One → Manage membership.", "Turn off Auto-renew / tap Cancel membership and confirm."], afterCancel: "One benefits run until the end of the paid period.", warning: "If Swiggy One was billed by Google Play, cancel in the Play Store subscription list as well." },
  { merchantId: "uber-one", startedVia: "Uber or Uber Eats app", serviceSteps: ["Open the Uber app → Account → Uber One.", "Scroll down and tap End Membership.", "Tap End Membership again to confirm (Uber may first show what you saved)."], afterCancel: "Benefits run until the end of the paid period.", warning: "If Uber One was billed by Apple or Google Play, cancel in that store's subscription list as well." },
  { merchantId: "cultpass", startedVia: "Cult app or website", serviceSteps: ["Open the Cult app → your profile → My Membership / Subscriptions.", "Open your active pass → Cancel auto-renew (or contact Cult support from the same screen if no cancel option shows)."], afterCancel: "Your pass stays valid until its end date — cancelling only stops the next renewal charge.", warning: "Cult passes bought for a fixed term (3/6/12 months) are usually one-time payments, not renewals. Check your statement: act only if the same amount repeats." },
  { merchantId: "lic", startedVia: "LIC branch, LIC website, or your bank (premium auto-debit)", serviceSteps: ["Decide first: do you want to stop the POLICY, or only stop auto-debit and pay by hand? They are very different.", "To stop only auto-debit: cancel the NACH/bank mandate (see the NACH rail guide) and pay future premiums manually before the due date, or register on LIC's site and change the payment mode.", "To stop the policy itself: contact your LIC branch or agent about surrender — do not just stop paying without asking what you lose."], afterCancel: "Nothing changes for premiums already paid.", warning: "If premiums simply stop, most LIC policies lapse after the grace period and benefits can be lost. Never cancel an insurance mandate silently — talk to LIC or your agent first." },
  { merchantId: "hdfc-life", startedVia: "HDFC Life website/app or your bank (premium auto-debit)", serviceSteps: ["Decide first: stop the POLICY, or only stop auto-debit and pay by hand?", "To stop only auto-debit: cancel the mandate (see the NACH rail guide) and pay future premiums manually on the HDFC Life site/app before the due date.", "To stop the policy: use HDFC Life's customer portal or branch to ask about surrender/free-look options before taking any step."], afterCancel: "Nothing changes for premiums already paid.", warning: "If premiums simply stop, the policy can lapse and cover is lost. Never cancel an insurance mandate silently — talk to the insurer first." },
  { merchantId: "star-health", startedVia: "Star Health website/app or your bank (premium auto-debit)", serviceSteps: ["Decide first: stop the POLICY, or only stop auto-debit and pay the renewal by hand?", "To stop only auto-debit: cancel the mandate (see the NACH rail guide) and diarise the renewal date — health cover has no long grace period.", "To end the policy: simply do not renew, or contact Star Health support for cancellation and any refund rules."], afterCancel: "Cover runs until the policy's end date.", warning: "A gap in health insurance can restart waiting periods for illnesses when you buy a new policy. Do not let cover lapse by accident." },
  { merchantId: "cams-sip", startedVia: "Your mutual fund AMC, CAMS, or an investing app (SIP auto-debit)", serviceSteps: ["Open the app or site where you started the SIP (AMC site, CAMS, or your investing app).", "Go to your SIP list → select the SIP → Pause (stop for some months) or Cancel (stop for good).", "Confirm. The change usually applies from the next SIP date.", "Units you already bought stay invested — cancelling a SIP does NOT sell your investment."], afterCancel: "Your existing mutual fund units stay in your folio. Only future monthly buying stops.", warning: "Also revoke the bank/NACH mandate (see the NACH rail guide) if the SIP was the only thing using it — otherwise an unused live mandate stays open on your account." },
  { merchantId: "groww", startedVia: "Groww app (SIP auto-debit)", serviceSteps: ["Open the Groww app → Mutual Funds → SIPs.", "Select the SIP → tap the menu → Cancel SIP (or Pause SIP).", "Confirm with the OTP/PIN if asked."], afterCancel: "Units already bought stay invested in your folio. Only future SIP instalments stop.", warning: "Groww also has a separate AutoPay mandate for adding money — if you are leaving Groww fully, revoke that mandate in your UPI app or bank too (see the rail guides)." },
  { merchantId: "zerodha", startedVia: "Zerodha Coin (SIP) or a Zerodha account mandate", serviceSteps: ["For a Coin SIP: open coin.zerodha.com → your SIP → Pause or Delete/Cancel the SIP.", "For a bank mandate used for auto fund transfers: Zerodha support / your bank's mandate page can revoke it (see the NACH rail guide)."], afterCancel: "Your holdings stay in your demat/folio. Only future SIP buying or auto transfers stop.", warning: "Cancelling a SIP does not close your Zerodha account and does not sell anything. Account closure is a separate request on Zerodha's site." },

  { merchantId: "bajaj-finserv", startedVia: "Bajaj Finance EMI / loan auto-debit (NACH)", serviceSteps: ["First check WHAT the charge is: a loan EMI is a debt payment, not a subscription.", "If the loan is finished but debits continue: contact Bajaj Finance customer care and your bank with your loan account number and ask for mandate closure in writing.", "If the loan is still running: do not cancel the mandate — missing an EMI hurts your credit score and adds charges. For money trouble, ask Bajaj about restructuring instead."], afterCancel: "Nothing here is a normal subscription cancellation — follow the steps above for your exact case.", warning: "Never silently revoke an EMI mandate on a running loan. The EMI stays due, late fees apply, and your credit record is damaged." },
  { merchantId: "tata-power", startedVia: "Electricity bill auto-pay (bank/UPI)", serviceSteps: ["Electricity is a utility bill, not a subscription — most people should keep paying on time; only stop AUTO-PAY if you want to pay by hand.", "To stop auto-pay: cancel the standing instruction/mandate in your bank or UPI app (see the rail guides), or turn off auto-pay in the Tata Power app/portal.", "Then pay each monthly bill manually before its due date."], afterCancel: "Your connection is not affected by stopping auto-pay — only by not paying the bill itself.", warning: "Unpaid electricity bills can lead to late fees and disconnection notices. Set a monthly reminder if you switch to manual payment. The same steps work for other power boards (BESCOM, MSEDCL, BSES and the rest) in their own apps." },
  { merchantId: "fastag", startedVia: "FASTag auto-recharge (bank/UPI app setting)", serviceSteps: ["Open the app where your FASTag was issued (your bank app, Paytm, or the wallet app).", "Go to FASTag → your vehicle → Auto-recharge / low-balance settings.", "Turn auto-recharge off, or raise the threshold so it triggers rarely.", "To close the tag fully, use the issuer's Close FASTag option — any balance refund goes to your linked account."], afterCancel: "The tag keeps working with whatever balance is left; tolls simply stop being topped up automatically.", warning: "A tag with zero balance can be blacklisted at toll plazas. Keep a small manual balance if you travel on highways." },
  { merchantId: "linkedin-premium", startedVia: "LinkedIn website or app", serviceSteps: ["Open linkedin.com and click your photo (Me) → Settings & Privacy.", "Go to Account preferences → Subscriptions & payments.", "Click Manage Premium account → Cancel Premium and follow the steps."], afterCancel: "Premium runs until the end of the billing period, then your account returns to the free plan.", warning: "If Premium was billed by Apple, cancel in iPhone Settings → Subscriptions instead — LinkedIn's page will say who bills you." },
  { merchantId: "x-premium", startedVia: "X website or app", serviceSteps: ["If you subscribed on the web: open x.com → More → Settings and privacy → Your account → Subscriptions (Manage subscription) → cancel with the payment provider shown.", "If you subscribed in the iPhone app: cancel in iPhone Settings → Subscriptions.", "If you subscribed in the Android app: cancel in Google Play → Subscriptions."], afterCancel: "Premium runs until the end of the paid period.", warning: "X subscriptions are billed by different providers per platform (web, Apple, Google). Cancel with the one that actually charges you — check your statement narration." },
  { merchantId: "telegram-premium", startedVia: "Telegram app (billed by Google Play / Apple / Telegram's bot)", serviceSteps: ["If billed by Google Play or Apple: cancel in that store's subscription list (see the rail guides).", "If bought through Telegram's @PremiumBot: open the bot chat in Telegram and use its subscription management option to cancel."], afterCancel: "Premium features run until the end of the paid period." },
  { merchantId: "duolingo", startedVia: "Duolingo app or website", serviceSteps: ["If you subscribed on duolingo.com: sign in → your profile → Settings → Subscription → Cancel Subscription.", "If you subscribed in the Android app: cancel in Google Play → Subscriptions.", "If you subscribed in the iPhone app: cancel in iPhone Settings → Subscriptions."], afterCancel: "Super/Plus runs until the end of the paid period. Your learning progress and streak data stay in the free account." },
  { merchantId: "unacademy", startedVia: "Unacademy app/website (course subscription, often on EMI/NACH)", serviceSteps: ["Open the Unacademy app → your profile → My Subscriptions.", "Open the active plan and look for Cancel / auto-renew settings; if none shows, contact Unacademy support from the app and ask in writing to stop renewal.", "If the course was bought on EMI/NACH, also speak to the lender shown on your loan document — the education company and the lender are two different parties."], afterCancel: "Access usually runs until the end of the paid plan period.", warning: "For EMI-bought courses, stopping payment to the lender does NOT cancel the course contract, and missed EMIs hurt your credit score. Get written confirmation from both Unacademy and the lender." },
  { merchantId: "audible", startedVia: "Audible / Amazon account", serviceSteps: ["Open audible.in (or your Audible site) on a computer and sign in — membership cannot be cancelled inside the app.", "Go to Account Details.", "Under your membership box, tap Cancel membership and follow the steps (Audible may first offer a pause)."], afterCancel: "You keep every audiobook you bought, forever. Unused credits are LOST when membership ends — spend them before you cancel.", warning: "Spend your credits first: credits disappear on cancellation, audiobooks you own do not." },
  { merchantId: "kindle-unlimited", startedVia: "Amazon account", serviceSteps: ["Open amazon.in (or your Amazon site) and sign in.", "Go to Account & Lists → Memberships & Subscriptions.", "Find Kindle Unlimited → Manage membership → Cancel / turn off auto-renew and confirm."], afterCancel: "Borrowed books stay readable until the end of the paid period, then they are removed from your library. Books you bought are yours forever." },
  { merchantId: "xbox-game-pass", startedVia: "Microsoft account / Xbox", serviceSteps: ["Open account.microsoft.com → Subscriptions (Game Pass is a Microsoft subscription).", "Find Xbox Game Pass → Manage → Cancel subscription (or Turn off recurring billing) and confirm."], afterCancel: "Game Pass runs until the end of the paid period; after that, Game Pass games stop launching (games you bought stay).", warning: "If Game Pass was bought through a telecom or console bundle, cancel with that seller." },
  { merchantId: "playstation-plus", startedVia: "PlayStation console, app or website", serviceSteps: ["On the web: open playstation.com, sign in → your profile → Subscription Management.", "Select PlayStation Plus → Turn Off Auto-Renew / Cancel Subscription and confirm. (On the console: Settings → Users and Accounts → Account → Payment and Subscriptions → Subscriptions.)"], afterCancel: "Plus runs until the end of the paid period. Monthly games you claimed stay playable only while a Plus subscription is active.", warning: "Cloud saves can be deleted some time after the subscription ends — back up saves you care about before the end date." },
  { merchantId: "dropbox", startedVia: "Dropbox website", serviceSteps: ["Open dropbox.com and sign in with the paying account.", "Click your avatar → Settings → Plan.", "Click Cancel plan and follow the steps (Dropbox shows what changes before you confirm)."], afterCancel: "Your account downgrades to free Dropbox Basic at the end of the paid period. Files are not deleted, but if you are over the free limit, syncing stops — download or move files first.", warning: "If Dropbox was billed by Google Play or Apple, cancel in that store's subscription list." },
  { merchantId: "shopify", startedVia: "Shopify store admin (for store owners)", serviceSteps: ["Log in to your Shopify admin.", "Go to Settings → Plan.", "Click Deactivate store (or Pause store for a lower-cost pause) and follow the steps — Shopify asks for your password and a reason.", "Pay any final bill shown (apps, shipping labels, transaction fees) — deactivation can be blocked by unpaid charges."], afterCancel: "Your store data is kept for a limited period (Shopify states 2 years for store information) if you want to reopen.", warning: "Third-party apps keep billing through Shopify until the store is deactivated or each app is uninstalled — uninstall paid apps first and check their own billing too." },
];

export const CANCEL_GUIDE_COUNT = CANCEL_GUIDES.length;
export const RAIL_GUIDE_COUNT = Object.keys(RAIL_GUIDES).length;

export function getCancelGuide(merchantId: string): MerchantCancelGuide | null {
  return CANCEL_GUIDES.find((g) => g.merchantId === merchantId) ?? null;
}

export function getRailGuide(id: string): RailGuide | null {
  return RAIL_GUIDES[id] ?? null;
}
