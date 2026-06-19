const fs = require('fs');

const PURPLE_GRADIENT_CLASS = "text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 dark:from-violet-500 dark:to-fuchsia-500 dark:hover:from-violet-600 dark:hover:to-fuchsia-600 border-0";

const UBER_BASE_BUTTON_CLASS = "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none";

function replaceCTA(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace purple gradient strings with Uber base strings
  content = content.replace(new RegExp(PURPLE_GRADIENT_CLASS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), UBER_BASE_BUTTON_CLASS);

  fs.writeFileSync(filePath, content, 'utf8');
}

// Update specific files
replaceCTA('./components/PricingCards.tsx');
replaceCTA('./app/[locale]/page.tsx');
replaceCTA('./app/[locale]/pricing/page.tsx');
replaceCTA('./components/layout/Navbar.tsx');

console.log("Done updating buttons to Uber Base style!");
