export type DroneStatus = 'active' | 'patrol' | 'pursuit' | 'returning' | 'maintenance' | 'offline' | 'standby';
export type DroneModel = 'MQ-9B Reaper' | 'Bayraktar TB2' | 'Coyote Interceptor' | 'Q-Scout Mk1';

export interface Drone {
  id: string;
  callsign: string;
  model: DroneModel;
  status: DroneStatus;
  lat: number;
  lng: number;
  altitude: number;
  heading: number;
  speed: number;
  battery: number;
  signal: number;
  mission: string;
  behavior: string;
  payload: string[];
  lastContact: string;
}

export const droneModels: Record<DroneModel, { maxAlt: number; maxSpeed: number; range: number; endurance: string; sensors: string[]; count: number }> = {
  'MQ-9B Reaper': { maxAlt: 50000, maxSpeed: 240, range: 1850, endurance: '27h', sensors: ['EO/IR', 'SAR', 'SIGINT', 'Maritime Radar'], count: 45 },
  'Bayraktar TB2': { maxAlt: 25000, maxSpeed: 130, range: 150, endurance: '27h', sensors: ['EO/IR', 'Laser Designator', 'FLIR'], count: 120 },
  'Coyote Interceptor': { maxAlt: 15000, maxSpeed: 180, range: 80, endurance: '1.5h', sensors: ['RF Seeker', 'Proximity Sensor'], count: 200 },
  'Q-Scout Mk1': { maxAlt: 8000, maxSpeed: 65, range: 40, endurance: '4h', sensors: ['EO/IR', 'Multispectral', 'Chemical Detector'], count: 85 },
};

export const drones: Drone[] = [
  { id: 'RPR-001', callsign: 'HAWK-1', model: 'MQ-9B Reaper', status: 'active', lat: 25.286, lng: 51.534, altitude: 28000, heading: 45, speed: 180, battery: 87, signal: 98, mission: 'OVERWATCH-7A', behavior: 'Patrol: Sector Alpha', payload: ['GBU-12', 'AGM-114', 'EO/IR Pod'], lastContact: '2s ago' },
  { id: 'RPR-002', callsign: 'HAWK-2', model: 'MQ-9B Reaper', status: 'patrol', lat: 25.350, lng: 51.450, altitude: 32000, heading: 120, speed: 165, battery: 72, signal: 95, mission: 'SENTINEL-3B', behavior: 'Patrol: Maritime Corridor', payload: ['AGM-114', 'SIGINT Pod', 'SAR'], lastContact: '1s ago' },
  { id: 'RPR-003', callsign: 'HAWK-3', model: 'MQ-9B Reaper', status: 'returning', lat: 25.200, lng: 51.600, altitude: 15000, heading: 270, speed: 200, battery: 23, signal: 92, mission: 'RTB', behavior: 'Return to Base: Low Fuel', payload: ['EO/IR Pod'], lastContact: '3s ago' },
  { id: 'BYK-001', callsign: 'FALCON-1', model: 'Bayraktar TB2', status: 'active', lat: 25.400, lng: 51.350, altitude: 18000, heading: 90, speed: 110, battery: 91, signal: 97, mission: 'OVERWATCH-7A', behavior: 'ISR: Border Surveillance', payload: ['MAM-L', 'FLIR'], lastContact: '1s ago' },
  { id: 'BYK-002', callsign: 'FALCON-2', model: 'Bayraktar TB2', status: 'active', lat: 25.320, lng: 51.520, altitude: 20000, heading: 180, speed: 95, battery: 65, signal: 94, mission: 'PATROL-12', behavior: 'ISR: Coastal Watch', payload: ['MAM-C', 'FLIR', 'Laser Designator'], lastContact: '2s ago' },
  { id: 'BYK-003', callsign: 'FALCON-3', model: 'Bayraktar TB2', status: 'pursuit', lat: 25.380, lng: 51.480, altitude: 16000, heading: 35, speed: 125, battery: 58, signal: 96, mission: 'INTERCEPT-9', behavior: 'Pursuit: Track ID-4421', payload: ['MAM-L', 'MAM-C'], lastContact: '0s ago' },
  { id: 'BYK-004', callsign: 'FALCON-4', model: 'Bayraktar TB2', status: 'maintenance', lat: 25.265, lng: 51.565, altitude: 0, heading: 0, speed: 0, battery: 100, signal: 0, mission: 'MAINT', behavior: 'Scheduled Maintenance', payload: [], lastContact: '4h ago' },
  { id: 'CYT-001', callsign: 'VIPER-1', model: 'Coyote Interceptor', status: 'standby', lat: 25.290, lng: 51.540, altitude: 0, heading: 0, speed: 0, battery: 100, signal: 100, mission: 'READY', behavior: 'Standby: Launch Ready', payload: ['Warhead-Kinetic'], lastContact: 'N/A' },
  { id: 'CYT-002', callsign: 'VIPER-2', model: 'Coyote Interceptor', status: 'active', lat: 25.310, lng: 51.490, altitude: 8000, heading: 220, speed: 170, battery: 45, signal: 88, mission: 'SWARM-ALPHA', behavior: 'Intercept: Swarm Formation', payload: ['Warhead-Kinetic'], lastContact: '1s ago' },
  { id: 'CYT-003', callsign: 'VIPER-3', model: 'Coyote Interceptor', status: 'active', lat: 25.305, lng: 51.495, altitude: 7500, heading: 215, speed: 175, battery: 42, signal: 90, mission: 'SWARM-ALPHA', behavior: 'Intercept: Wingman V-2', payload: ['Warhead-Kinetic'], lastContact: '1s ago' },
  { id: 'QSC-001', callsign: 'SHADOW-1', model: 'Q-Scout Mk1', status: 'active', lat: 25.340, lng: 51.410, altitude: 3000, heading: 60, speed: 45, battery: 78, signal: 99, mission: 'RECON-5C', behavior: 'ISR: Facility Scan', payload: ['Multispectral Cam', 'Chem Detector'], lastContact: '1s ago' },
  { id: 'QSC-002', callsign: 'SHADOW-2', model: 'Q-Scout Mk1', status: 'active', lat: 25.360, lng: 51.380, altitude: 2500, heading: 300, speed: 50, battery: 82, signal: 97, mission: 'RECON-5C', behavior: 'ISR: Perimeter Sweep', payload: ['EO/IR', 'Multispectral Cam'], lastContact: '2s ago' },
  { id: 'QSC-003', callsign: 'SHADOW-3', model: 'Q-Scout Mk1', status: 'offline', lat: 25.250, lng: 51.550, altitude: 0, heading: 0, speed: 0, battery: 5, signal: 0, mission: 'LOST', behavior: 'Comms Lost: Last Known Pos', payload: ['EO/IR'], lastContact: '47m ago' },
  { id: 'RPR-004', callsign: 'HAWK-4', model: 'MQ-9B Reaper', status: 'standby', lat: 25.270, lng: 51.560, altitude: 0, heading: 0, speed: 0, battery: 100, signal: 100, mission: 'READY', behavior: 'Pre-flight: Awaiting Orders', payload: ['GBU-12', 'AGM-114', 'EO/IR Pod', 'SIGINT'], lastContact: 'N/A' },
  { id: 'BYK-005', callsign: 'FALCON-5', model: 'Bayraktar TB2', status: 'patrol', lat: 25.420, lng: 51.300, altitude: 22000, heading: 150, speed: 100, battery: 80, signal: 93, mission: 'BORDER-WATCH', behavior: 'Patrol: Western Corridor', payload: ['FLIR', 'Laser Designator'], lastContact: '3s ago' },
  { id: 'CYT-004', callsign: 'VIPER-4', model: 'Coyote Interceptor', status: 'standby', lat: 25.288, lng: 51.538, altitude: 0, heading: 0, speed: 0, battery: 100, signal: 100, mission: 'READY', behavior: 'Standby: Rapid Response', payload: ['Warhead-EMP'], lastContact: 'N/A' },
];

export const alerts = [
  { id: 1, type: 'critical' as const, message: 'COMMS LOST — QSC-003 (SHADOW-3) last contact 47min ago. Failsafe RTB initiated.', time: '14:23:17 UTC' },
  { id: 2, type: 'warning' as const, message: 'LOW BATTERY — RPR-003 (HAWK-3) at 23%. RTB in progress.', time: '14:21:05 UTC' },
  { id: 3, type: 'critical' as const, message: 'HOSTILE UAV DETECTED — Sector Bravo. BYK-003 re-tasked to intercept.', time: '14:18:42 UTC' },
  { id: 4, type: 'info' as const, message: 'MISSION UPDATE — OVERWATCH-7A patrol route adjusted per new ROE parameters.', time: '14:15:00 UTC' },
  { id: 5, type: 'warning' as const, message: 'AIRSPACE ALERT — Civilian corridor A-7 active. Drones re-routing.', time: '14:12:30 UTC' },
  { id: 6, type: 'info' as const, message: 'SWARM-ALPHA — 3 Coyote units deployed in formation. Intercept ETA: 4min.', time: '14:10:15 UTC' },
  { id: 7, type: 'critical' as const, message: 'PERIMETER BREACH — Eastern fence line sensor triggered. QSC-001 dispatched.', time: '14:08:00 UTC' },
  { id: 8, type: 'warning' as const, message: 'WEATHER ADVISORY — Wind speed exceeding 35kt at altitude FL180. TB2 ops affected.', time: '14:05:22 UTC' },
];

export const missions = [
  { id: 'OVERWATCH-7A', name: 'Operation Overwatch', status: 'active', priority: 'high', drones: 3, sector: 'Alpha', startTime: '06:00 UTC' },
  { id: 'SENTINEL-3B', name: 'Sentinel Maritime', status: 'active', priority: 'medium', drones: 1, sector: 'Maritime', startTime: '08:00 UTC' },
  { id: 'SWARM-ALPHA', name: 'Swarm Intercept', status: 'active', priority: 'critical', drones: 3, sector: 'Bravo', startTime: '14:08 UTC' },
  { id: 'RECON-5C', name: 'Recon Facility', status: 'active', priority: 'medium', drones: 2, sector: 'Charlie', startTime: '10:30 UTC' },
  { id: 'BORDER-WATCH', name: 'Border Patrol West', status: 'active', priority: 'high', drones: 1, sector: 'Western', startTime: '05:00 UTC' },
  { id: 'INTERCEPT-9', name: 'Hostile Intercept', status: 'active', priority: 'critical', drones: 1, sector: 'Bravo', startTime: '14:16 UTC' },
];
