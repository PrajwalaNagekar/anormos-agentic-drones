import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Target, Clock, Crosshair, Gauge, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import ReauthModal from '@/components/ReauthModal';
import ExportProgress from '@/components/ExportProgress';
import { toast } from '@/hooks/use-toast';

const missionKPIs = [
  { label: 'Mission Success Rate', value: 94.2, unit: '%', icon: Target },
  { label: 'Avg Loiter Time', value: 6.8, unit: 'hrs', icon: Clock },
  { label: 'Detection Rate', value: 97.1, unit: '%', icon: Crosshair },
  { label: 'Fleet Readiness', value: 88.5, unit: '%', icon: Gauge },
];

const incursionData = [
  { month: 'Oct', eastern: 12, western: 5, maritime: 8 },
  { month: 'Nov', eastern: 15, western: 7, maritime: 6 },
  { month: 'Dec', eastern: 9, western: 4, maritime: 11 },
  { month: 'Jan', eastern: 18, western: 9, maritime: 7 },
  { month: 'Feb', eastern: 22, western: 11, maritime: 13 },
  { month: 'Mar', eastern: 14, western: 6, maritime: 9 },
];

const swarmData = [
  { name: 'Formation Accuracy', value: 96 },
  { name: 'Comm Sync', value: 99 },
  { name: 'Target Convergence', value: 91 },
  { name: 'Collision Avoidance', value: 100 },
];

const readinessData = [
  { name: 'MQ-9B Reaper', ready: 38, total: 45 },
  { name: 'Bayraktar TB2', ready: 108, total: 120 },
  { name: 'Coyote', ready: 185, total: 200 },
  { name: 'Q-Scout Mk1', ready: 72, total: 85 },
];

const Reports = () => {
  const [missionHistory, setMissionHistory] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ day: i + 1, missions: Math.round(3 + Math.random() * 8), success: Math.round(80 + Math.random() * 20) }))
  );
  const [showReauth, setShowReauth] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Streaming: update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionHistory(prev => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * updated.length);
        updated[idx] = { ...updated[idx], missions: Math.round(3 + Math.random() * 8), success: Math.round(80 + Math.random() * 20) };
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExportComplete = useCallback(() => {
    setExporting(false);
    // Signed audit event
    const auditEntry = { user: 'OPR-2741', action: 'export_report', timestamp: new Date().toISOString(), token: crypto.randomUUID() };
    console.log('[AUDIT] Export event:', JSON.stringify(auditEntry));
    // Simulate download
    const blob = new Blob([JSON.stringify({ report: 'ANORMOS skAI Analytics Export', data: missionHistory, audit: auditEntry }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `anormos-skai-report-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Secure export downloaded successfully.' });
  }, [missionHistory]);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-display uppercase text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Reports & Analytics
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">Period: Last 30 days • Live streaming</span>
            <Button size="sm" variant="outline" className="text-[10px] font-mono uppercase" onClick={() => setShowReauth(true)}>
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
          </div>
        </div>

        {exporting && <ExportProgress active={exporting} onComplete={handleExportComplete} />}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {missionKPIs.map((kpi, i) => (
            <div key={i} className="military-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-mono text-muted-foreground uppercase">{kpi.label}</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}<span className="text-sm text-muted-foreground">{kpi.unit}</span></p>
              <Progress value={kpi.value} className="h-1 mt-2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3">Incursion Trends by Region</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incursionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(105 20% 18%)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(100 20% 7%)', border: '1px solid hsl(105 20% 18%)', fontSize: 10 }} />
                <Bar dataKey="eastern" fill="hsl(0 72% 51%)" name="Eastern" />
                <Bar dataKey="western" fill="hsl(42 70% 52%)" name="Western" />
                <Bar dataKey="maritime" fill="hsl(200 70% 50%)" name="Maritime" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3">Mission Success Rate (30d) — Live</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={missionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(105 20% 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(100 10% 55%)' }} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(100 20% 7%)', border: '1px solid hsl(105 20% 18%)', fontSize: 10 }} />
                <Area type="monotone" dataKey="success" stroke="hsl(105 50% 50%)" fill="hsl(105 50% 50% / 0.2)" name="Success %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3">Swarm Efficiency Metrics</h3>
            <div className="space-y-3">
              {swarmData.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="text-primary">{s.value}%</span>
                  </div>
                  <Progress value={s.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="military-panel p-4">
            <h3 className="text-xs font-display uppercase text-foreground mb-3">Fleet Readiness by Model</h3>
            <div className="space-y-3">
              {readinessData.map(r => {
                const pct = Math.round((r.ready / r.total) * 100);
                return (
                  <div key={r.name}>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-muted-foreground">{r.name}</span>
                      <span className="text-foreground">{r.ready}/{r.total} <span className="text-primary">({pct}%)</span></span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ReauthModal
        open={showReauth}
        onClose={() => setShowReauth(false)}
        onSuccess={() => { setShowReauth(false); setExporting(true); }}
        actionLabel="Export Report Data"
      />
    </ScrollArea>
  );
};

export default Reports;