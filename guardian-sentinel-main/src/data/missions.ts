export type MissionStatus = 'draft' | 'ready_for_launch' | 'launched' | 'completed' | 'aborted';
export type ROELevel = 'observe_report' | 'non_lethal' | 'reconnaissance' | 'intercept';

export interface Waypoint {
  id: string;
  lat: number;
  lon: number;
  altitude: number;
  order: number;
}

export interface Zone {
  id: string;
  name: string;
  vertices: { lat: number; lon: number }[];
  area_sqkm: number;
}

export interface MissionPlan {
  id: string;
  name: string;
  description: string;
  status: MissionStatus;
  roe: ROELevel;
  comms_loss_policy: 'rtb' | 'loiter' | 'continue' | 'land';
  waypoints: Waypoint[];
  zones: Zone[];
  assigned_drones: string[];
  assigned_targets: Record<string, string[]>; // droneId -> targetIds
  created_at: string;
  updated_at: string;
}

export const sampleMission: MissionPlan = {
  id: 'MSN-001',
  name: 'Operation Eagle Shield',
  description: 'Multi-sector patrol and surveillance mission with intercept capability',
  status: 'draft',
  roe: 'observe_report',
  comms_loss_policy: 'rtb',
  waypoints: Array.from({ length: 12 }, (_, i) => ({
    id: `WP-${String(i + 1).padStart(3, '0')}`,
    lat: 25.25 + Math.random() * 0.2,
    lon: 51.35 + Math.random() * 0.3,
    altitude: 5000 + Math.random() * 20000,
    order: i + 1,
  })),
  zones: [
    {
      id: 'ZN-001',
      name: 'Patrol Zone Alpha',
      vertices: [
        { lat: 25.28, lon: 51.40 },
        { lat: 25.35, lon: 51.55 },
        { lat: 25.30, lon: 51.60 },
        { lat: 25.25, lon: 51.48 },
      ],
      area_sqkm: 42.5,
    },
  ],
  assigned_drones: ['RPR-001', 'BYK-001', 'CYT-002'],
  assigned_targets: { 'BYK-003': ['TGT-007'] },
  created_at: '2026-03-06T06:00:00Z',
  updated_at: '2026-03-06T06:00:00Z',
};