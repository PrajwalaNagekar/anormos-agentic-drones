import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, Circle, Server, Wifi, Shield, Radio, Crosshair, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Square, Home, AlertTriangle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useMissionContext } from '@/contexts/MissionContext';
import { drones } from '@/data/drones';
import { toast } from '@/hooks/use-toast';

const preflightChecks = [
  { id: 1, label: 'Avionics Self-Test', status: 'pass' },
  { id: 2, label: 'GPS Lock (12 satellites)', status: 'pass' },
  { id: 3, label: 'Datalink Encrypted Channel', status: 'pass' },
  { id: 4, label: 'Payload Verification', status: 'pending' },
];

const LaunchOps = () => {
  const { launchQueue, updateMissionStatus } = useMissionContext();
  const [armed, setArmed] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [missionRunning, setMissionRunning] = useState(false);
  const [missionPaused, setMissionPaused] = useState(false);
  const [droneStatuses, setDroneStatuses] = useState<Record<string, { status: string; outOfNetwork: boolean }>>({});
  const [logEntries, setLogEntries] = useState([
    '[14:23:17] DATALINK: Handshake complete — AES-256 encrypted',
    '[14:23:15] GPS: Lock acquired — 12 satellites, HDOP 0.8',
    '[14:23:12] AVIONICS: Self-test PASS — All subsystems nominal',
    '[14:23:10] ENGINE: Pre-heat cycle complete — Temp 42°C',
    '[14:23:08] COMMS: Mesh node ALPHA-3 synced — Latency 12ms',
    '[14:23:05] FUEL: Tank 1: 98% | Tank 2: 97% | Reserve: 100%',
    '[14:23:02] SYSTEM: Boot sequence complete — ANORMOS skAI C2 v4.2.1',
    '[14:22:58] AUTH: Operator OPR-2741 authenticated — Session #4421',
  ]);

  useEffect(() => {
    if (!missionRunning || missionPaused) return;
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogEntries(prev => [`[${time}] TELEMETRY: All drones nominal — Battery OK`, ...prev.slice(0, 30)]);

      // Randomly trigger out-of-network for simulation
      if (Math.random() < 0.05) {
        const randomDrone = drones[Math.floor(Math.random() * 3)];
        setDroneStatuses(prev => ({ ...prev, [randomDrone.id]: { status: 'OUT_OF_NETWORK', outOfNetwork: true } }));
        setLogEntries(prev => [`[${time}] ⚠ ${randomDrone.callsign} — OUT OF NETWORK — Last known position logged`, ...prev.slice(0, 30)]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [missionRunning, missionPaused]);

  const handleDroneCommand = (droneId: string, command: string) => {
    // Simulates POST /drones/{id}/command
    toast({ title: `Command: ${command}`, description: `Sent to ${droneId}` });
    setLogEntries(prev => [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] CMD: ${command} → ${droneId}`, ...prev.slice(0, 30)]);
    if (command === 'RTL') {
      setDroneStatuses(prev => ({ ...prev, [droneId]: { status: 'RTL', outOfNetwork: false } }));
    }
  };

  const handleAbort = () => {
    setMissionRunning(false);
    setMissionPaused(false);
    toast({ title: 'MISSION ABORTED', description: 'Emergency recall — all drones commanded to safe return.' });
    setLogEntries(prev => [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] !! MISSION ABORTED — All drones RTL`, ...prev.slice(0, 30)]);
  };

  const handleForceRendezvous = (droneId: string) => {
    setDroneStatuses(prev => ({ ...prev, [droneId]: { status: 'RENDEZVOUS', outOfNetwork: false } }));
    toast({ title: 'Force Rendezvous', description: `${droneId} directed to rendezvous waypoint` });
  };

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-border flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Launch Queue */}
            {launchQueue.length > 0 && (
              <div className="military-panel p-3">
                <h3 className="text-xs font-display uppercase text-foreground mb-3">Launch Queue</h3>
                {launchQueue.map(m => (
                  <div key={m.id} className="text-[10px] font-mono p-2 border-b border-border/50">
                    <p className="text-foreground font-bold">{m.name}</p>
                    <p className="text-muted-foreground">{m.waypoints.length} WP • {m.assigned_drones.length} drones • ROE: {m.roe}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${m.status === 'ready_for_launch' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>{m.status.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}

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
                    <span className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground"><s.icon className="w-3 h-3" /> {s.label}</span>
                    <span className="flex items-center gap-1.5">
                      <span className={s.ok ? 'status-online' : 'status-offline'} />
                      <span className={`text-[10px] font-mono ${s.ok ? 'text-primary' : 'text-destructive'}`}>{s.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-flight */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Pre-flight Checklist</h3>
              <div className="space-y-2">
                {preflightChecks.map(c => (
                  <div key={c.id} className="flex items-center gap-2">
                    {c.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <span className={`text-[10px] font-mono ${c.status === 'pass' ? 'text-foreground' : 'text-muted-foreground'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
              <Progress value={75} className="h-1.5 mt-3" />
              <p className="text-[9px] font-mono text-muted-foreground mt-1">3/4 checks complete</p>
            </div>

            {/* Launch / Mission Controls */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Mission Control</h3>
              {!missionRunning ? (
                <div className="space-y-2">
                  {!armed ? (
                    <Button onClick={() => setArmed(true)} className="w-full font-mono text-xs uppercase bg-accent text-accent-foreground glow-amber">ARM SYSTEM</Button>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Button onClick={() => { setLaunching(true); setTimeout(() => { setMissionRunning(true); setLaunching(false); }, 2000); }}
                        className="w-full font-mono text-xs uppercase bg-destructive text-destructive-foreground glow-red">
                        <Rocket className="w-4 h-4 mr-2" /> LAUNCH ENGAGE
                      </Button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-[10px] font-mono" onClick={() => setMissionPaused(!missionPaused)}>
                      {missionPaused ? <><Play className="w-3 h-3 mr-1" /> Resume</> : <><Pause className="w-3 h-3 mr-1" /> Pause</>}
                    </Button>
                    <Button size="sm" variant="outline" className="text-[10px] font-mono border-destructive text-destructive" onClick={handleAbort}>
                      <Square className="w-3 h-3 mr-1" /> Abort
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Per-drone Controls */}
            {missionRunning && (
              <div className="military-panel p-3">
                <h3 className="text-xs font-display uppercase text-foreground mb-3">Per-Drone Controls</h3>
                <div className="space-y-2">
                  {drones.filter(d => ['active', 'patrol', 'pursuit'].includes(d.status)).slice(0, 6).map(d => {
                    const ds = droneStatuses[d.id];
                    return (
                      <div key={d.id} className="p-2 border border-border/50 rounded-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-foreground font-bold">{d.callsign}</span>
                          {ds?.outOfNetwork && (
                            <span className="text-[8px] font-mono px-1 py-0.5 bg-accent/20 text-accent rounded-sm flex items-center gap-1">
                              <WifiOff className="w-2.5 h-2.5" /> OUT OF NETWORK
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <Button size="sm" variant="outline" className="h-5 text-[8px] font-mono px-1.5" onClick={() => handleDroneCommand(d.id, 'Pause')}>Pause</Button>
                          <Button size="sm" variant="outline" className="h-5 text-[8px] font-mono px-1.5" onClick={() => handleDroneCommand(d.id, 'RTL')}>
                            <Home className="w-2.5 h-2.5 mr-0.5" /> RTL
                          </Button>
                          <Button size="sm" variant="outline" className="h-5 text-[8px] font-mono px-1.5" onClick={() => handleDroneCommand(d.id, 'Hold')}>Hold</Button>
                          <Button size="sm" variant="outline" className="h-5 text-[8px] font-mono px-1.5" onClick={() => handleDroneCommand(d.id, 'Emergency Land')}>E-Land</Button>
                          {ds?.outOfNetwork && (
                            <>
                              <Button size="sm" variant="outline" className="h-5 text-[8px] font-mono px-1.5 border-accent text-accent" onClick={() => handleForceRendezvous(d.id)}>Rendezvous</Button>
                              <Button size="sm" variant="outline" className="h-5 text-[8px] font-mono px-1.5" onClick={() => handleDroneCommand(d.id, 'Allow Offline')}>Offline Policy</Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Center: Camera Feed Simulation */}
      <div className="flex-1 relative bg-background">
        <div className="absolute inset-0 scanline z-10 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Crosshair className="w-24 h-24 text-primary/30" />
              <div className="absolute w-px h-full bg-primary/10" />
              <div className="absolute w-full h-px bg-primary/10" />
            </div>
            <div className="absolute top-4 left-4 space-y-1 font-mono text-[10px] text-primary">
              <p>ALT: 28,000 FT</p><p>HDG: 045°</p><p>SPD: 180 KT</p><p>LAT: 25.286°N</p><p>LNG: 51.534°E</p>
            </div>
            <div className="absolute top-4 right-4 space-y-1 font-mono text-[10px] text-right">
              <p className="text-accent">FLIR: ACTIVE</p><p className="text-primary">REC ●</p>
              <p className="text-muted-foreground">14:23:17 UTC</p><p className="text-muted-foreground">HAWK-1 | RPR-001</p>
              {missionRunning && <p className={`${missionPaused ? 'text-accent' : 'text-primary'} animate-pulse-glow`}>{missionPaused ? 'PAUSED' : 'MISSION ACTIVE'}</p>}
            </div>
            <div className="absolute right-16 top-1/4 bottom-1/4 w-8 flex flex-col justify-between items-end font-mono text-[8px] text-primary/40">
              {[32, 30, 28, 26, 24].map(a => (
                <div key={a} className="flex items-center gap-1"><span>{a}K</span><div className="w-3 h-px bg-primary/30" /></div>
              ))}
            </div>
            <div className="absolute bottom-16 left-1/4 right-1/4 flex justify-between font-mono text-[8px] text-primary/40">
              {['N', 'NE', 'E', 'SE', 'S'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="absolute bottom-4 left-4 military-panel px-2 py-1">
              <span className="text-[10px] font-mono text-accent">FEED: EO/IR — HAWK-1 PRIMARY</span>
            </div>
          </div>
        </div>
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
              <p key={i} className={`text-[10px] font-mono leading-relaxed ${entry.includes('!!') || entry.includes('⚠') ? 'text-accent' : 'text-muted-foreground'}`}>{entry}</p>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LaunchOps;