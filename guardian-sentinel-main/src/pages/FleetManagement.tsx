import { Wrench, Battery, Signal, Search, Sun, MoreVertical } from 'lucide-react';
import { drones, droneModels, type Drone, type DroneModel } from '@/data/drones';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { toast } from '@/hooks/use-toast';

const statusBg: Record<string, string> = {
  active: 'bg-primary/20 text-primary', patrol: 'bg-primary/10 text-primary', pursuit: 'bg-destructive/20 text-destructive',
  returning: 'bg-accent/20 text-accent', standby: 'bg-muted text-muted-foreground', maintenance: 'bg-muted text-muted-foreground', offline: 'bg-destructive/20 text-destructive',
};

const healthHistory = Array.from({ length: 24 }, (_, i) => ({ hour: `${String(i).padStart(2, '0')}:00`, avgBattery: Math.round(60 + Math.random() * 30), activeCount: Math.round(5 + Math.random() * 10), alerts: Math.round(Math.random() * 5) }));

const maintenanceSchedule = [
  { drone: 'BYK-004', type: 'Scheduled Service', date: '2026-03-06', status: 'In Progress' },
  { drone: 'RPR-002', type: 'Engine Overhaul', date: '2026-03-08', status: 'Scheduled' },
  { drone: 'CYT-001', type: 'Firmware Update', date: '2026-03-07', status: 'Scheduled' },
  { drone: 'QSC-003', type: 'Recovery & Repair', date: '2026-03-05', status: 'Urgent' },
  { drone: 'BYK-001', type: 'Sensor Calibration', date: '2026-03-10', status: 'Scheduled' },
];

const partsInventory = [
  { part: 'EO/IR Sensor Module', stock: 12, threshold: 5, status: 'OK' },
  { part: 'Propulsion Motor A7', stock: 3, threshold: 5, status: 'LOW' },
  { part: 'Battery Pack Li-S 48V', stock: 28, threshold: 10, status: 'OK' },
  { part: 'FLIR Gimbal Assembly', stock: 4, threshold: 4, status: 'CRITICAL' },
  { part: 'GPS/INS Module', stock: 15, threshold: 5, status: 'OK' },
  { part: 'Solar Panel Array 200W', stock: 8, threshold: 6, status: 'OK' },
];

const FleetManagement = () => {
  const [search, setSearch] = useState('');
  const filtered = drones.filter(d => d.callsign.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()));

  const handleDroneAction = (action: string, droneId: string) => {
    toast({ title: action, description: `${action} executed for ${droneId}` });
  };

  return (
    <Tabs defaultValue="overview" className="flex flex-col h-full">
      <div className="border-b border-border px-4 flex items-center justify-between">
        <TabsList className="bg-transparent h-9">
          {['overview', 'models', 'maintenance', 'parts', 'diagnostics'].map(t => (
            <TabsTrigger key={t} value={t} className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">{t}</TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <span className="text-xs font-display uppercase text-foreground">Fleet Management</span>
        </div>
      </div>

      <TabsContent value="overview" className="flex-1 m-0">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fleet..." className="pl-7 h-7 text-[10px] font-mono bg-background" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-border">
                  {['Callsign', 'ID', 'Model', 'Status', 'Battery', 'Solar', 'Est. Flight', 'Signal', 'Action'].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-muted-foreground uppercase font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="py-1.5 px-2 text-foreground font-bold">{d.callsign}</td>
                    <td className="py-1.5 px-2 text-muted-foreground">{d.id}</td>
                    <td className="py-1.5 px-2 text-muted-foreground">{d.model}</td>
                    <td className="py-1.5 px-2"><span className={`px-1.5 py-0.5 rounded-sm text-[9px] ${statusBg[d.status]}`}>{d.status.toUpperCase()}</span></td>
                    <td className="py-1.5 px-2"><span className={d.battery_pct < 30 ? 'text-destructive' : 'text-primary'}>{d.battery_pct}%</span></td>
                    <td className="py-1.5 px-2">
                      {d.solar_active ? <span className="text-accent flex items-center gap-1"><Sun className="w-3 h-3" /> +{d.solar_charge_rate}W</span> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="py-1.5 px-2 text-muted-foreground">{d.estimated_flight_time > 0 ? `${d.estimated_flight_time}m` : '—'}</td>
                    <td className="py-1.5 px-2"><span className={d.signal < 50 ? 'text-accent' : 'text-primary'}>{d.signal}%</span></td>
                    <td className="py-1.5 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0"><MoreVertical className="w-3 h-3" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border">
                          <DropdownMenuItem className="text-[10px] font-mono" onClick={() => handleDroneAction('Assign Mission', d.id)}>Assign Mission</DropdownMenuItem>
                          <DropdownMenuItem className="text-[10px] font-mono" onClick={() => handleDroneAction('Force RTL', d.id)}>Force RTL</DropdownMenuItem>
                          <DropdownMenuItem className="text-[10px] font-mono" onClick={() => handleDroneAction('Schedule OTA', d.id)}>Schedule OTA</DropdownMenuItem>
                          <DropdownMenuItem className="text-[10px] font-mono" onClick={() => handleDroneAction('Mark for Maintenance', d.id)}>Mark for Maintenance</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </TabsContent>

      <TabsContent value="models" className="flex-1 m-0">
        <ScrollArea className="h-full">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(droneModels) as [DroneModel, typeof droneModels[DroneModel]][]).map(([model, spec]) => (
              <div key={model} className="military-panel p-4">
                <h3 className="text-sm font-display text-foreground mb-3">{model}</h3>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div><span className="text-muted-foreground">Fleet Count:</span> <span className="text-primary font-bold">{spec.count}</span></div>
                  <div><span className="text-muted-foreground">Max Altitude:</span> <span className="text-foreground">{spec.maxAlt.toLocaleString()} ft</span></div>
                  <div><span className="text-muted-foreground">Max Speed:</span> <span className="text-foreground">{spec.maxSpeed} kt</span></div>
                  <div><span className="text-muted-foreground">Range:</span> <span className="text-foreground">{spec.range} km</span></div>
                  <div><span className="text-muted-foreground">Endurance:</span> <span className="text-foreground">{spec.endurance}</span></div>
                </div>
                <div className="mt-3">
                  <p className="text-[9px] font-mono text-muted-foreground uppercase mb-1">Sensors</p>
                  <div className="flex flex-wrap gap-1">{spec.sensors.map(s => <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 bg-secondary rounded-sm text-secondary-foreground">{s}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="maintenance" className="flex-1 m-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-sm font-display uppercase text-foreground mb-4">Maintenance Schedule</h2>
            <div className="space-y-2">
              {maintenanceSchedule.map((m, i) => (
                <div key={i} className="military-panel p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-foreground font-bold">{m.drone}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{m.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-muted-foreground">{m.date}</p>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${m.status === 'Urgent' ? 'bg-destructive/20 text-destructive' : m.status === 'In Progress' ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-primary'}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="parts" className="flex-1 m-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-sm font-display uppercase text-foreground mb-4">Parts & Inventory</h2>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-border">
                  {['Part', 'Stock', 'Threshold', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-muted-foreground uppercase font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partsInventory.map((p, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-2 px-3 text-foreground">{p.part}</td>
                    <td className="py-2 px-3 text-foreground">{p.stock}</td>
                    <td className="py-2 px-3 text-muted-foreground">{p.threshold}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${p.status === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : p.status === 'LOW' ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-primary'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="diagnostics" className="flex-1 m-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            <div className="military-panel p-4">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Fleet Battery History (24h)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={healthHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(105 20% 18%)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} interval={3} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(100 20% 7%)', border: '1px solid hsl(105 20% 18%)', fontSize: 10 }} />
                  <Line type="monotone" dataKey="avgBattery" stroke="hsl(105 50% 50%)" strokeWidth={2} dot={false} name="Avg Battery %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="military-panel p-4">
              <h3 className="text-xs font-display uppercase text-foreground mb-3">Active Drone Count (24h)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={healthHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(105 20% 18%)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} interval={3} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(100 20% 7%)', border: '1px solid hsl(105 20% 18%)', fontSize: 10 }} />
                  <Bar dataKey="activeCount" fill="hsl(105 40% 45%)" name="Active Drones" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default FleetManagement;