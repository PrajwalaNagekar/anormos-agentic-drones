import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Target, Route, Shield, Radio, Rocket, AlertTriangle, Crosshair, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { drones, droneModels, missions } from '@/data/drones';
import { ScrollArea } from '@/components/ui/scroll-area';

const MissionPlanner = () => {
  const [selectedTool, setSelectedTool] = useState<string>('waypoint');
  const [missionActive, setMissionActive] = useState(false);

  const tools = [
    { id: 'waypoint', icon: Target, label: 'Waypoint' },
    { id: 'polygon', icon: Map, label: 'Zone' },
    { id: 'path', icon: Route, label: 'Path' },
    { id: 'target', icon: Crosshair, label: 'Target' },
  ];

  return (
    <div className="flex h-full">
      {/* Map Canvas */}
      <div className="flex-1 relative bg-background grid-tactical">
        <div className="absolute inset-0 scanline pointer-events-none z-10" />
        
        {/* Toolbar */}
        <div className="absolute top-3 left-3 z-20 flex gap-1">
          {tools.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTool(t.id)}
              className={`military-panel p-2 flex items-center gap-1.5 transition-colors ${
                selectedTool === t.id ? 'border-primary bg-primary/10' : ''
              }`}
            >
              <t.icon className={`w-4 h-4 ${selectedTool === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-[10px] font-mono">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Sample waypoints */}
        {[
          { x: 30, y: 25, label: 'WP-1' },
          { x: 55, y: 40, label: 'WP-2' },
          { x: 70, y: 30, label: 'WP-3' },
          { x: 45, y: 65, label: 'WP-4' },
        ].map((wp, i) => (
          <div key={i} className="absolute z-20" style={{ left: `${wp.x}%`, top: `${wp.y}%` }}>
            <div className="w-4 h-4 border-2 border-accent bg-accent/20 rotate-45 cursor-pointer hover:bg-accent/40 transition-colors" />
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-accent whitespace-nowrap">{wp.label}</span>
          </div>
        ))}

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full z-15 pointer-events-none" style={{ zIndex: 15 }}>
          <line x1="30%" y1="25%" x2="55%" y2="40%" stroke="hsl(42 70% 52% / 0.4)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="55%" y1="40%" x2="70%" y2="30%" stroke="hsl(42 70% 52% / 0.4)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="70%" y1="30%" x2="45%" y2="65%" stroke="hsl(42 70% 52% / 0.4)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Zone polygon */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 14 }}>
          <polygon
            points="20%,15% 65%,10% 80%,50% 50%,75% 15%,55%"
            fill="hsl(105 50% 50% / 0.05)"
            stroke="hsl(105 50% 50% / 0.3)"
            strokeWidth="1"
            strokeDasharray="6 3"
          />
        </svg>

        {/* Deploy controls */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="military-panel px-3 py-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">
              TOOL: <span className="text-primary uppercase">{selectedTool}</span> | WAYPOINTS: 4 | ZONE: ACTIVE
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-[10px] uppercase border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setMissionActive(false)}
            >
              Abort
            </Button>
            <Button
              size="sm"
              className="font-mono text-[10px] uppercase bg-primary text-primary-foreground glow-green"
              onClick={() => setMissionActive(true)}
            >
              <Rocket className="w-3 h-3 mr-1" /> Deploy Mission
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-border flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* ROE */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" /> Rules of Engagement
              </h3>
              <div className="space-y-2 text-[10px] font-mono">
                {[
                  { label: 'Weapons Free', active: false },
                  { label: 'Weapons Hold', active: true },
                  { label: 'Return Fire Only', active: false },
                  { label: 'Observe & Report', active: false },
                ].map(r => (
                  <label key={r.label} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="roe" defaultChecked={r.active} className="accent-primary" />
                    <span className={r.active ? 'text-primary' : 'text-muted-foreground'}>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comms Loss Policy */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4 text-accent" /> Comms-Loss Policy
              </h3>
              <div className="space-y-2 text-[10px] font-mono">
                {['Return to Base', 'Loiter at Last WP', 'Continue Mission', 'Land Immediately'].map((p, i) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="comms" defaultChecked={i === 0} className="accent-primary" />
                    <span className="text-muted-foreground">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fleet Assignment */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2">
                <Box className="w-4 h-4 text-accent" /> Fleet Assignment
              </h3>
              <div className="space-y-2">
                {Object.entries(droneModels).map(([model, spec]) => (
                  <div key={model} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">{model}</span>
                    <span className="text-foreground">{spec.count} units</span>
                  </div>
                ))}
                <div className="border-t border-border pt-1 flex justify-between text-[10px] font-mono font-bold">
                  <span className="text-primary">TOTAL</span>
                  <span className="text-primary">450 units</span>
                </div>
              </div>
            </div>

            {/* Active Missions */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Active Missions</h3>
              <div className="space-y-2">
                {missions.map(m => (
                  <div key={m.id} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-foreground">{m.id}</span>
                    <span className={m.priority === 'critical' ? 'text-destructive' : m.priority === 'high' ? 'text-accent' : 'text-muted-foreground'}>
                      {m.priority.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MissionPlanner;
