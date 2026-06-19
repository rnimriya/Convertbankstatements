const fs = require('fs');

// 1. DashboardClient.tsx
const dashPath = './components/dashboard/DashboardClient.tsx';
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, 'utf8');

  // Fix table border
  content = content.replace(
    '<div className="divide-y divide-slate-100">',
    '<div className="divide-y divide-zinc-200 dark:divide-zinc-800">'
  );
  content = content.replace(
    'border-b border-zinc-100 dark:border-zinc-800 text-[10px]',
    'border-b border-zinc-200 dark:border-zinc-800 text-[10px]'
  );

  // Fix Quick Actions hover
  content = content.replace(
    'className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:bg-zinc-900 transition-colors group text-left"',
    'className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group text-left"'
  );

  // Fix verification banner
  content = content.replace(
    '<div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">',
    '<div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">'
  );
  content = content.replace(
    '<AlertTriangle size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />',
    '<AlertTriangle size={14} className="text-zinc-600 dark:text-zinc-400 shrink-0" />'
  );
  content = content.replace(
    '<p className="text-sm text-amber-800 dark:text-amber-200 flex-1">Please verify your email to unlock all features.</p>',
    '<p className="text-sm text-zinc-800 dark:text-zinc-200 flex-1">Please verify your email to unlock all features.</p>'
  );
  content = content.replace(
    'className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline disabled:opacity-50"',
    'className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:underline disabled:opacity-50"'
  );

  fs.writeFileSync(dashPath, content, 'utf8');
}

// 2. UploadCard.tsx
const uploadPath = './components/upload/UploadCard.tsx';
if (fs.existsSync(uploadPath)) {
  let content = fs.readFileSync(uploadPath, 'utf8');

  // Width
  content = content.replace(
    'className={cn("w-full", fullWidth ? "max-w-full" : "max-w-xl")}',
    'className={cn("w-full", fullWidth ? "max-w-full" : "max-w-4xl")}'
  );
  
  // Padding & Border
  content = content.replace(
    '"relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors select-none",',
    '"relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 lg:py-16 text-center transition-colors select-none",'
  );

  // Typography
  content = content.replace(
    '<h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">',
    '<h2 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">'
  );
  content = content.replace(
    '<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">',
    '<p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">'
  );

  fs.writeFileSync(uploadPath, content, 'utf8');
}

// 3. BulkUploadCard.tsx
const bulkUploadPath = './components/upload/BulkUploadCard.tsx';
if (fs.existsSync(bulkUploadPath)) {
  let content = fs.readFileSync(bulkUploadPath, 'utf8');

  // Fix drag active colors
  content = content.replace(
    /isDragActive\s*\?\s*"border-navy bg-zinc-900 dark:bg-zinc-950\/5 scale-\[1\.01\]"\s*:\s*"border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900\/60 dark:bg-zinc-950\/60 hover:border-zinc-900\/40 dark:border-zinc-800 dark:hover:border-brand-400\/40 hover:bg-zinc-900 dark:bg-zinc-950\/\[0\.02\]"/,
    'isDragActive ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 scale-[1.01]" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"'
  );

  // Fix loading colors
  content = content.replace(
    '<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-950/10 dark:bg-brand-400/10">',
    '<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">'
  );
  content = content.replace(
    '<Loader2 className="h-8 w-8 text-navy dark:text-violet-400 animate-spin" />',
    '<Loader2 className="h-8 w-8 text-zinc-900 dark:text-zinc-100 animate-spin" />'
  );

  // Fix texts (navy, violet)
  content = content.replace(/text-navy dark:text-violet-400/g, 'text-zinc-900 dark:text-zinc-100');
  content = content.replace(/dark:bg-brand-400\/5/g, 'dark:bg-zinc-800/40');
  content = content.replace(/border-navy\/20 dark:border-brand-400\/20/g, 'border-zinc-200 dark:border-zinc-800');

  fs.writeFileSync(bulkUploadPath, content, 'utf8');
}

console.log("All dashboard fixes applied.");
