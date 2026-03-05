import { LucideIcon, Cpu, Download, FlaskConical, Link2, ShieldCheck, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const pages: Record<string, { icon: LucideIcon; title: string; description: string; capabilities: string[] }> = {
  swarm: {
    icon: Cpu, title: 'Swarm & Autonomy',
    description: 'Multi-drone autonomous coordination and swarm intelligence management.',
    capabilities: [
      'Swarm formation editor with drag-and-drop',
      'Autonomous behavior rule engine',
      'Inter-drone communication mesh visualization',
      'Collision avoidance parameter tuning',
      'Emergent behavior simulation sandbox',
      'Swarm-vs-swarm wargaming mode',
    ],
  },
  firmware: {
    icon: Download, title: 'OTA & Firmware',
    description: 'Over-the-air firmware management and deployment pipeline.',
    capabilities: [
      'Firmware version matrix across fleet',
      'Staged rollout with canary deployment',
      'Rollback capability with one-click restore',
      'Cryptographic signature verification',
      'Bandwidth-optimized delta updates',
      'Post-update health verification',
    ],
  },
  simulation: {
    icon: FlaskConical, title: 'Simulation Lab',
    description: 'Digital twin environment for mission rehearsal and scenario planning.',
    capabilities: [
      'Full physics simulation of drone flight dynamics',
      'Weather and terrain modeling',
      'Adversarial scenario generation (red team)',
      'Multi-domain integration testing',
      'After-action review with replay',
      'AI model training data generation',
    ],
  },
  integrations: {
    icon: Link2, title: 'Integrations',
    description: 'External system interfaces and data exchange management.',
    capabilities: [
      'NATO STANAG data link integration',
      'Radar & ADS-B feed ingestion',
      'Satellite imagery overlay (Planet, Maxar)',
      'Joint Force C2 system interoperability',
      'Weather data API (METAR/TAF)',
      'SIGINT/ELINT platform data fusion',
    ],
  },
  security: {
    icon: ShieldCheck, title: 'Security',
    description: 'Cybersecurity posture management and access control.',
    capabilities: [
      'Zero-trust network architecture',
      'PKI certificate lifecycle management',
      'Audit log with tamper-proof chain',
      'Intrusion detection system (IDS) dashboard',
      'Data-at-rest and in-transit encryption status',
      'Operator access matrix and RBAC',
    ],
  },
  settings: {
    icon: Settings, title: 'Settings',
    description: 'System configuration and operator preferences.',
    capabilities: [
      'Display and theme preferences',
      'Alert threshold configuration',
      'Map overlay and layer management',
      'Notification routing rules',
      'Data retention policies',
      'System backup and restore',
    ],
  },
};

const PlaceholderPage = ({ pageKey }: { pageKey: string }) => {
  const page = pages[pageKey];
  if (!page) return null;
  const Icon = page.icon;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="military-panel p-3">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display uppercase text-foreground">{page.title}</h1>
            <p className="text-xs font-mono text-muted-foreground">{page.description}</p>
          </div>
        </div>

        <div className="military-panel p-6">
          <h2 className="text-xs font-display uppercase text-accent mb-4">Planned Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {page.capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-secondary/20 rounded-sm">
                <span className="text-primary font-mono text-xs mt-0.5">▸</span>
                <span className="text-[11px] font-mono text-foreground/80">{cap}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 border border-accent/20 bg-accent/5 rounded-sm">
            <p className="text-[10px] font-mono text-accent text-center uppercase">
              Module under development — Expected deployment Q2 2026
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default PlaceholderPage;
