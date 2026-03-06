import { alerts } from '@/data/drones';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

const iconMap = { critical: AlertTriangle, warning: AlertCircle, info: Info };
const colorMap = { critical: 'text-destructive', warning: 'text-accent', info: 'text-info' };

const AlertTicker = ({ alerts: items }: { alerts: typeof alerts }) => (
  <div className="h-8 bg-secondary/50 border-b border-border overflow-hidden flex items-center">
    <div className="shrink-0 px-3 flex items-center gap-1 border-r border-border h-full bg-accent/10">
      <AlertTriangle className="w-3 h-3 text-accent" />
      <span className="text-[10px] font-mono text-accent uppercase font-bold">LIVE</span>
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
        {items.map(a => {
          const Icon = iconMap[a.type];
          return (
            <span key={a.id} className="inline-flex items-center gap-2">
              <Icon className={`w-3 h-3 ${colorMap[a.type]}`} />
              <span className="text-[11px] font-mono text-foreground">{a.message}</span>
              <span className="text-[10px] font-mono text-muted-foreground">[{a.time}]</span>
            </span>
          );
        })}
      </div>
    </div>
  </div>
);

export default AlertTicker;
