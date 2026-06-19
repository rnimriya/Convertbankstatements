const fs = require('fs');

function replaceFileContent(filePath, replacers) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  replacers.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  fs.writeFileSync(filePath, content, 'utf8');
}

// Fix Navbar gradient (missed in previous script)
replaceFileContent('./components/layout/Navbar.tsx', [
  {
    search: /bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 dark:from-violet-500 dark:to-fuchsia-500 dark:text-white dark:hover:from-violet-600 dark:hover:to-fuchsia-600/g,
    replace: "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
  }
]);

// Fix Auth pages full backgrounds
const authPages = [
  './app/[locale]/reset-password/page.tsx',
  './app/[locale]/forgot-password/page.tsx',
  './app/[locale]/login/page.tsx',
  './app/[locale]/signup/page.tsx'
];
authPages.forEach(file => {
  replaceFileContent(file, [
    {
      search: /bg-gradient-to-br from-slate-50 to-brand-50 dark:from-black dark:to-black/g,
      replace: "bg-zinc-50 dark:bg-black"
    }
  ]);
});

// Fix UploadCard buttons
replaceFileContent('./components/upload/UploadCard.tsx', [
  {
    search: /bg-zinc-900 hover:bg-zinc-800/g,
    replace: "bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
  }
]);

// Fix BulkUploadCard buttons
replaceFileContent('./components/upload/BulkUploadCard.tsx', [
  {
    search: /bg-zinc-900 hover:bg-zinc-800/g,
    replace: "bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
  }
]);

console.log("Dashboard and Auth elements updated to Uber Base");
