export interface IntelArticle {
  id: string;
  title: string;
  category: string;
  threat: 'high' | 'medium' | 'low' | 'info';
  country: string;
  summary: string;
  details: string[];
  lastUpdated: string;
}

export const intelArticles: IntelArticle[] = [
  {
    id: 'INT-001', title: 'Nation 1 Drone Program Expansion', category: 'Regional Threat', threat: 'high', country: 'Nation 1',
    summary: 'Nation 1 has significantly expanded its UAV fleet including loitering munitions and UCAV platforms. Export programs to proxy groups remain a critical concern.',
    details: [
      'Loitering Munition A: One-way attack drone, range 2,500km, GPS/INS guided',
      'UCAV Platform B: Medium-altitude UCAV with precision strike capability',
      'Active export to allied proxy forces across the region',
      'Estimated fleet: 2,000+ combat UAVs across all variants',
      'Underground drone bases detected via satellite imagery',
    ],
    lastUpdated: '2026-03-04',
  },
  {
    id: 'INT-002', title: 'Nation 2 Defence Industry UAV Dominance', category: 'Allied Systems', threat: 'low', country: 'Nation 2',
    summary: 'Nation 2 continues to lead allied drone exports with TB2 and advanced UCAV platforms deployed across 30+ nations.',
    details: [
      'Bayraktar TB2: Combat-proven in multiple theatres of operation',
      'Heavy UCAV: 1,350kg payload capacity with advanced sensors',
      'Next-gen unmanned fighter jet, Mach 0.9, AI-enabled',
      'MALE-class UAV with SATCOM and SIGINT variants',
      'Export clients include 30+ nations across multiple continents',
    ],
    lastUpdated: '2026-03-03',
  },
  {
    id: 'INT-003', title: 'Nation 3 Military Drone Proliferation', category: 'Strategic Assessment', threat: 'high', country: 'Nation 3',
    summary: 'Nation 3 drone fleet estimated at 4,000+ units. Export models compete globally with Western systems.',
    details: [
      'MALE UCAV: 60h endurance, precision munitions capability',
      'Export model rivaling MQ-9, sold to multiple nations',
      'Stealth UCAV for carrier operations under development',
      'Swarm warfare research: 200+ unit simultaneous deployment demonstrated',
      'AI-enabled autonomous combat decision systems under active development',
    ],
    lastUpdated: '2026-03-02',
  },
  {
    id: 'INT-004', title: 'Nation 4 Next-Gen Autonomous Combat Aircraft', category: 'Allied Systems', threat: 'info', country: 'Nation 4',
    summary: 'Nation 4 Collaborative Combat Aircraft (CCA) program advancing rapidly. AI wingman concept to deploy alongside 5th-gen fighters.',
    details: [
      'CCA: Autonomous loyal wingman, AI-driven, cost-effective unit target',
      'MQ-9B SkyGuardian: Maritime variant for allied nations',
      'Mass production initiative for small attritable drones',
      'AI dogfighting program demonstrating superhuman performance',
      'Off-board sensing platform for ISR and electronic warfare',
    ],
    lastUpdated: '2026-03-01',
  },
  {
    id: 'INT-005', title: 'Nation 5 Drone Warfare Adaptation', category: 'Regional Threat', threat: 'medium', country: 'Nation 5',
    summary: 'Nation 5 has rapidly adapted FPV and imported drones for mass employment. Indigenous programs accelerating despite constraints.',
    details: [
      'Imported loitering munition: Locally assembled, 2,500+ units deployed',
      'Indigenous UCAV: Medium-altitude platform with guided munitions',
      'Tactical loitering munition with AI-based target recognition',
      'FPV drones: Mass-produced for tactical strike, 100,000+ units/year',
      'Stealth heavy UCAV program under development',
    ],
    lastUpdated: '2026-02-28',
  },
  {
    id: 'INT-006', title: 'Nation 6 Counter-UAS & Strike Drones', category: 'Strategic Assessment', threat: 'info', country: 'Nation 6',
    summary: 'Nation 6 remains a global leader in both offensive and defensive drone technology with integrated C-UAS systems.',
    details: [
      'Strategic MALE UAV: 45,000ft ceiling, 36h endurance',
      'Multi-role UAV deployed by 15+ nations',
      'Autonomous C-UAS interceptor system',
      'Anti-radiation loitering munitions',
      'Laser-based C-UAS system, proven against swarms',
    ],
    lastUpdated: '2026-02-27',
  },
  {
    id: 'INT-007', title: 'Nation 7 Expanding Indigenous UAV Fleet', category: 'Regional Assessment', threat: 'low', country: 'Nation 7',
    summary: 'Nation 7 accelerating indigenous drone programs while diversifying imports. Focus on border surveillance and maritime ISR.',
    details: [
      'Indigenous MALE-class UAV for border surveillance',
      'Loyal wingman for indigenous fighter platform',
      'MQ-9B SeaGuardian acquired for naval maritime patrol',
      'Indigenous tactical FPV combat drone',
      'Counter-drone systems deployed along borders',
    ],
    lastUpdated: '2026-02-25',
  },
];

export const nuclearStates = [
  { country: 'Nation 4', warheads: 5044, status: 'Deployed & Reserve', lastTest: '1992', policy: 'First Use', icbm: true, slbm: true, bomber: true },
  { country: 'Nation 5', warheads: 5580, status: 'Deployed & Reserve', lastTest: '1990', policy: 'First Use (escalate to de-escalate)', icbm: true, slbm: true, bomber: true },
  { country: 'Nation 3', warheads: 500, status: 'Expanding Rapidly', lastTest: '1996', policy: 'No First Use', icbm: true, slbm: true, bomber: true },
  { country: 'Nation 8', warheads: 290, status: 'Deployed', lastTest: '1996', policy: 'First Use', icbm: false, slbm: true, bomber: true },
  { country: 'Nation 9', warheads: 225, status: 'Deployed', lastTest: '1991', policy: 'First Use', icbm: false, slbm: true, bomber: false },
  { country: 'Nation 10', warheads: 170, status: 'Stockpiled', lastTest: '1998', policy: 'First Use', icbm: false, slbm: false, bomber: true },
  { country: 'Nation 7', warheads: 172, status: 'Stockpiled', lastTest: '1998', policy: 'No First Use', icbm: true, slbm: true, bomber: true },
  { country: 'Nation 6', warheads: 90, status: 'Undeclared', lastTest: 'Unknown', policy: 'Ambiguous', icbm: true, slbm: false, bomber: true },
  { country: 'Nation 11', warheads: 50, status: 'Developing', lastTest: '2017', policy: 'First Use', icbm: true, slbm: true, bomber: false },
];

export const nationalContext = {
  neighbors: ['Nation 12', 'Nation 13', 'Nation 14', 'Nation 1', 'Nation 15', 'Nation 16'],
  nuclearNeighbors: ['Nation 10 (170 warheads)', 'Nation 6 (90 warheads)', 'Nation 7 (172 warheads)'],
  civilNuclear: 'The Nation has no nuclear power plants. Feasibility studies for small modular reactors (SMRs) are under evaluation.',
  defenseAlliances: ['Regional Defence Council', 'NATO Partnership', 'Allied Forward HQ'],
  recentProcurements: ['Bayraktar TB2 (2024)', 'MQ-9B SkyGuardian (2025)', 'NASAMS III (2025)', 'Coyote Block 3+ (2026)'],
};