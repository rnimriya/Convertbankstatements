const fs = require('fs');
const path = './components/dashboard/AccountSettings.tsx';

if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');

  content = content.replace(
    /className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-950\/10 flex items-center justify-center text-zinc-900 dark:text-zinc-100"/g,
    'className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100"'
  );

  fs.writeFileSync(path, content, 'utf8');
  console.log("AccountSettings icons fixed.");
} else {
  console.log("File not found.");
}
