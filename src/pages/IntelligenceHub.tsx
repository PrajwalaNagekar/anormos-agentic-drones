import { useState } from 'react';
import { BookOpen, Globe, AlertTriangle, Atom, MapPin, ChevronRight, Shield } from 'lucide-react';
import { intelArticles, nuclearStates, qatarContext } from '@/data/intelligence';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const threatColors = { high: 'bg-destructive/20 text-destructive', medium: 'bg-accent/20 text-accent', low: 'bg-primary/20 text-primary', info: 'bg-muted text-muted-foreground' };

const IntelligenceHub = () => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Daily Digest */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Globe, title: 'Global Activity', value: '7 active drone conflicts worldwide', color: 'text-accent' },
            { icon: Shield, title: 'System Updates', value: 'Firmware v8.3.1 available for TB2 fleet', color: 'text-primary' },
            { icon: MapPin, title: 'Regional Intelligence', value: 'Elevated drone activity detected — Persian Gulf AO', color: 'text-destructive' },
          ].map((card, i) => (
            <div key={i} className="military-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{card.title}</span>
              </div>
              <p className="text-xs font-mono text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="drones" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="bg-transparent h-9">
            <TabsTrigger value="drones" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">
              Drone Programs
            </TabsTrigger>
            <TabsTrigger value="nuclear" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">
              Nuclear Assessment
            </TabsTrigger>
            <TabsTrigger value="qatar" className="text-[10px] font-mono uppercase data-[state=active]:text-primary data-[state=active]:bg-primary/10">
              Qatar Context
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="drones" className="flex-1 m-0">
          <div className="flex h-full">
            {/* List */}
            <ScrollArea className="w-96 border-r border-border">
              <div className="p-3 space-y-2">
                {intelArticles.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArticle(a.id)}
                    className={`w-full text-left military-panel p-3 transition-colors ${selectedArticle === a.id ? 'border-primary' : 'hover:border-primary/30'}`}
                  >
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

            {/* Detail */}
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
                    <div className="military-panel p-4">
                      <h3 className="text-xs font-display uppercase text-foreground mb-3">Key Intelligence Points</h3>
                      <ul className="space-y-2">
                        {a.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] font-mono text-foreground/80">
                            <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                            {d}
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
                      {['Country', 'Warheads', 'Status', 'Last Test', 'Policy', 'ICBM', 'SLBM', 'Bomber'].map(h => (
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
                          <td key={i} className="py-2 px-3">
                            <span className={v ? 'text-destructive' : 'text-muted-foreground/30'}>
                              {v ? '●' : '○'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="qatar" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-3xl">
              <h2 className="text-sm font-display uppercase text-foreground mb-4">Qatar Defence Context</h2>
              {[
                { title: 'Regional Neighbors', items: qatarContext.neighbors },
                { title: 'Nuclear-Armed Neighbors', items: qatarContext.nuclearNeighbors },
                { title: 'Defence Alliances', items: qatarContext.defenseAlliances },
                { title: 'Recent Procurements', items: qatarContext.recentProcurements },
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
                <p className="text-[11px] font-mono text-muted-foreground">{qatarContext.civilNuclear}</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceHub;
