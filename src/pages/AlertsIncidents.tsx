import { AlertTriangle, AlertCircle, Info, Shield, Clock, ChevronRight, Activity } from 'lucide-react';
import { alerts } from '@/data/drones';
import { ScrollArea } from '@/components/ui/scroll-area';

const defconLevels = [
  { level: 5, label: 'NORMAL', color: 'text-primary', bg: 'bg-primary/10' },
  { level: 4, label: 'ABOVE NORMAL', color: 'text-primary', bg: 'bg-primary/20' },
  { level: 3, label: 'ELEVATED', color: 'text-accent', bg: 'bg-accent/20' },
  { level: 2, label: 'HIGH', color: 'text-accent', bg: 'bg-accent/30' },
  { level: 1, label: 'MAXIMUM', color: 'text-destructive', bg: 'bg-destructive/20' },
];

const incidents = [
  { id: 'INC-001', title: 'Hostile UAV Incursion — Sector Bravo', severity: 'critical', time: '14:18:42', status: 'Active',
    timeline: [
      { time: '14:18:42', event: 'Radar detection of unknown UAV at FL120' },
      { time: '14:18:55', event: 'IFF query negative — classified HOSTILE' },
      { time: '14:19:10', event: 'BYK-003 re-tasked from PATROL-12 to INTERCEPT-9' },
      { time: '14:19:45', event: 'Swarm ALPHA (3x Coyote) deployed as backup' },
      { time: '14:20:30', event: 'Track established — heading 190° at 85kt' },
    ],
    actions: ['Maintain visual tracking', 'Await ROE authorization for kinetic engagement', 'Alert QAF scramble readiness'],
  },
  { id: 'INC-002', title: 'Communications Loss — QSC-003 (SHADOW-3)', severity: 'critical', time: '13:36:00', status: 'Active',
    timeline: [
      { time: '13:36:00', event: 'Last telemetry packet received from QSC-003' },
      { time: '13:41:00', event: 'Comms loss threshold exceeded (5 min)' },
      { time: '13:41:15', event: 'Failsafe RTB command transmitted' },
      { time: '13:50:00', event: 'No response — drone classified LOST' },
      { time: '14:00:00', event: 'Search pattern initiated by QSC-001 & QSC-002' },
    ],
    actions: ['Deploy recovery team to last known position', 'Activate emergency transponder scan', 'File incident with QMAF HQ'],
  },
  { id: 'INC-003', title: 'Low Battery RTB — RPR-003 (HAWK-3)', severity: 'warning', time: '14:21:05', status: 'Resolved',
    timeline: [
      { time: '14:10:00', event: 'Battery dropped below 30% threshold' },
      { time: '14:15:00', event: 'Mission SENTINEL-3B waypoint saved' },
      { time: '14:15:30', event: 'RTB initiated — direct route to Al Udeid' },
      { time: '14:21:05', event: 'Alert generated — estimated landing 14:45 UTC' },
    ],
    actions: ['Ground crew standby for recovery', 'Schedule replacement sortie'],
  },
];

const AlertsIncidents = () => {
  const currentDefcon = 3;

  return (
    <div className="flex h-full">
      {/* Left: Alerts & DEFCON */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* DEFCON */}
        <div className="p-3 border-b border-border">
          <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" /> Threat Level
          </h3>
          <div className="space-y-1">
            {defconLevels.map(d => (
              <div
                key={d.level}
                className={`flex items-center justify-between px-3 py-1.5 rounded-sm text-[10px] font-mono ${
                  d.level === currentDefcon ? `${d.bg} ${d.color} font-bold border border-current` : 'text-muted-foreground/30'
                }`}
              >
                <span>DEFCON {d.level}</span>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-3 border-b border-border">
          <h3 className="text-xs font-display uppercase text-foreground mb-2">Active Alerts</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {alerts.map(a => {
              const Icon = a.type === 'critical' ? AlertTriangle : a.type === 'warning' ? AlertCircle : Info;
              const color = a.type === 'critical' ? 'text-destructive' : a.type === 'warning' ? 'text-accent' : 'text-info';
              return (
                <div key={a.id} className="military-panel p-2.5">
                  <div className="flex items-start gap-2">
                    <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${color}`} />
                    <div>
                      <p className="text-[10px] font-mono text-foreground">{a.message}</p>
                      <p className="text-[9px] font-mono text-muted-foreground mt-1">{a.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Incidents */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <h2 className="text-sm font-display uppercase text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Incident Timeline
          </h2>
          {incidents.map(inc => (
            <div key={inc.id} className="military-panel p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${
                      inc.severity === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'
                    }`}>{inc.severity.toUpperCase()}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${
                      inc.status === 'Active' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                    }`}>{inc.status}</span>
                  </div>
                  <h3 className="text-xs font-display text-foreground">{inc.title}</h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{inc.id}</span>
              </div>

              {/* Timeline */}
              <div className="border-l-2 border-border ml-2 pl-4 space-y-3 mb-4">
                {inc.timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-primary" />
                    <p className="text-[9px] font-mono text-muted-foreground">{t.time}</p>
                    <p className="text-[10px] font-mono text-foreground">{t.event}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="bg-secondary/30 rounded-sm p-3">
                <p className="text-[9px] font-mono text-accent uppercase mb-2">Recommended Actions</p>
                {inc.actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-foreground/80">
                    <ChevronRight className="w-3 h-3 text-primary" /> {a}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertsIncidents;
