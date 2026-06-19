const fs = require('fs');

// 1. PricingCards.tsx: Fix "Most popular" text color in dark mode
const pricingPath = './components/PricingCards.tsx';
if (fs.existsSync(pricingPath)) {
  let content = fs.readFileSync(pricingPath, 'utf8');
  content = content.replace(
    '<span className="inline-block bg-white dark:bg-zinc-950 rounded-full px-5 py-1.5 text-xs font-black text-zinc-900 border border-zinc-200 whitespace-nowrap">',
    '<span className="inline-block bg-white dark:bg-zinc-950 rounded-full px-5 py-1.5 text-xs font-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 whitespace-nowrap">'
  );
  fs.writeFileSync(pricingPath, content, 'utf8');
}

// 2. DashboardClient.tsx: Fix Quick Actions hover text color
const dashPath = './components/dashboard/DashboardClient.tsx';
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, 'utf8');
  content = content.replace(
    '<span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-100 flex-1">{label}</span>',
    '<span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 flex-1">{label}</span>'
  );
  fs.writeFileSync(dashPath, content, 'utf8');
}

// 3. AccountSettings.tsx: Fix Profile & Notifications borders
const accountPath = './components/dashboard/AccountSettings.tsx';
if (fs.existsSync(accountPath)) {
  let content = fs.readFileSync(accountPath, 'utf8');
  content = content.replace(
    'const SECTION = "rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 divide-y divide-slate-100 overflow-hidden shadow-sm";',
    'const SECTION = "rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden shadow-sm";'
  );
  fs.writeFileSync(accountPath, content, 'utf8');
}

console.log("Fixes applied successfully.");
