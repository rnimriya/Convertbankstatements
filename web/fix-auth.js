const fs = require('fs');

const path = './components/auth/AuthForm.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');

  // Change the success card background
  content = content.replace(
    'bg-white dark:bg-zinc-950 p-12',
    'bg-white dark:bg-zinc-900 p-12'
  );

  // Change the main auth card background
  content = content.replace(
    'bg-white dark:bg-zinc-950 p-8',
    'bg-white dark:bg-zinc-900 p-8'
  );

  // Change the submit button
  content = content.replace(
    'bg-zinc-900 dark:bg-zinc-950 py-3 text-sm font-bold text-white',
    'bg-zinc-900 dark:bg-white py-3 text-sm font-bold text-white dark:text-black'
  );

  fs.writeFileSync(path, content, 'utf8');
  console.log("AuthForm styles updated.");
} else {
  console.log("File not found.");
}
