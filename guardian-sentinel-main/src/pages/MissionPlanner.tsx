import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Map, Target, Route, Shield, Radio, Rocket, Crosshair, Box, Play, Save, Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { drones, droneModels, missions } from '@/data/drones';
import { targets as targetData } from '@/data/targets';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useMissionContext } from '@/contexts/MissionContext';

interface WP { id: string; x: number; y: number; label: string; }
interface ZoneVertex { x: number; y: number; }
interface MapTarget { id: string; x: number; y: number; speed: number; heading: number; threat: string; assignedDrone: string; }

// SIMULATION ONLY — NON-LETHAL
// REQUIRES LEGAL SIGNOFF for any engagement behaviors

const MissionPlanner = () => {
  const { transferToLaunch } = useMissionContext();
  const [selectedTool, setSelectedTool] = useState<string>('waypoint');
  const [waypoints, setWaypoints] = useState<WP[]>([
    { id: 'WP-001', x: 30, y: 25, label: 'WP-1' },
    { id: 'WP-002', x: 55, y: 40, label: 'WP-2' },
    { id: 'WP-003', x: 70, y: 30, label: 'WP-3' },
    { id: 'WP-004', x: 45, y: 65, label: 'WP-4' },
  ]);
  const [zoneVertices, setZoneVertices] = useState<ZoneVertex[]>([
    { x: 20, y: 15 }, { x: 65, y: 10 }, { x: 80, y: 50 }, { x: 50, y: 75 }, { x: 15, y: 55 },
  ]);
  const [drawingZone, setDrawingZone] = useState(false);
  const [newZoneVertices, setNewZoneVertices] = useState<ZoneVertex[]>([]);
  const [mapTargets, setMapTargets] = useState<MapTarget[]>(
    targetData.slice(0, 8).map((t, i) => ({
      id: t.id, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80,
      speed: t.speed, heading: t.heading, threat: t.threat_level, assignedDrone: '',
    }))
  );
  const [missionName, setMissionName] = useState('Operation Eagle Shield');
  const [missionDesc, setMissionDesc] = useState('Multi-sector patrol and surveillance');
  const [roe, setRoe] = useState('observe_report');
  const [commsPolicy, setCommsPolicy] = useState('rtb');
  const [simulating, setSimulating] = useState(false);
  const [showLaunchConfirm, setShowLaunchConfirm] = useState(false);
  const [showWpWarning, setShowWpWarning] = useState(false);
  const [selectedDrones, setSelectedDrones] = useState<Set<string>>(new Set(['RPR-001', 'BYK-001']));
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: 'waypoint', icon: Target, label: 'Waypoint' },
    { id: 'zone', icon: Map, label: 'Zone' },
    { id: 'path', icon: Route, label: 'Path' },
    { id: 'target', icon: Crosshair, label: 'Target' },
  ];

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (selectedTool === 'waypoint') {
      const newWp: WP = { id: `WP-${String(waypoints.length + 1).padStart(3, '0')}`, x, y, label: `WP-${waypoints.length + 1}` };
      setWaypoints(prev => [...prev, newWp]);
    } else if (selectedTool === 'zone') {
      if (!drawingZone) {
        setDrawingZone(true);
        setNewZoneVertices([{ x, y }]);
      } else {
        // Check if close to first point
        const first = newZoneVertices[0];
        if (newZoneVertices.length >= 3 && Math.abs(x - first.x) < 3 && Math.abs(y - first.y) < 3) {
          setZoneVertices(newZoneVertices);
          setDrawingZone(false);
          setNewZoneVertices([]);
          toast({ title: 'Zone Created', description: `Zone with ${newZoneVertices.length} vertices saved` });
        } else {
          setNewZoneVertices(prev => [...prev, { x, y }]);
        }
      }
    } else if (selectedTool === 'target') {
      const newTarget: MapTarget = {
        id: `TGT-${String(mapTargets.length + 1).padStart(3, '0')}`,
        x, y, speed: 30 + Math.random() * 50, heading: Math.random() * 360,
        threat: Math.random() > 0.5 ? 'high' : 'medium', assignedDrone: '',
      };
      setMapTargets(prev => [...prev, newTarget]);
    }
  }, [selectedTool, waypoints, drawingZone, newZoneVertices, mapTargets]);

  const handleDoubleClick = useCallback(() => {
    if (drawingZone && newZoneVertices.length >= 3) {
      setZoneVertices(newZoneVertices);
      setDrawingZone(false);
      setNewZoneVertices([]);
      toast({ title: 'Zone Created', description: `Zone with ${newZoneVertices.length} vertices saved` });
    }
  }, [drawingZone, newZoneVertices]);

  const removeWaypoint = (id: string) => setWaypoints(prev => prev.filter(w => w.id !== id));

  const toggleDrone = (id: string) => {
    setSelectedDrones(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const assignTargetToDrone = (targetId: string, droneId: string) => {
    setMapTargets(prev => prev.map(t => t.id === targetId ? { ...t, assignedDrone: droneId } : t));
    toast({ title: 'Target Assigned', description: `${targetId} → ${droneId}` });
  };

  const startSimulation = () => {
    setSimulating(true);
    setSimLogs(['[SIM] Simulation started — ANORMOS skAI Mission Simulator']);
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setMapTargets(prev => prev.map(t => ({
        ...t,
        x: Math.max(2, Math.min(98, t.x + Math.sin(t.heading * Math.PI / 180) * t.speed * 0.01)),
        y: Math.max(2, Math.min(98, t.y - Math.cos(t.heading * Math.PI / 180) * t.speed * 0.01)),
        heading: t.heading + (Math.random() - 0.5) * 10,
      })));

      // SIMULATION ONLY — NON-LETHAL intercept check
      setMapTargets(prev => prev.map(t => {
        if (t.assignedDrone) {
          const droneWp = waypoints[0];
          if (droneWp && Math.abs(t.x - droneWp.x) < 5 && Math.abs(t.y - droneWp.y) < 5) {
            setSimLogs(l => [...l, `[SIM ${tick}s] INTERCEPT: ${t.assignedDrone} captured ${t.id} — NON-LETHAL`]);
          }
        }
        return t;
      }));

      setSimLogs(l => [...l, `[SIM ${tick}s] Targets moving — ${mapTargets.length} active tracks`]);

      if (tick >= 30) {
        clearInterval(interval);
        setSimulating(false);
        setSimLogs(l => [...l, '[SIM] Simulation complete']);
      }
    }, 1000);
  };

  const handleSaveMission = () => {
    toast({ title: 'Mission Saved', description: `"${missionName}" with ${waypoints.length} waypoints saved.` });
  };

  const handleTransferToLaunch = () => {
    if (waypoints.length > 1000) {
      setShowWpWarning(true);
    } else {
      setShowLaunchConfirm(true);
    }
  };

  const confirmTransfer = () => {
    transferToLaunch('MSN-001');
    setShowLaunchConfirm(false);
    toast({ title: 'Mission Transferred', description: `"${missionName}" moved to Launch Operations queue.` });
  };

  const zoneArea = (() => {
    if (zoneVertices.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < zoneVertices.length; i++) {
      const j = (i + 1) % zoneVertices.length;
      area += zoneVertices[i].x * zoneVertices[j].y;
      area -= zoneVertices[j].x * zoneVertices[i].y;
    }
    return Math.abs(area / 2 * 0.5).toFixed(1); // Rough sq km estimate
  })();

  return (
    <div className="flex h-full">
      <div className="flex-1 relative bg-background grid-tactical" ref={mapRef} onClick={handleMapClick} onDoubleClick={handleDoubleClick}>
        <div className="absolute inset-0 scanline pointer-events-none z-10" />

        {/* Toolbar */}
        <div className="absolute top-3 left-3 z-20 flex gap-1">
          {tools.map(t => (
            <button key={t.id} onClick={(e) => { e.stopPropagation(); setSelectedTool(t.id); }}
              className={`military-panel p-2 flex items-center gap-1.5 transition-colors ${selectedTool === t.id ? 'border-primary bg-primary/10' : ''}`}>
              <t.icon className={`w-4 h-4 ${selectedTool === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-[10px] font-mono">{t.label}</span>
            </button>
          ))}
          <button onClick={(e) => { e.stopPropagation(); startSimulation(); }} disabled={simulating}
            className="military-panel p-2 flex items-center gap-1.5 bg-accent/10 border-accent/30">
            <Play className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-mono text-accent">{simulating ? 'Running...' : 'Simulate'}</span>
          </button>
        </div>

        {/* Waypoints */}
        {waypoints.map((wp) => (
          <div key={wp.id} className="absolute z-20" style={{ left: `${wp.x}%`, top: `${wp.y}%` }}>
            <div className="w-4 h-4 border-2 border-accent bg-accent/20 rotate-45 cursor-pointer hover:bg-accent/40 transition-colors" />
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-accent whitespace-nowrap">{wp.label}</span>
          </div>
        ))}

        {/* Connecting lines with arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="hsl(42 70% 52% / 0.6)" />
            </marker>
          </defs>
          {waypoints.map((wp, i) => {
            if (i === 0) return null;
            const prev = waypoints[i - 1];
            return <line key={i} x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${wp.x}%`} y2={`${wp.y}%`} stroke="hsl(42 70% 52% / 0.4)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />;
          })}
        </svg>

        {/* Zone polygon */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 14 }}>
          {zoneVertices.length >= 3 && (
            <polygon
              points={zoneVertices.map(v => `${v.x}%,${v.y}%`).join(' ')}
              fill="hsl(105 50% 50% / 0.05)"
              stroke="hsl(105 50% 50% / 0.3)"
              strokeWidth="1"
              strokeDasharray="6 3"
            />
          )}
          {/* Drawing zone preview */}
          {drawingZone && newZoneVertices.length >= 2 && (
            <polyline
              points={newZoneVertices.map(v => `${v.x}%,${v.y}%`).join(' ')}
              fill="none"
              stroke="hsl(105 50% 50% / 0.5)"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          )}
          {newZoneVertices.map((v, i) => (
            <circle key={i} cx={`${v.x}%`} cy={`${v.y}%`} r="4" fill="hsl(105 50% 50%)" />
          ))}
        </svg>

        {/* Map targets */}
        {mapTargets.map(t => (
          <div key={t.id} className="absolute z-20" style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-3 h-3 ${t.threat === 'high' ? 'bg-destructive' : 'bg-accent'} rotate-45`} style={{ boxShadow: `0 0 6px ${t.threat === 'high' ? '#DC2626' : '#D4A537'}` }} />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-destructive whitespace-nowrap">{t.id}</span>
          </div>
        ))}

        {/* Bottom bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="military-panel px-3 py-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">
              TOOL: <span className="text-primary uppercase">{selectedTool}</span> | WP: {waypoints.length} | TARGETS: {mapTargets.length} | ZONE: {zoneArea} km²
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase" onClick={(e) => { e.stopPropagation(); handleSaveMission(); }}>
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
            <Button size="sm" className="font-mono text-[10px] uppercase bg-primary text-primary-foreground glow-green" onClick={(e) => { e.stopPropagation(); handleTransferToLaunch(); }}>
              <Rocket className="w-3 h-3 mr-1" /> Move to Launch Ops
            </Button>
          </div>
        </div>

        {/* Simulation logs overlay */}
        {simLogs.length > 0 && (
          <div className="absolute top-14 left-3 z-20 military-panel p-2 max-w-sm max-h-40 overflow-auto">
            {simLogs.slice(-8).map((l, i) => (
              <p key={i} className="text-[9px] font-mono text-primary/80">{l}</p>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-border flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Mission Info */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Mission Details</h3>
              <div className="space-y-2">
                <Input value={missionName} onChange={e => setMissionName(e.target.value)} placeholder="Mission name" className="h-7 text-[10px] font-mono bg-background" />
                <Input value={missionDesc} onChange={e => setMissionDesc(e.target.value)} placeholder="Description" className="h-7 text-[10px] font-mono bg-background" />
              </div>
            </div>

            {/* ROE */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" /> Rules of Engagement
              </h3>
              <div className="space-y-2 text-[10px] font-mono">
                {[
                  { value: 'observe_report', label: 'Observe & Report' },
                  { value: 'non_lethal', label: 'Non-Lethal Intercept' },
                  { value: 'reconnaissance', label: 'Reconnaissance' },
                  { value: 'intercept', label: 'Active Intercept' },
                ].map(r => (
                  <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="roe" checked={roe === r.value} onChange={() => setRoe(r.value)} className="accent-primary" />
                    <span className={roe === r.value ? 'text-primary' : 'text-muted-foreground'}>{r.label}</span>
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
                {[
                  { value: 'rtb', label: 'Return to Base' },
                  { value: 'loiter', label: 'Loiter at Last WP' },
                  { value: 'continue', label: 'Continue Mission' },
                  { value: 'land', label: 'Land Immediately' },
                ].map(p => (
                  <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="comms" checked={commsPolicy === p.value} onChange={() => setCommsPolicy(p.value)} className="accent-primary" />
                    <span className="text-muted-foreground">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Waypoint List */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center justify-between">
                <span>Waypoints ({waypoints.length})</span>
              </h3>
              <div className="space-y-1 max-h-32 overflow-auto">
                {waypoints.map((wp, i) => (
                  <div key={wp.id} className="flex items-center justify-between text-[10px] font-mono p-1 hover:bg-secondary/30 rounded-sm">
                    <span className="flex items-center gap-1"><GripVertical className="w-3 h-3 text-muted-foreground" /> {wp.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{wp.x.toFixed(0)},{wp.y.toFixed(0)}</span>
                      <button onClick={() => removeWaypoint(wp.id)}><Trash2 className="w-3 h-3 text-destructive/50 hover:text-destructive" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Assignments */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Target Assignments</h3>
              <div className="space-y-1 max-h-32 overflow-auto">
                {mapTargets.slice(0, 8).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-[10px] font-mono">
                    <span className={t.threat === 'high' ? 'text-destructive' : 'text-accent'}>{t.id}</span>
                    <select value={t.assignedDrone} onChange={e => assignTargetToDrone(t.id, e.target.value)}
                      className="bg-background border border-border text-[9px] px-1 py-0.5 rounded-sm text-foreground">
                      <option value="">Unassigned</option>
                      {drones.filter(d => d.status !== 'offline' && d.status !== 'maintenance').slice(0, 8).map(d => (
                        <option key={d.id} value={d.id}>{d.callsign}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Drone Assignment */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2">
                <Box className="w-4 h-4 text-accent" /> Drone Assignment
              </h3>
              <div className="space-y-1">
                {drones.filter(d => d.status !== 'offline' && d.status !== 'maintenance').slice(0, 10).map(d => (
                  <label key={d.id} className="flex items-center gap-2 text-[10px] font-mono cursor-pointer">
                    <input type="checkbox" checked={selectedDrones.has(d.id)} onChange={() => toggleDrone(d.id)} className="accent-primary" />
                    <span className={selectedDrones.has(d.id) ? 'text-primary' : 'text-muted-foreground'}>{d.callsign} ({d.model.split(' ')[0]})</span>
                  </label>
                ))}
              </div>
              <div className="border-t border-border pt-1 mt-2 flex justify-between text-[10px] font-mono font-bold">
                <span className="text-primary">ASSIGNED</span>
                <span className="text-primary">{selectedDrones.size} drones</span>
              </div>
            </div>

            {/* Fleet Summary */}
            <div className="military-panel p-3">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Fleet Inventory</h3>
              <div className="space-y-1">
                {Object.entries(droneModels).map(([model, spec]) => (
                  <div key={model} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">{model}</span>
                    <span className="text-foreground">{spec.count} units</span>
                  </div>
                ))}
                <div className="border-t border-border pt-1 flex justify-between text-[10px] font-mono font-bold">
                  <span className="text-primary">TOTAL</span><span className="text-primary">450 units</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Launch Confirm */}
      <Dialog open={showLaunchConfirm} onOpenChange={setShowLaunchConfirm}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-display uppercase text-foreground">Confirm Transfer to Launch Ops</DialogTitle>
          </DialogHeader>
          <div className="text-[11px] font-mono text-muted-foreground space-y-1">
            <p>Mission: <span className="text-foreground">{missionName}</span></p>
            <p>Waypoints: <span className="text-foreground">{waypoints.length}</span></p>
            <p>Assigned Drones: <span className="text-foreground">{selectedDrones.size}</span></p>
            <p>Targets: <span className="text-foreground">{mapTargets.length}</span></p>
            <p>ROE: <span className="text-foreground">{roe}</span></p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowLaunchConfirm(false)} className="font-mono text-[10px]">Cancel</Button>
            <Button size="sm" onClick={confirmTransfer} className="font-mono text-[10px] bg-primary text-primary-foreground">Confirm Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WP Warning */}
      <Dialog open={showWpWarning} onOpenChange={setShowWpWarning}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-display uppercase text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" /> Performance Warning
            </DialogTitle>
          </DialogHeader>
          <p className="text-[11px] font-mono text-muted-foreground">{waypoints.length} waypoints detected. This may impact performance. Continue?</p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowWpWarning(false)} className="font-mono text-[10px]">Cancel</Button>
            <Button size="sm" onClick={() => { setShowWpWarning(false); setShowLaunchConfirm(true); }} className="font-mono text-[10px] bg-accent text-accent-foreground">Continue Anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MissionPlanner;