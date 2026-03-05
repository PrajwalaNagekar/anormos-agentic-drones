import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, Circle, Server, Wifi, Shield, Radio, Crosshair, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

const preflightChecks = [
  { id: 1, label: 'Avionics Self-Test', status: 'pass' },
  { id: 2, label: 'GPS Lock (12 satellites)', status: 'pass' },
  { id: 3, label: 'Datalink Encrypted Channel', status: 'pass' },
  { id: 4, label: 'Payload Verification', status: 'pending' },
];

const logEntries = [
  '[14:23:17] DATALINK: Handshake complete — AES-256 encrypted',
  '[14:23:15] GPS: Lock acquired — 12 satellites, HDOP 0.8',
  '[14:23:12] AVIONICS: Self-test PASS — All subsystems nominal',
  '[14:23:10] ENGINE: Pre-heat cycle complete — Temp 42°C',
  '[14:23:08] COMMS: Mesh node ALPHA-3 synced — Latency 12ms',
  '[14:23:05] FUEL: Tank 1: 98% | Tank 2: 97% | Reserve: 100%',
  '[14:23:02] SYSTEM: Boot sequence complete — SYNDICATE C2 v4.2.1',
  '[14:22:58] AUTH: Operator OPR-2741 authenticated — Session #4421',
];

const LaunchOps = () => {
  const [armed, setArmed] = useState(false);
  const [launching, setLaunching] = useState(false);

  const handleArm = () => {
    setArmed(true);
  };

  const handleLaunch = () => {
    setLaunching(true);
  };

  return (
    <div className="flex h-full">
      {/* Left: Status panels */}
      <div className="w-80 border-r border-border flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* System Status */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">System Status</h3>
              <div className="space-y-2">
                {[
                  { icon: Server, label: 'Edge Server ALPHA', status: 'Online', ok: true },
                  { icon: Wifi, label: 'Mesh Node Sync', status: '4/4 Nodes', ok: true },
                  { icon: Shield, label: 'Airspace Clearance', status: 'GRANTED', ok: true },
                  { icon: Radio, label: 'Datalink', status: 'Encrypted', ok: true },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                      <s.icon className="w-3 h-3" /> {s.label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={s.ok ? 'status-online' : 'status-offline'} />
                      <span className={`text-[10px] font-mono ${s.ok ? 'text-primary' : 'text-destructive'}`}>{s.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-flight Checklist */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Pre-flight Checklist</h3>
              <div className="space-y-2">
                {preflightChecks.map(c => (
                  <div key={c.id} className="flex items-center gap-2">
                    {c.status === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-[10px] font-mono ${c.status === 'pass' ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
              <Progress value={75} className="h-1.5 mt-3" />
              <p className="text-[9px] font-mono text-muted-foreground mt-1">3/4 checks complete</p>
            </div>

            {/* Launch Control */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Launch Control</h3>
              {!armed ? (
                <Button
                  onClick={handleArm}
                  className="w-full font-mono text-xs uppercase bg-accent text-accent-foreground hover:brightness-110 glow-amber"
                >
                  ARM SYSTEM
                </Button>
              ) : !launching ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button
                    onClick={handleLaunch}
                    className="w-full font-mono text-xs uppercase bg-destructive text-destructive-foreground glow-red"
                  >
                    <Rocket className="w-4 h-4 mr-2" /> LAUNCH ENGAGE
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Rocket className="w-8 h-8 text-primary mx-auto mb-2" />
                  </motion.div>
                  <span className="text-xs font-mono text-primary animate-pulse-glow">LAUNCH SEQUENCE ACTIVE</span>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Center: Camera Feed Simulation */}
      <div className="flex-1 relative bg-background">
        <div className="absolute inset-0 scanline z-10 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* HUD overlay */}
          <div className="relative w-full h-full">
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Crosshair className="w-24 h-24 text-primary/30" />
              <div className="absolute w-px h-full bg-primary/10" />
              <div className="absolute w-full h-px bg-primary/10" />
            </div>

            {/* HUD Data */}
            <div className="absolute top-4 left-4 space-y-1 font-mono text-[10px] text-primary">
              <p>ALT: 28,000 FT</p>
              <p>HDG: 045°</p>
              <p>SPD: 180 KT</p>
              <p>LAT: 25.286°N</p>
              <p>LNG: 51.534°E</p>
            </div>

            <div className="absolute top-4 right-4 space-y-1 font-mono text-[10px] text-right">
              <p className="text-accent">FLIR: ACTIVE</p>
              <p className="text-primary">REC ●</p>
              <p className="text-muted-foreground">14:23:17 UTC</p>
              <p className="text-muted-foreground">HAWK-1 | RPR-001</p>
            </div>

            {/* Altitude ladder */}
            <div className="absolute right-16 top-1/4 bottom-1/4 w-8 flex flex-col justify-between items-end font-mono text-[8px] text-primary/40">
              {[32, 30, 28, 26, 24].map(a => (
                <div key={a} className="flex items-center gap-1">
                  <span>{a}K</span>
                  <div className="w-3 h-px bg-primary/30" />
                </div>
              ))}
            </div>

            {/* Heading strip */}
            <div className="absolute bottom-16 left-1/4 right-1/4 flex justify-between font-mono text-[8px] text-primary/40">
              {['N', 'NE', 'E', 'SE', 'S'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Camera label */}
            <div className="absolute bottom-4 left-4 military-panel px-2 py-1">
              <span className="text-[10px] font-mono text-accent">FEED: EO/IR — HAWK-1 PRIMARY</span>
            </div>
          </div>
        </div>

        {/* Manual Override D-Pad */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="military-panel p-2">
            <p className="text-[9px] font-mono text-muted-foreground mb-2 text-center uppercase">Manual Override</p>
            <div className="grid grid-cols-3 gap-1 w-24">
              <div />
              <button className="military-panel p-2 flex items-center justify-center hover:bg-primary/10"><ArrowUp className="w-3 h-3 text-primary" /></button>
              <div />
              <button className="military-panel p-2 flex items-center justify-center hover:bg-primary/10"><ArrowLeft className="w-3 h-3 text-primary" /></button>
              <button className="military-panel p-2 flex items-center justify-center hover:bg-primary/10"><RotateCcw className="w-3 h-3 text-accent" /></button>
              <button className="military-panel p-2 flex items-center justify-center hover:bg-primary/10"><ArrowRight className="w-3 h-3 text-primary" /></button>
              <div />
              <button className="military-panel p-2 flex items-center justify-center hover:bg-primary/10"><ArrowDown className="w-3 h-3 text-primary" /></button>
              <div />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Datalink Logs */}
      <div className="w-72 border-l border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-xs font-display uppercase text-foreground flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" /> Datalink Terminal
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {logEntries.map((entry, i) => (
              <p key={i} className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                {entry}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LaunchOps;
