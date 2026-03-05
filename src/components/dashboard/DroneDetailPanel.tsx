import { type Drone, droneModels } from '@/data/drones';
import { X, Battery, Signal, MapPin, Gauge, Compass, Plane, Radio, Activity, Box } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

const DroneDetailPanel = ({ drone: d, onClose }: { drone: Drone; onClose: () => void }) => {
  const model = droneModels[d.model];

  const TelemetryRow = ({ icon: Icon, label, value, unit }: { icon: any; label: string; value: any; unit?: string }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50">
      <span className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
        <Icon className="w-3 h-3" /> {label}
      </span>
      <span className="text-xs font-mono text-foreground font-medium">{value}{unit}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-display font-bold text-primary">{d.callsign}</h3>
          <p className="text-[10px] font-mono text-muted-foreground">{d.model} — {d.id}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-sm">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Status */}
          <div className="military-panel p-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">Status</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${d.status === 'active' || d.status === 'patrol' ? 'status-online' : d.status === 'offline' ? 'status-offline' : 'status-warning'}`} />
              <span className="text-xs font-mono text-foreground uppercase">{d.status}</span>
            </div>
            <p className="text-[10px] font-mono text-primary mt-1">{d.behavior}</p>
          </div>

          {/* Telemetry */}
          <div className="military-panel p-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">Telemetry</span>
            <TelemetryRow icon={Plane} label="Altitude" value={d.altitude.toLocaleString()} unit=" ft" />
            <TelemetryRow icon={Compass} label="Heading" value={d.heading} unit="°" />
            <TelemetryRow icon={Gauge} label="Speed" value={d.speed} unit=" kt" />
            <TelemetryRow icon={MapPin} label="Position" value={`${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}`} />
            <TelemetryRow icon={Radio} label="Last Contact" value={d.lastContact} />

            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">Battery</span>
                  <span className={d.battery < 30 ? 'text-destructive' : 'text-primary'}>{d.battery}%</span>
                </div>
                <Progress value={d.battery} className="h-1.5 mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">Signal</span>
                  <span className={d.signal < 50 ? 'text-accent' : 'text-primary'}>{d.signal}%</span>
                </div>
                <Progress value={d.signal} className="h-1.5 mt-1" />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="military-panel p-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">Mission</span>
            <p className="text-xs font-mono text-accent font-bold">{d.mission}</p>
          </div>

          {/* Payload */}
          <div className="military-panel p-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">Payload</span>
            <div className="flex flex-wrap gap-1">
              {d.payload.map((p, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-secondary rounded-sm text-secondary-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* AI Behavior Log */}
          <div className="military-panel p-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">AI Behavior Tree</span>
            <div className="space-y-1 font-mono text-[10px]">
              <p className="text-primary">▸ Root: {d.behavior}</p>
              <p className="text-muted-foreground pl-3">├─ Selector: Mission Active</p>
              <p className="text-muted-foreground pl-6">├─ Sequence: Navigate Waypoints</p>
              <p className="text-primary pl-9">└─ ✓ Current: Executing</p>
              <p className="text-muted-foreground pl-6">├─ Condition: Battery &gt; 20%</p>
              <p className={`pl-9 ${d.battery > 20 ? 'text-primary' : 'text-destructive'}`}>
                └─ {d.battery > 20 ? '✓ PASS' : '✗ FAIL — RTB Triggered'}
              </p>
              <p className="text-muted-foreground pl-6">└─ Condition: Signal Strength</p>
              <p className={`pl-9 ${d.signal > 50 ? 'text-primary' : 'text-accent'}`}>
                └─ {d.signal > 50 ? '✓ PASS' : '⚠ DEGRADED — Autonomous Mode'}
              </p>
            </div>
          </div>

          {/* Model Specs */}
          <div className="military-panel p-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">Model Specifications</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div><span className="text-muted-foreground">Max Alt:</span> <span className="text-foreground">{model.maxAlt.toLocaleString()} ft</span></div>
              <div><span className="text-muted-foreground">Max Speed:</span> <span className="text-foreground">{model.maxSpeed} kt</span></div>
              <div><span className="text-muted-foreground">Range:</span> <span className="text-foreground">{model.range} km</span></div>
              <div><span className="text-muted-foreground">Endurance:</span> <span className="text-foreground">{model.endurance}</span></div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DroneDetailPanel;
