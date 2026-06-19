const fs = require('fs');

// 1. Fix DashboardClient.tsx Banners
const dashPath = './components/dashboard/DashboardClient.tsx';
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, 'utf8');

  // Demo banner
  content = content.replace(
    '<div className="bg-amber-50 border-b border-amber-200 py-2 text-center text-sm text-amber-800 px-4 shrink-0">',
    '<div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 py-2 text-center text-sm text-amber-800 dark:text-amber-200 px-4 shrink-0">'
  );

  // Email verification banner
  content = content.replace(
    '<div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">',
    '<div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">'
  );
  content = content.replace(
    '<AlertTriangle size={14} className="text-amber-600 shrink-0" />',
    '<AlertTriangle size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />'
  );
  content = content.replace(
    '<p className="text-sm text-amber-800 flex-1">Please verify your email to unlock all features.</p>',
    '<p className="text-sm text-amber-800 dark:text-amber-200 flex-1">Please verify your email to unlock all features.</p>'
  );
  content = content.replace(
    'className="text-xs font-bold text-amber-700 hover:underline disabled:opacity-50"',
    'className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline disabled:opacity-50"'
  );

  fs.writeFileSync(dashPath, content, 'utf8');
}

// 2. Fix AccountSettings.tsx avatar and toggles
const accPath = './components/dashboard/AccountSettings.tsx';
if (fs.existsSync(accPath)) {
  let content = fs.readFileSync(accPath, 'utf8');

  // Avatar blue gradient
  content = content.replace(
    'className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"\n              style={{ background: avatarUrl ? undefined : "linear-gradient(135deg,#1A47C8,#3b6ef5)" }}',
    'className={`w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center ${avatarUrl ? "" : "bg-zinc-900 dark:bg-zinc-100"}`}'
  );
  content = content.replace(
    '<span className="text-3xl font-black text-white">{initial}</span>',
    '<span className="text-3xl font-black text-white dark:text-black">{initial}</span>'
  );

  // Toggles active state (replace all NotifRow toggles)
  content = content.replace(
    'className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy/20 ${value ? "bg-zinc-900 dark:bg-zinc-950" : "bg-zinc-200 dark:bg-zinc-700"}`}',
    'className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${value ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"}`}'
  );
  content = content.replace(
    '<span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-950 rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />',
    '<span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />'
  );

  fs.writeFileSync(accPath, content, 'utf8');
}

console.log("Account settings and banners updated.");
