import { useState } from 'react';
import { BookOpen, Globe, AlertTriangle, Atom, MapPin, ChevronRight, Shield, Search, Eye, Flag, Plus, Layers } from 'lucide-react';
import { intelArticles, nuclearStates, nationalContext } from '@/data/intelligence';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const threatColors = { high: 'bg-destructive/20 text-destructive', medium: 'bg-accent/20 text-accent', low: 'bg-primary/20 text-primary', info: 'bg-muted text-muted-foreground' };

const IntelligenceHub = () => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geointLayers, setGeointLayers] = useState({ satellite: false, elevation: false, nofly: true });

  const filteredArticles = intelArticles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: string, context: string) => {
    toast({ title: action, description: `${action} initiated for: ${context}` });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { icon: Globe, title: 'Global Activity', value: '7 active drone conflicts worldwide', color: 'text-accent', actions: ['Open Details', 'Pin to Mission'] },
            { icon: Shield, title: 'System Updates', value: 'Firmware v8.3.1 available for TB2 fleet', color: 'text-primary', actions: ['Open', 'Schedule Update'] },
            { icon: MapPin, title: 'Regional Intel', value: 'Elevated drone activity — Gulf AO', color: 'text-destructive', actions: ['View Zone', 'Create Incident'] },
            { icon: Layers, title: 'GEOINT Layers', value: `${Object.values(geointLayers).filter(Boolean).length}/3 active`, color: 'text-primary', actions: [] },
          ].map((card, i) => (
            <div key={i} className="military-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{card.title}</span>
              </div>
              <p className="text-xs font-mono text-foreground mb-2">{card.value}</p>
              {card.title === 'GEOINT Layers' ? (
                <div className="flex gap-1">
                  {Object.entries(geointLayers).map(([k, v]) => (
                    <button key={k} onClick={() => setGeointLayers(prev => ({ ...prev, [k]: !prev[k as keyof typeof prev] }))}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border transition-colors ${v ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border'}`}>
                      {k}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-1">
                  {card.actions.map(a => (
                    <Button key={a} size="sm" variant="outline" className="h-5 text-[9px] font-mono px-2" onClick={() => handleAction(a, card.title)}>
                      {a}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="drones" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="bg-transparent h-9">
            <TabsTrigger value="drones" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">Drone Programs</TabsTrigger>
            <TabsTrigger value="nuclear" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">Nuclear Assessment</TabsTrigger>
            <TabsTrigger value="national" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">National Context</TabsTrigger>
            <TabsTrigger value="targetdb" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">Target DB</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="drones" className="flex-1 m-0">
          <div className="flex h-full">
            <ScrollArea className="w-96 border-r border-border">
              <div className="p-3 space-y-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search articles..." className="pl-7 h-7 text-[10px] font-mono bg-background" />
                </div>
                {filteredArticles.map(a => (
                  <button key={a.id} onClick={() => setSelectedArticle(a.id)} className={`w-full text-left military-panel p-3 transition-colors ${selectedArticle === a.id ? 'border-primary' : 'hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-foreground font-bold">{a.country}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${threatColors[a.threat]}`}>{a.threat.toUpperCase()}</span>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground line-clamp-2">{a.title}</p>
                    <p className="text-[9px] font-mono text-muted-foreground/50 mt-1">{a.lastUpdated}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="flex-1">
              {selectedArticle ? (() => {
                const a = intelArticles.find(x => x.id === selectedArticle)!;
                return (
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm ${threatColors[a.threat]}`}>{a.threat.toUpperCase()} THREAT</span>
                        <span className="text-[9px] font-mono text-muted-foreground">{a.category}</span>
                      </div>
                      <h2 className="text-lg font-display text-foreground mb-2">{a.title}</h2>
                      <p className="text-xs font-mono text-muted-foreground">{a.summary}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => handleAction('Assign Patrol', a.title)}>
                        <Eye className="w-3 h-3 mr-1" /> Assign Patrol
                      </Button>
                      <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => handleAction('Flag Evidence', a.title)}>
                        <Flag className="w-3 h-3 mr-1" /> Flag Evidence
                      </Button>
                      <Button size="sm" variant="outline" className="text-[9px] font-mono" onClick={() => handleAction('Create Incident', a.title)}>
                        <Plus className="w-3 h-3 mr-1" /> Create Incident
                      </Button>
                    </div>
                    <div className="military-panel p-4">
                      <h3 className="text-xs font-display uppercase text-foreground mb-3">Key Intelligence Points</h3>
                      <ul className="space-y-2">
                        {a.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] font-mono text-foreground/80">
                            <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[9px] font-mono text-muted-foreground">Last updated: {a.lastUpdated} | Classification: SECRET//NOFORN</p>
                  </div>
                );
              })() : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-xs font-mono">Select an intelligence article</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="nuclear" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h2 className="text-sm font-display uppercase text-foreground mb-4 flex items-center gap-2">
                <Atom className="w-5 h-5 text-accent" /> Global Nuclear Arsenal Assessment
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-border">
                      {['Nation', 'Warheads', 'Status', 'Last Test', 'Policy', 'ICBM', 'SLBM', 'Bomber'].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-muted-foreground uppercase font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nuclearStates.map(n => (
                      <tr key={n.country} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-2 px-3 text-foreground font-bold">{n.country}</td>
                        <td className="py-2 px-3 text-accent">{n.warheads.toLocaleString()}</td>
                        <td className="py-2 px-3 text-muted-foreground">{n.status}</td>
                        <td className="py-2 px-3 text-muted-foreground">{n.lastTest}</td>
                        <td className="py-2 px-3 text-muted-foreground">{n.policy}</td>
                        {[n.icbm, n.slbm, n.bomber].map((v, i) => (
                          <td key={i} className="py-2 px-3"><span className={v ? 'text-destructive' : 'text-muted-foreground/30'}>{v ? '●' : '○'}</span></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="national" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-3xl">
              <h2 className="text-sm font-display uppercase text-foreground mb-4">National Defence Context</h2>
              {[
                { title: 'Regional Neighbors', items: nationalContext.neighbors },
                { title: 'Nuclear-Armed Neighbors', items: nationalContext.nuclearNeighbors },
                { title: 'Defence Alliances', items: nationalContext.defenseAlliances },
                { title: 'Recent Procurements', items: nationalContext.recentProcurements },
              ].map(section => (
                <div key={section.title} className="military-panel p-4">
                  <h3 className="text-xs font-display uppercase text-foreground mb-2">{section.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map(item => (
                      <span key={item} className="text-[10px] font-mono px-2 py-1 bg-secondary rounded-sm text-secondary-foreground">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="military-panel p-4">
                <h3 className="text-xs font-display uppercase text-foreground mb-2">Civil Nuclear Status</h3>
                <p className="text-[11px] font-mono text-muted-foreground">{nationalContext.civilNuclear}</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="targetdb" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h2 className="text-sm font-display uppercase text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" /> Target Database
              </h2>
              <div className="space-y-2">
                {Array.from({ length: 8 }, (_, i) => ({
                  id: `SIG-${String(i + 1).padStart(3, '0')}`,
                  type: ['Fixed Wing UAV', 'Rotary UAV', 'Loitering Munition', 'FPV Drone'][i % 4],
                  signature: `RF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                  lastSeen: `2026-03-0${Math.min(6, i + 1)}`,
                  threat: i < 3 ? 'high' : 'medium',
                })).map(t => (
                  <div key={t.id} className="military-panel p-3 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => handleAction('Open Target Detail', t.id)}>
                    <div>
                      <span className="text-xs font-mono text-foreground font-bold">{t.id}</span>
                      <p className="text-[10px] font-mono text-muted-foreground">{t.type} — Sig: {t.signature}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${t.threat === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>
                        {t.threat.toUpperCase()}
                      </span>
                      <p className="text-[9px] font-mono text-muted-foreground mt-1">{t.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceHub;