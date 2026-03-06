import { useState, useEffect } from 'react';
import { type Drone } from '@/data/drones';
import { Crosshair } from 'lucide-react';

interface Props {
  drones: Drone[];
  selectedDrone: Drone | null;
  onSelectDrone: (d: Drone) => void;
}

const statusColors: Record<string, string> = {
  active: '#6aa84f', patrol: '#4a7537', pursuit: '#DC2626',
  returning: '#D4A537', standby: '#355427', maintenance: '#555', offline: '#DC2626',
};

const TacticalMap = ({ drones, selectedDrone, onSelectDrone }: Props) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const mapCoord = (lat: number, lng: number) => {
    const x = ((lng - 51.2) / 0.5) * 100;
    const y = ((25.5 - lat) / 0.3) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  useEffect(() => {
    const initial: Record<string, { x: number; y: number }> = {};
    drones.forEach(d => { initial[d.id] = mapCoord(d.lat, d.lng); });
    setPositions(initial);

    const interval = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev };
        drones.forEach(d => {
          if (['active', 'patrol', 'pursuit', 'returning'].includes(d.status)) {
            const p = next[d.id];
            if (p) {
              const rad = (d.heading * Math.PI) / 180;
              const speed = d.speed * 0.002;
              let nx = p.x + Math.sin(rad) * speed;
              let ny = p.y - Math.cos(rad) * speed;
              if (nx < 5 || nx > 95) nx = p.x - Math.sin(rad) * speed;
              if (ny < 5 || ny > 95) ny = p.y + Math.cos(rad) * speed;
              next[d.id] = { x: nx, y: ny };
            }
          }
        });
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-background grid-tactical overflow-hidden">
      <div className="absolute inset-0 scanline z-10 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
        <Crosshair className="w-32 h-32 text-primary" />
      </div>
      <div className="absolute top-3 left-3 z-20">
        <div className="military-panel px-3 py-1.5">
          <span className="text-[10px] font-mono text-primary uppercase">TACTICAL MAP — NATIONAL AO</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-20">
        <div className="military-panel w-10 h-10 flex items-center justify-center">
          <span className="text-xs font-display text-primary font-bold">N</span>
        </div>
      </div>

      {drones.map(d => {
        const pos = positions[d.id];
        if (!pos) return null;
        const isSelected = selectedDrone?.id === d.id;
        const color = statusColors[d.status] || '#555';

        return (
          <button key={d.id} onClick={() => onSelectDrone(d)} className="absolute z-20 group" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>
            {['active', 'pursuit'].includes(d.status) && (
              <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${color}33`, width: 24, height: 24, left: -4, top: -4 }} />
            )}
            <span className="block w-4 h-4 rounded-full border-2 transition-transform" style={{ backgroundColor: color, borderColor: isSelected ? '#fff' : color, boxShadow: `0 0 8px ${color}`, transform: isSelected ? 'scale(1.5)' : 'scale(1)' }} />
            {d.status !== 'offline' && d.status !== 'maintenance' && d.status !== 'standby' && (
              <span className="absolute w-0.5 h-4 origin-bottom" style={{ backgroundColor: color, bottom: '50%', left: 'calc(50% - 1px)', transform: `rotate(${d.heading}deg)`, opacity: 0.6 }} />
            )}
            <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity px-1 py-0.5 bg-card border border-border rounded-sm" style={{ color }}>
              {d.callsign}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
        <div className="w-16 h-0.5 bg-primary/50" />
        <span className="text-[9px] font-mono text-muted-foreground">~10km</span>
      </div>

      <div className="absolute bottom-3 right-3 z-20 military-panel p-2 space-y-1">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-mono text-muted-foreground uppercase">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TacticalMap;