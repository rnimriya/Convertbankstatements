const fs = require('fs');
const path = require('path');

const iconColorMap = {
  // Blue / Indigo
  Upload: 'text-blue-500 dark:text-blue-400',
  FileUp: 'text-blue-500 dark:text-blue-400',
  Plus: 'text-blue-500 dark:text-blue-400',
  LayoutDashboard: 'text-blue-500 dark:text-blue-400',
  FileText: 'text-indigo-500 dark:text-indigo-400',
  File: 'text-indigo-500 dark:text-indigo-400',
  Files: 'text-indigo-500 dark:text-indigo-400',
  Folder: 'text-indigo-500 dark:text-indigo-400',
  
  // Emerald / Green
  Check: 'text-emerald-500 dark:text-emerald-400',
  CheckCircle: 'text-emerald-500 dark:text-emerald-400',
  CheckCircle2: 'text-emerald-500 dark:text-emerald-400',
  ShieldCheck: 'text-emerald-500 dark:text-emerald-400',
  Download: 'text-emerald-500 dark:text-emerald-400',
  Bank: 'text-emerald-500 dark:text-emerald-400',
  Building: 'text-emerald-500 dark:text-emerald-400',
  
  // Amber / Orange
  History: 'text-amber-500 dark:text-amber-400',
  Clock: 'text-amber-500 dark:text-amber-400',
  AlertCircle: 'text-amber-500 dark:text-amber-400',
  AlertTriangle: 'text-amber-500 dark:text-amber-400',
  Zap: 'text-amber-500 dark:text-amber-400',
  Star: 'text-amber-500 dark:text-amber-400',
  
  // Purple / Violet
  Settings: 'text-purple-500 dark:text-purple-400',
  User: 'text-purple-500 dark:text-purple-400',
  Users: 'text-purple-500 dark:text-purple-400',
  UserPlus: 'text-purple-500 dark:text-purple-400',
  Shield: 'text-purple-500 dark:text-purple-400',
  CreditCard: 'text-purple-500 dark:text-purple-400',
  
  // Rose / Red
  Trash: 'text-rose-500 dark:text-rose-400',
  Trash2: 'text-rose-500 dark:text-rose-400',
  X: 'text-rose-500 dark:text-rose-400',
  XCircle: 'text-rose-500 dark:text-rose-400',
  LogOut: 'text-rose-500 dark:text-rose-400',
  Lock: 'text-rose-500 dark:text-rose-400',
  
  // Cyan / Teal
  Activity: 'text-cyan-500 dark:text-cyan-400',
  TrendingUp: 'text-cyan-500 dark:text-cyan-400',
  BarChart: 'text-cyan-500 dark:text-cyan-400',
  BarChart2: 'text-cyan-500 dark:text-cyan-400',
  LineChart: 'text-cyan-500 dark:text-cyan-400',
  PieChart: 'text-cyan-500 dark:text-cyan-400',
  Search: 'text-cyan-500 dark:text-cyan-400',
  Globe: 'text-cyan-500 dark:text-cyan-400',
  
  // Pink
  Heart: 'text-pink-500 dark:text-pink-400',
  Gift: 'text-pink-500 dark:text-pink-400',
  Award: 'text-pink-500 dark:text-pink-400'
};

const defaultColors = ['text-blue-500', 'text-emerald-500', 'text-purple-500', 'text-amber-500', 'text-cyan-500', 'text-rose-500', 'text-indigo-500'];
let colorIndex = 0;

function getNextDefaultColor() {
  const color = defaultColors[colorIndex];
  colorIndex = (colorIndex + 1) % defaultColors.length;
  return color;
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Extract all Lucide imports to know what icons are used
      const lucideImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+["']lucide-react["']/);
      if (lucideImportMatch) {
        const icons = lucideImportMatch[1].split(',').map(i => i.trim()).filter(Boolean);
        
        icons.forEach(icon => {
          // Determine color for this icon
          let colorClass = iconColorMap[icon];
          if (!colorClass) {
            const defaultColor = getNextDefaultColor();
            colorClass = `${defaultColor} dark:${defaultColor.replace('-500', '-400')}`;
            // Cache it so the same icon uses the same color within this run (optional, but good)
            iconColorMap[icon] = colorClass; 
          }

          // Regex to match the component usage like <IconName ... className="..." ... />
          // Note: This regex is simple and might not catch all props structures, but works for most
          const tagRegex = new RegExp(`<${icon}\\b([^>]*?)>`, 'g');
          content = content.replace(tagRegex, (match, props) => {
            if (props.includes('className=')) {
              // Replace existing text-zinc-*, text-brand-*, or text-slate-* colors
              let newProps = props.replace(/text-(zinc|brand|slate|gray)-[a-zA-Z0-9-]+\s*/g, '');
              newProps = newProps.replace(/dark:text-(zinc|brand|slate|gray)-[a-zA-Z0-9-]+\s*/g, '');
              
              // Insert our color class into className
              newProps = newProps.replace(/className=["']([^"']*)["']/, `className="$1 ${colorClass}"`);
              modified = true;
              return `<${icon}${newProps}>`;
            } else {
              // Add className if it doesn't exist
              modified = true;
              return `<${icon} className="${colorClass}" ${props}>`;
            }
          });
        });

        if (modified) {
          // Clean up multiple spaces in className that might have been introduced
          content = content.replace(/className=["']\s+/g, 'className="');
          content = content.replace(/\s+["']/g, '"'); // careful, might break something, let's just do multiple spaces
          content = content.replace(/className=["']([^"']+)["']/g, (m, c) => `className="${c.replace(/\s+/g, ' ').trim()}"`);
          
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Colorized icons in ${fullPath}`);
        }
      }
    }
  }
}

// Start processing from web/components and web/app
processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));
