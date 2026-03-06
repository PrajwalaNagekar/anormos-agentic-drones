import { useState } from 'react';
import { LucideIcon, Cpu, Download, FlaskConical, Link2, ShieldCheck, Settings, Plus, Play, Upload, RotateCcw, Wifi, Key, Users, Database, Palette, Shield, Search, Filter, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import ReauthModal from '@/components/ReauthModal';

// ===== SWARM & AUTONOMY =====
const SwarmPage = () => {
  const [swarms] = useState([
    { id: 'SWM-001', name: 'Alpha Wing', members: ['CYT-001', 'CYT-002', 'CYT-003'], leader: 'CYT-001', behavior: 'Hunt & Intercept', status: 'Active' },
    { id: 'SWM-002', name: 'Recon Pack', members: ['QSC-001', 'QSC-002'], leader: 'QSC-001', behavior: 'Search & Track', status: 'Standby' },
    { id: 'SWM-003', name: 'Border Guard', members: ['BYK-001', 'BYK-002', 'BYK-005'], leader: 'BYK-001', behavior: 'Patrol', status: 'Active' },
  ]);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="military-panel p-3"><Cpu className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-lg font-display uppercase text-foreground">Swarm & Autonomy</h1>
              <p className="text-xs font-mono text-muted-foreground">Multi-drone autonomous coordination</p>
            </div>
          </div>
          <Button size="sm" className="font-mono text-[10px] uppercase bg-primary text-primary-foreground">
            <Plus className="w-3 h-3 mr-1" /> Create Swarm
          </Button>
        </div>

        {swarms.map(s => (
          <div key={s.id} className="military-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display text-foreground">{s.name}</h3>
                <p className="text-[10px] font-mono text-muted-foreground">{s.id} • Leader: {s.leader} • {s.members.length} members</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${s.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>{s.status}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-accent/20 text-accent">{s.behavior}</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap mb-3">
              {s.members.map(m => <span key={m} className="text-[9px] font-mono px-2 py-0.5 bg-secondary rounded-sm text-secondary-foreground">{m}</span>)}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => toast({ title: 'Swarm Mission', description: `Assigned to ${s.name}` })}>Assign Mission</Button>
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => toast({ title: 'Handoff', description: `Leader handoff for ${s.name}` })}>Force Handoff</Button>
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => toast({ title: 'Merge', description: `Merge initiated for ${s.name}` })}>Merge Swarms</Button>
              <Button size="sm" variant="outline" className="text-[9px] font-mono"><Play className="w-3 h-3 mr-1" /> Run Playback</Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

// ===== OTA & FIRMWARE =====
const FirmwarePage = () => {
  const [showReauth, setShowReauth] = useState(false);
  const firmwares = [
    { version: 'v8.3.1', model: 'Bayraktar TB2', hash: 'sha256:a1b2c3...', status: 'Staged', progress: 0 },
    { version: 'v12.1.0', model: 'MQ-9B Reaper', hash: 'sha256:d4e5f6...', status: 'Rolling Out', progress: 65 },
    { version: 'v3.7.2', model: 'Coyote Interceptor', hash: 'sha256:g7h8i9...', status: 'Complete', progress: 100 },
    { version: 'v2.4.0', model: 'Q-Scout Mk1', hash: 'sha256:j0k1l2...', status: 'Pending', progress: 0 },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="military-panel p-3"><Download className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-lg font-display uppercase text-foreground">OTA & Firmware</h1>
              <p className="text-xs font-mono text-muted-foreground">Signed firmware deployment pipeline</p>
            </div>
          </div>
          <Button size="sm" className="font-mono text-[10px] uppercase bg-primary text-primary-foreground">
            <Upload className="w-3 h-3 mr-1" /> Upload Firmware
          </Button>
        </div>

        {firmwares.map((f, i) => (
          <div key={i} className="military-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-display text-foreground">{f.model} — {f.version}</h3>
                <p className="text-[10px] font-mono text-muted-foreground">Hash: {f.hash}</p>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${f.status === 'Complete' ? 'bg-primary/20 text-primary' : f.status === 'Rolling Out' ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>{f.status}</span>
            </div>
            {f.progress > 0 && f.progress < 100 && <Progress value={f.progress} className="h-1.5 mb-2" />}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => toast({ title: 'Stage Update', description: f.version })}>Stage</Button>
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => setShowReauth(true)}>
                <RotateCcw className="w-3 h-3 mr-1" /> Rollback
              </Button>
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => setShowReauth(true)}>Force Apply</Button>
            </div>
          </div>
        ))}

        <ReauthModal open={showReauth} onClose={() => setShowReauth(false)} onSuccess={() => { setShowReauth(false); toast({ title: 'Action Authorized', description: 'Supervisor confirmation received.' }); }} actionLabel="OTA Firmware Action" />
      </div>
    </ScrollArea>
  );
};

// ===== SIMULATION LAB =====
const SimulationPage = () => {
  const [speed, setSpeed] = useState('1x');
  const scenarios = [
    { name: 'Border Patrol', description: 'Standard patrol with 4 drones along western border', drones: 4 },
    { name: 'Tracking Exercise', description: 'Multi-target tracking with handoff between drone pairs', drones: 6 },
    { name: 'Comms Loss Recovery', description: 'Simulate comms loss and autonomous recovery behavior', drones: 2 },
    { name: 'Swarm Intercept', description: '10-drone swarm intercept of 5 fast-moving targets', drones: 10 },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="military-panel p-3"><FlaskConical className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-lg font-display uppercase text-foreground">Simulation Lab</h1>
              <p className="text-xs font-mono text-muted-foreground">Digital twin environment for mission rehearsal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">Speed:</span>
            {['0.25x', '1x', '2x', '5x'].map(s => (
              <button key={s} onClick={() => setSpeed(s)} className={`text-[10px] font-mono px-2 py-1 rounded-sm border transition-colors ${speed === s ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((s, i) => (
            <div key={i} className="military-panel p-4">
              <h3 className="text-sm font-display text-foreground mb-2">{s.name}</h3>
              <p className="text-[10px] font-mono text-muted-foreground mb-3">{s.description}</p>
              <p className="text-[9px] font-mono text-primary mb-3">{s.drones} drones required</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-[9px] font-mono"><Play className="w-3 h-3 mr-1" /> Run Scenario</Button>
                <Button size="sm" variant="outline" className="text-[9px] font-mono">Replay</Button>
                <Button size="sm" variant="outline" className="text-[9px] font-mono">Export Results</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

// ===== INTEGRATIONS =====
const IntegrationsPage = () => {
  const connectors = [
    { name: 'C2 Data Link', status: 'Connected', type: 'STANAG 4586' },
    { name: 'Weather API', status: 'Connected', type: 'METAR/TAF' },
    { name: 'GIS Platform', status: 'Disconnected', type: 'WMS/WMTS' },
    { name: 'Satellite Feed', status: 'Connected', type: 'Planet API' },
    { name: 'SIEM Integration', status: 'Disconnected', type: 'Syslog/CEF' },
    { name: 'Radar Tracks', status: 'Connected', type: 'ADS-B/PSR' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="military-panel p-3"><Link2 className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-lg font-display uppercase text-foreground">Integrations</h1>
            <p className="text-xs font-mono text-muted-foreground">External system interfaces and data exchange</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((c, i) => (
            <div key={i} className="military-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-display text-foreground">{c.name}</h3>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${c.status === 'Connected' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>{c.status}</span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mb-3">Protocol: {c.type}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-[9px] font-mono"><Wifi className="w-3 h-3 mr-1" /> Test Connection</Button>
                <Button size="sm" variant="outline" className="text-[9px] font-mono">Map Data Sync</Button>
                <Button size="sm" variant="outline" className="text-[9px] font-mono">Import Tracks</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

// ===== SECURITY =====
const SecurityPage = () => {
  const [showReauth, setShowReauth] = useState(false);
  const [searchLog, setSearchLog] = useState('');
  const auditLogs = [
    { time: '14:23:17', user: 'OPR-2741', action: 'LOGIN', detail: 'Authenticated via PKI + 2FA' },
    { time: '14:20:05', user: 'OPR-2741', action: 'MISSION_CREATE', detail: 'Created Operation Eagle Shield' },
    { time: '14:18:42', user: 'SYSTEM', action: 'ALERT', detail: 'Hostile UAV detected — auto-tasking triggered' },
    { time: '13:36:00', user: 'SYSTEM', action: 'COMMS_LOSS', detail: 'QSC-003 offline — failsafe initiated' },
    { time: '12:00:00', user: 'OPR-1822', action: 'FIRMWARE_UPLOAD', detail: 'v8.3.1 uploaded for TB2 fleet' },
    { time: '08:30:00', user: 'OPR-2741', action: 'EXPORT', detail: 'Analytics report exported (re-auth verified)' },
  ];
  const filteredLogs = auditLogs.filter(l => l.action.includes(searchLog.toUpperCase()) || l.user.includes(searchLog.toUpperCase()) || l.detail.toLowerCase().includes(searchLog.toLowerCase()));

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="military-panel p-3"><ShieldCheck className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-lg font-display uppercase text-foreground">Security</h1>
            <p className="text-xs font-mono text-muted-foreground">PKI, RBAC, and audit trail management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2"><Key className="w-4 h-4 text-accent" /> PKI Keys</h3>
            <div className="space-y-2 text-[10px] font-mono">
              {['RPR-001', 'BYK-001', 'CYT-001', 'QSC-001'].map(id => (
                <div key={id} className="flex justify-between">
                  <span className="text-muted-foreground">{id}</span>
                  <span className="text-primary">SHA256:{Math.random().toString(36).substr(2, 8)}</span>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3 text-[9px] font-mono" onClick={() => setShowReauth(true)}>Rotate Keys</Button>
          </div>

          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> RBAC</h3>
            <div className="space-y-2 text-[10px] font-mono">
              {[{ user: 'OPR-2741', role: 'Commander', perms: 'Full' }, { user: 'OPR-1822', role: 'Operator', perms: 'Read/Execute' }, { user: 'OPR-3309', role: 'Analyst', perms: 'Read Only' }].map(u => (
                <div key={u.user} className="flex justify-between">
                  <span className="text-foreground">{u.user}</span>
                  <span className="text-muted-foreground">{u.role} — {u.perms}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> Certificates</h3>
            <div className="space-y-2 text-[10px] font-mono text-muted-foreground">
              <p>Root CA: Valid until 2028-12-31</p>
              <p>Drone CA: Valid until 2027-06-30</p>
              <p>Operator CA: Valid until 2027-03-06</p>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3 text-[9px] font-mono">Upload CA Cert</Button>
          </div>
        </div>

        <div className="military-panel p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-display uppercase text-foreground">Audit Logs</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input value={searchLog} onChange={e => setSearchLog(e.target.value)} placeholder="Filter logs..." className="pl-7 h-7 text-[10px] font-mono bg-background w-48" />
              </div>
              <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => setShowReauth(true)}>Export Logs</Button>
            </div>
          </div>
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border">
                {['Time', 'User', 'Action', 'Detail'].map(h => <th key={h} className="text-left py-1 px-2 text-muted-foreground uppercase font-normal">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((l, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                  <td className="py-1 px-2 text-muted-foreground">{l.time}</td>
                  <td className="py-1 px-2 text-foreground">{l.user}</td>
                  <td className="py-1 px-2 text-primary">{l.action}</td>
                  <td className="py-1 px-2 text-muted-foreground">{l.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReauthModal open={showReauth} onClose={() => setShowReauth(false)} onSuccess={() => { setShowReauth(false); toast({ title: 'Authorized', description: 'Action authorized via re-auth' }); }} actionLabel="Security Action" />
      </div>
    </ScrollArea>
  );
};

// ===== SETTINGS =====
const SettingsPage = () => {
  const [showReauth, setShowReauth] = useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="military-panel p-3"><Settings className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-lg font-display uppercase text-foreground">Settings</h1>
            <p className="text-xs font-mono text-muted-foreground">System configuration and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2"><Palette className="w-4 h-4 text-accent" /> Branding</h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Primary Accent</span><div className="w-6 h-4 bg-primary rounded-sm" /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Alert Color</span><div className="w-6 h-4 bg-accent rounded-sm" /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Font</span><span className="text-foreground">Orbitron / JetBrains Mono</span></div>
            </div>
          </div>
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2"><Wifi className="w-4 h-4 text-accent" /> Network</h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">mTLS</span><span className="text-primary">Enabled</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Proxy</span><span className="text-muted-foreground">Direct</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cert Pinning</span><span className="text-primary">Active</span></div>
            </div>
          </div>
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3 flex items-center gap-2"><Database className="w-4 h-4 text-accent" /> Backup & Restore</h3>
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground">Last backup: 2026-03-05 23:00 UTC</p>
              <Button size="sm" variant="outline" className="w-full text-[9px] font-mono" onClick={() => setShowReauth(true)}>Download DB Snapshot</Button>
              <Button size="sm" variant="outline" className="w-full text-[9px] font-mono" onClick={() => setShowReauth(true)}>Restore from Backup</Button>
            </div>
          </div>
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3">System Health</h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Database</span><span className="text-primary">● Online</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Message Broker</span><span className="text-primary">● Online</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disk Usage</span><span className="text-foreground">42% (1.2TB / 2.8TB)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">CPU Load</span><span className="text-foreground">18%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Memory</span><span className="text-foreground">6.2GB / 32GB</span></div>
            </div>
          </div>
        </div>

        <ReauthModal open={showReauth} onClose={() => setShowReauth(false)} onSuccess={() => { setShowReauth(false); toast({ title: 'Authorized', description: 'Backup action authorized' }); }} actionLabel="Backup/Restore Action" />
      </div>
    </ScrollArea>
  );
};

// ===== ROUTER =====
const pageComponents: Record<string, React.FC> = {
  swarm: SwarmPage,
  firmware: FirmwarePage,
  simulation: SimulationPage,
  integrations: IntegrationsPage,
  security: SecurityPage,
  settings: SettingsPage,
};

const PlaceholderPage = ({ pageKey }: { pageKey: string }) => {
  const PageComponent = pageComponents[pageKey];
  if (PageComponent) return <PageComponent />;
  return <div className="p-6 text-muted-foreground font-mono">Module not found</div>;
};

export default PlaceholderPage;