import { type Drone } from '@/data/drones';
import { Battery, Signal, MapPin, Gauge, Plane, Radio } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const statusBadge: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-primary/20', text: 'text-primary' },
  patrol: { bg: 'bg-primary/10', text: 'text-primary' },
  pursuit: { bg: 'bg-destructive/20', text: 'text-destructive' },
  returning: { bg: 'bg-accent/20', text: 'text-accent' },
  standby: { bg: 'bg-muted', text: 'text-muted-foreground' },
  maintenance: { bg: 'bg-muted', text: 'text-muted-foreground' },
  offline: { bg: 'bg-destructive/20', text: 'text-destructive' },
};

const FleetList = ({ drones, onSelect }: { drones: Drone[]; onSelect: (d: Drone) => void }) => (
  <div className="flex flex-col h-full">
    <div className="p-3 border-b border-border">
      <div className="flex items-center gap-2">
        <Radio className="w-4 h-4 text-primary" />
        <span className="text-xs font-display uppercase tracking-wider text-foreground">Fleet Status</span>
      </div>
      <p className="text-[10px] font-mono text-muted-foreground mt-1">
        {drones.filter(d => ['active', 'patrol', 'pursuit'].includes(d.status)).length} airborne • {drones.length} tracked
      </p>
    </div>
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {drones.map(d => {
          const badge = statusBadge[d.status];
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d)}
              className="w-full text-left p-2.5 rounded-sm hover:bg-secondary/50 transition-colors border border-transparent hover:border-border group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-foreground">{d.callsign}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm uppercase ${badge.bg} ${badge.text}`}>
                  {d.status}
                </span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">{d.model} — {d.id}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Battery className="w-3 h-3" /> {d.battery}%
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Signal className="w-3 h-3" /> {d.signal}%
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Gauge className="w-3 h-3" /> {d.speed}kt
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  </div>
);

export default FleetList;
