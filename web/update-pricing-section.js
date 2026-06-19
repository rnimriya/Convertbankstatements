const fs = require('fs');

const filePath = './components/dashboard/PricingSection.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Annual toggle
content = content.replace(
  '          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ? "bg-[#3B5BFC]" : "bg-zinc-200 dark:bg-white dark:bg-zinc-950/20"}`}',
  '          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"}`}'
).replace(
  '          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-950 rounded-full shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`} />',
  '          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`} />'
);

// 2. Pro badge
content = content.replace(
  '                    <span className="inline-block bg-white dark:bg-zinc-950 rounded-full px-5 py-1.5 text-xs font-black text-[#3B5BFC] shadow-md whitespace-nowrap border border-white">',
  '                    <span className="inline-block bg-white dark:bg-zinc-950 rounded-full px-5 py-1.5 text-xs font-black text-zinc-900 dark:text-zinc-100 shadow-md whitespace-nowrap border border-zinc-200 dark:border-zinc-800">'
);
content = content.replace(
  '                    <span className="inline-block bg-emerald-500 rounded-full px-5 py-1.5 text-xs font-black text-white shadow-md whitespace-nowrap">',
  '                    <span className="inline-block bg-zinc-900 dark:bg-zinc-100 rounded-full px-5 py-1.5 text-xs font-black text-white dark:text-black shadow-md whitespace-nowrap border border-zinc-200 dark:border-zinc-800">'
);

// 3. Pro card background & orb
content = content.replace(
  '                  style={{\n                    background: "linear-gradient(160deg,#3B5BFC 0%,#2645e0 100%)",\n                    boxShadow: "0 20px 60px rgba(59,91,252,0.40), 0 4px 20px rgba(59,91,252,0.20)",\n                  }}\n                >',
  '                  className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"\n                >'
).replace(
  'className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden"\n                  className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"', // Fix if double match
  'className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"'
);

// Need to fix the duplicate className issue if the previous replace was wrong.
// Actually, in the original, the first replace is:
// <div \n className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden"\n style={{...}} >
// Let's replace the whole tag.
content = content.replace(
  /<div\s*className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden"\s*style=\{\{\s*background: "linear-gradient\(160deg,#3B5BFC 0%,#2645e0 100%\)",\s*boxShadow: "0 20px 60px rgba\(59,91,252,0\.40\), 0 4px 20px rgba\(59,91,252,0\.20\)",\s*\}\}\s*>/,
  '<div\n                  className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"\n                >'
);

content = content.replace(
  '<div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle,white,transparent)", transform: "translate(30%,-30%)" }} />',
  '<div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 pointer-events-none bg-white" style={{ transform: "translate(30%,-30%)" }} />'
);

// 4. Pro CTA
content = content.replace(
  '                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-[#3B5BFC] bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:bg-zinc-900 transition-colors shadow-lg"',
  '                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold bg-white text-black hover:bg-zinc-100 transition-colors shadow-sm"'
);

// 5. Regular border
content = content.replace(
  /isCurrent\s*\?\s*"border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-400"\s*:\s*"border-zinc-200 dark:border-zinc-800"/,
  'isCurrent ? "border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900 dark:ring-zinc-100" : "border-zinc-200 dark:border-zinc-800"'
);

content = content.replace(
  '<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-black text-white whitespace-nowrap shadow-sm">',
  '<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-4 py-1 text-xs font-bold text-white dark:text-black whitespace-nowrap shadow-sm border border-zinc-200 dark:border-zinc-800">'
);

// 6. Regular features list checkmark
content = content.replace(
  /<div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">\s*<Check size=\{11\} className="text-emerald-500" \/>\s*<\/div>/g,
  '<div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center shrink-0">\n                      <Check size={11} className="text-zinc-400" />\n                    </div>'
);

// 7. Regular CTA 
content = content.replace(
  'className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-[#3B5BFC] hover:text-[#3B5BFC] dark:hover:border-brand-400 dark:hover:text-violet-400 transition-all"',
  'className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none"'
);
content = content.replace(
  '<button\n                  disabled\n                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"\n                >',
  '<button\n                  disabled\n                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"\n                >'
);
content = content.replace( // Replace the other duplicate button (for "Free")
  '<button\n                  disabled\n                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"\n                >',
  '<button\n                  disabled\n                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"\n                >'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("PricingSection updated");
