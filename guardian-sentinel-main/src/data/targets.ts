export interface Target {
  id: string;
  lat: number;
  lon: number;
  speed: number;
  heading: number;
  behavior: 'linear' | 'evasive';
  threat_level: 'high' | 'medium' | 'low';
  size: 'small' | 'medium' | 'large';
  assigned_drones: string[];
  status: 'active' | 'intercepted' | 'lost';
}

export const targets: Target[] = Array.from({ length: 22 }, (_, i) => ({
  id: `TGT-${String(i + 1).padStart(3, '0')}`,
  lat: 25.2 + Math.random() * 0.3,
  lon: 51.3 + Math.random() * 0.4,
  speed: 20 + Math.random() * 80,
  heading: Math.random() * 360,
  behavior: Math.random() > 0.5 ? 'evasive' as const : 'linear' as const,
  threat_level: i < 5 ? 'high' as const : i < 12 ? 'medium' as const : 'low' as const,
  size: i < 3 ? 'large' as const : i < 10 ? 'medium' as const : 'small' as const,
  assigned_drones: [],
  status: 'active' as const,
}));