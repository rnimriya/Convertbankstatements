const fs = require('fs');

const filePath = './components/dashboard/DashboardClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Imports
content = content.replace(
  'import { QueuePanel } from "@/components/dashboard/QueuePanel";',
  'import { QueuePanel } from "@/components/dashboard/QueuePanel";\nimport { ThemeToggle } from "@/components/layout/ThemeToggle";'
);

// 2. Main container
content = content.replace(
  '<div className="flex h-screen overflow-hidden" style={{ background: "#f0f3f9" }}>',
  '<div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">'
);

// 3. User card background
content = content.replace(
  '<div className="mx-3 mt-3 mb-2 p-3 rounded-2xl" style={{ background: "#f5f7ff", border: "1px solid #e0e7ff" }}>',
  '<div className="mx-3 mt-3 mb-2 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">'
);

// 4. User profile icon
content = content.replace(
  '<div\n              className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"\n              style={{ background: "linear-gradient(135deg,#1A47C8 0%,#3b6ef5 100%)" }}\n            >',
  '<div\n              className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black shrink-0"\n            >'
);

// 5. Theme toggle
content = content.replace(
  '<div className="flex items-center gap-2 shrink-0">\n            {tab !== "upload" && (',
  '<div className="flex items-center gap-2 shrink-0">\n            <ThemeToggle />\n            {tab !== "upload" && ('
);

// 6. Header user icon
content = content.replace(
  '<div\n                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"\n                style={{ background: "linear-gradient(135deg,#1A47C8,#3b6ef5)" }}\n              >',
  '<div\n                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black shrink-0"\n              >'
);

// 7. Welcome strip button shadow
content = content.replace(
  '<button\n                  onClick={() => setTab("upload")}\n                  className="relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-900 dark:bg-zinc-950 text-white transition-opacity hover:opacity-90"\n                  style={{ boxShadow: "0 4px 14px rgba(26,71,200,0.28)" }}\n                >',
  '<button\n                  onClick={() => setTab("upload")}\n                  className="relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-900 dark:bg-zinc-100 dark:text-black text-white transition-opacity hover:opacity-90"\n                >'
);

// 8. Stats cards
content = content.replace(
  /\{\s*label: "Docs Converted"[\s\S]*?bg: "#eff6ff",\s*iconColor: "#3b82f6",\s*\},\s*\{\s*label: "Pages Processed"[\s\S]*?bg: "#f5f3ff",\s*iconColor: "#8b5cf6",\s*\},\s*\{\s*label: "Transactions"[\s\S]*?bg: "#f0fdf4",\s*iconColor: "#10b981",\s*\},\s*\{\s*label: "Plan Usage"[\s\S]*?bg: usagePercent > 80 \? "#fef2f2" : "#fff7ed",\s*iconColor: usagePercent > 80 \? "#ef4444" : "#f97316",\s*\},\s*\]\.map\(card => \(\s*<div key=\{card\.label\} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800\/70 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-shadow">\s*<div className="flex items-start justify-between mb-3">\s*<div\s*className="w-9 h-9 rounded-xl flex items-center justify-center"\s*style=\{\{ background: card\.bg \}\}\s*>\s*<card\.Icon size=\{16\} style=\{\{ color: card\.iconColor \}\} \/>\s*<\/div>\s*<div\s*className="h-1 w-12 rounded-full opacity-60"\s*style=\{\{ background: card\.gradient \}\}\s*\/>\s*<\/div>/,
  `[
                  {
                    label: "Docs Converted",
                    value: String(totalDocs),
                    sub: totalDocs === 0 ? "No files yet" : \`\${totalDocs} file\${totalDocs !== 1 ? "s" : ""} converted\`,
                    Icon: FileText,
                  },
                  {
                    label: "Pages Processed",
                    value: billing.pagesUsedThisPeriod.toLocaleString("en-IN"),
                    sub: billing.pagesUsedThisPeriod === 0
                      ? "No pages yet"
                      : \`of \${billing.monthlyPageLimit} \${isPaid ? "this period" : "free"}\`,
                    Icon: TrendingUp,
                  },
                  {
                    label: "Transactions",
                    value: totalTxns.toLocaleString("en-IN"),
                    sub: totalTxns > 0 ? "Auto-extracted" : "Upload to start",
                    Icon: Zap,
                  },
                  {
                    label: "Plan Usage",
                    value: isPaid ? \`\${usagePercent}%\` : billing.tier,
                    sub: isPaid
                      ? \`\${billing.pagesUsedThisPeriod} / \${billing.monthlyPageLimit} pages used\`
                      : billing.tier === "FREE"
                        ? \`\${Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod)} of \${billing.monthlyPageLimit} pages left\`
                        : "Pay per doc",
                    Icon: Clock,
                  },
                ].map(card => (
                  <div key={card.label} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800/70 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                        <card.Icon size={16} className="text-zinc-900 dark:text-zinc-100" />
                      </div>
                    </div>`
);

// 9. No documents icon
content = content.replace(
  '<div\n                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"\n                        style={{ background: "linear-gradient(135deg,#eff6ff,#e0e7ff)" }}\n                      >\n                        <FileText size={24} className="text-blue-500" />\n                      </div>',
  '<div\n                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-zinc-100 dark:bg-zinc-900"\n                      >\n                        <FileText size={24} className="text-zinc-900 dark:text-zinc-100" />\n                      </div>'
);

// 10. Recent logs table file icon
content = content.replace(
  '<div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">\n                                <FileText size={14} className="text-blue-500" />\n                              </div>',
  '<div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">\n                                <FileText size={14} className="text-zinc-900 dark:text-zinc-100" />\n                              </div>'
);

// 11. Txns column background
content = content.replace(
  '<span\n                                className="text-sm font-bold px-2 py-0.5 rounded-lg"\n                                style={{ background: "#f0fdf4", color: "#059669" }}\n                              >',
  '<span\n                                className="text-sm font-bold px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"\n                              >'
);

// 12. Plan card progress ring
content = content.replace(
  '<circle cx="32" cy="32" r={RING_R} fill="none" stroke="#f1f5f9" strokeWidth="8" />\n                            <circle\n                              cx="32" cy="32" r={RING_R} fill="none"\n                              stroke={usagePercent > 80 ? "#ef4444" : "#1A47C8"}\n                              strokeWidth="8" strokeLinecap="round"\n                              strokeDasharray={RING_C}\n                              strokeDashoffset={RING_C * (1 - usagePercent / 100)}\n                              className="transition-all duration-700"\n                            />',
  '<circle cx="32" cy="32" r={RING_R} fill="none" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="8" />\n                            <circle\n                              cx="32" cy="32" r={RING_R} fill="none"\n                              stroke={usagePercent > 80 ? "#ef4444" : "currentColor"}\n                              strokeWidth="8" strokeLinecap="round"\n                              strokeDasharray={RING_C}\n                              strokeDashoffset={RING_C * (1 - usagePercent / 100)}\n                              className="transition-all duration-700 text-zinc-900 dark:text-zinc-100"\n                            />'
);

// 13. Quick actions array
content = content.replace(
  /\{\[\s*\{\s*label: "Convert a statement", Icon: Upload,\s*dest: "upload" as Tab,\s*color: "#f97316", bg: "#fff7ed" \},\s*\{\s*label: "View history",\s*Icon: History,\s*dest: "history" as Tab,\s*color: "#3b82f6", bg: "#eff6ff" \},\s*\{\s*label: "Manage billing",\s*Icon: CreditCard,\s*dest: "billing" as Tab,\s*color: "#8b5cf6", bg: "#f5f3ff" \},\s*\{\s*label: "Account settings",\s*Icon: Settings,\s*dest: "settings" as Tab, color: "#64748b", bg: "#f8fafc" \},\s*\]\.map\(\(\{ label, Icon, dest, color, bg \}\) => \(\s*<button\s*key=\{label\}\s*onClick=\{\(\) => setTab\(dest\)\}\s*className="w-full flex items-center gap-3 px-3 py-2\.5 rounded-xl hover:bg-zinc-50 dark:bg-zinc-900 transition-colors group text-left"\s*>\s*<div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style=\{\{ background: bg \}\}>\s*<Icon size=\{13\} style=\{\{ color \}\} \/>\s*<\/div>/,
  `{[
                        { label: "Convert a statement", Icon: Upload,     dest: "upload" as Tab },
                        { label: "View history",         Icon: History,    dest: "history" as Tab },
                        { label: "Manage billing",       Icon: CreditCard, dest: "billing" as Tab },
                        { label: "Account settings",     Icon: Settings,   dest: "settings" as Tab },
                      ].map(({ label, Icon, dest }) => (
                        <button
                          key={label}
                          onClick={() => setTab(dest)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:bg-zinc-900 transition-colors group text-left"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            <Icon size={13} className="text-zinc-600 dark:text-zinc-400" />
                          </div>`
);


// Check PageBanner inline bg for dark mode issue
content = content.replace(
  'function PageBanner({\n  icon: Icon,\n  title,\n  subtitle,\n  iconColor,\n  iconBg,\n  action,\n}: {\n  icon: React.ElementType;\n  title: string;\n  subtitle: string;\n  iconColor: string;\n  iconBg: string;\n  action?: React.ReactNode;\n}) {\n  return (\n    <div className="shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-5">\n      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">\n        <div className="flex items-center gap-3">\n          <div\n            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"\n            style={{ background: iconBg }}\n          >\n            <Icon size={17} style={{ color: iconColor }} />\n          </div>',
  'function PageBanner({\n  icon: Icon,\n  title,\n  subtitle,\n  iconColor,\n  iconBg,\n  action,\n}: {\n  icon: React.ElementType;\n  title: string;\n  subtitle: string;\n  iconColor: string;\n  iconBg: string;\n  action?: React.ReactNode;\n}) {\n  return (\n    <div className="shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-5">\n      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">\n        <div className="flex items-center gap-3">\n          <div\n            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-zinc-100 dark:bg-zinc-900"\n          >\n            <Icon size={17} className="text-zinc-900 dark:text-zinc-100" />\n          </div>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Dark mode fixed on DashboardClient");
