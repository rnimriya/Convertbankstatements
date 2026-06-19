const fs = require('fs');

const PURPLE_GRADIENT_CLASS = "text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 dark:from-violet-500 dark:to-fuchsia-500 dark:hover:from-violet-600 dark:hover:to-fuchsia-600 border-0";

function replaceCTA(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // In PricingCards.tsx
  content = content.replace(
    /className="flex items-center justify-center gap-2 rounded-2xl py-3\.5 text-sm font-black text-zinc-900 bg-white dark:bg-zinc-950 hover:bg-zinc-100 transition-colors"/g,
    `className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-colors shadow-sm \${PURPLE_GRADIENT_CLASS}"`
  );
  content = content.replace(
    /className="flex items-center justify-center gap-2 rounded-2xl py-3\.5 text-sm font-bold border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all"/g,
    `className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all shadow-sm \${PURPLE_GRADIENT_CLASS}"`
  );

  // In page.tsx and pricing/page.tsx
  content = content.replace(
    /className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:bg-zinc-900 transition-colors shadow-xl dark:shadow-none"/g,
    `className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold transition-colors shadow-xl dark:shadow-none \${PURPLE_GRADIENT_CLASS}"`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceCTA('./components/PricingCards.tsx');
replaceCTA('./app/[locale]/page.tsx');
replaceCTA('./app/[locale]/pricing/page.tsx');

// Also update HeroSection CTA (in UploadCard.tsx) if needed? The user said "all button" so UploadCard primary button should use it. UploadCard uses <Button variant="primary"> which I already updated! So that's handled.

console.log("Done updating buttons!");
