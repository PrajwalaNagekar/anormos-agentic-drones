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
    id: 'INT-001', title: 'Iranian Drone Program Expansion', category: 'Regional Threat', threat: 'high', country: 'Iran',
    summary: 'Iran has significantly expanded its UAV fleet including the Shahed-136 loitering munition and Mohajer-6 UCAV. Export programs to proxy groups remain a critical concern.',
    details: [
      'Shahed-136: One-way attack drone, range 2,500km, GPS/INS guided',
      'Mohajer-6: Medium-altitude UCAV with precision strike capability',
      'Active export to Houthi forces, Hezbollah, and Russian Federation',
      'Estimated fleet: 2,000+ combat UAVs across all variants',
      'Underground drone bases detected in western Iran via satellite imagery',
    ],
    lastUpdated: '2026-03-04',
  },
  {
    id: 'INT-002', title: 'Turkish Defence Industry UAV Dominance', category: 'Allied Systems', threat: 'low', country: 'Turkey',
    summary: 'Baykar Technology continues to lead NATO-aligned drone exports with TB2 and Akıncı platforms deployed across 30+ nations.',
    details: [
      'Bayraktar TB2: Combat-proven in Libya, Ukraine, Azerbaijan, and Syria',
      'Bayraktar Akıncı: Heavy UCAV with 1,350kg payload capacity',
      'Bayraktar Kızılelma: Unmanned fighter jet, Mach 0.9, AI-enabled',
      'TAI Anka: MALE-class UAV with SATCOM and SIGINT variants',
      'Export clients include Qatar, UAE, Saudi Arabia, Pakistan, and 25+ others',
    ],
    lastUpdated: '2026-03-03',
  },
  {
    id: 'INT-003', title: 'Chinese Military Drone Proliferation', category: 'Strategic Assessment', threat: 'high', country: 'China',
    summary: 'PLA drone fleet estimated at 4,000+ units. CH-series and Wing Loong exports compete globally with Western systems.',
    details: [
      'CH-5 Rainbow: MALE UCAV, 60h endurance, precision munitions',
      'Wing Loong II: Export model rivaling MQ-9, sold to UAE, Saudi, Pakistan',
      'GJ-11 Sharp Sword: Stealth UCAV for carrier operations',
      'Swarm warfare research: 200+ unit simultaneous deployment demonstrated',
      'AI-enabled autonomous combat decision systems under active development',
    ],
    lastUpdated: '2026-03-02',
  },
  {
    id: 'INT-004', title: 'US Next-Gen Autonomous Combat Aircraft', category: 'Allied Systems', threat: 'info', country: 'United States',
    summary: 'USAF Collaborative Combat Aircraft (CCA) program advancing rapidly. AI wingman concept to deploy alongside F-35 and B-21.',
    details: [
      'CCA: Autonomous loyal wingman, AI-driven, $3M unit cost target',
      'MQ-9B SkyGuardian: Maritime variant for allied nations including Qatar',
      'Replicator Initiative: Mass production of small attritable drones',
      'DARPA ACE: AI dogfighting program demonstrating superhuman performance',
      'XQ-67A: Off-board sensing platform for ISR and electronic warfare',
    ],
    lastUpdated: '2026-03-01',
  },
  {
    id: 'INT-005', title: 'Russian Drone Warfare Adaptation', category: 'Regional Threat', threat: 'medium', country: 'Russia',
    summary: 'Russia has rapidly adapted FPV and Iranian-supplied drones for mass employment. Indigenous programs accelerating despite sanctions.',
    details: [
      'Shahed-136 (Geran-2): Locally assembled, 2,500+ launched in Ukraine',
      'Orion UCAV: Medium-altitude platform with guided munitions',
      'Lancet: Loitering munition with AI-based target recognition',
      'FPV drones: Mass-produced for tactical strike, 100,000+ units/year',
      'S-70 Okhotnik: Stealth heavy UCAV program, carrier-compatible variant planned',
    ],
    lastUpdated: '2026-02-28',
  },
  {
    id: 'INT-006', title: 'Israeli Counter-UAS & Strike Drones', category: 'Strategic Assessment', threat: 'info', country: 'Israel',
    summary: 'Israel remains a global leader in both offensive and defensive drone technology. Iron Dome integration with C-UAS systems.',
    details: [
      'IAI Heron TP: Strategic MALE UAV, 45,000ft ceiling, 36h endurance',
      'Elbit Hermes 900: Multi-role UAV deployed by 15+ nations',
      'Iron Drone: Autonomous C-UAS interceptor system',
      'Harpy/Harop: Anti-radiation loitering munitions',
      'Rafael Drone Dome: Laser-based C-UAS, proven against swarms',
    ],
    lastUpdated: '2026-02-27',
  },
  {
    id: 'INT-007', title: 'India Expanding Indigenous UAV Fleet', category: 'Regional Assessment', threat: 'low', country: 'India',
    summary: 'India accelerating indigenous drone programs while diversifying imports. Focus on border surveillance and maritime ISR.',
    details: [
      'DRDO Tapas: MALE-class UAV for border surveillance',
      'HAL CATS Warrior: Loyal wingman for Tejas fighter',
      'MQ-9B SeaGuardian: Acquired for Indian Navy maritime patrol',
      'Bharat Forge FPV: Indigenous tactical FPV combat drone',
      'Counter-drone systems deployed along LAC with China',
    ],
    lastUpdated: '2026-02-25',
  },
];

export const nuclearStates = [
  { country: 'United States', warheads: 5044, status: 'Deployed & Reserve', lastTest: '1992', policy: 'First Use', icbm: true, slbm: true, bomber: true },
  { country: 'Russia', warheads: 5580, status: 'Deployed & Reserve', lastTest: '1990', policy: 'First Use (escalate to de-escalate)', icbm: true, slbm: true, bomber: true },
  { country: 'China', warheads: 500, status: 'Expanding Rapidly', lastTest: '1996', policy: 'No First Use', icbm: true, slbm: true, bomber: true },
  { country: 'France', warheads: 290, status: 'Deployed', lastTest: '1996', policy: 'First Use', icbm: false, slbm: true, bomber: true },
  { country: 'United Kingdom', warheads: 225, status: 'Deployed', lastTest: '1991', policy: 'First Use', icbm: false, slbm: true, bomber: false },
  { country: 'Pakistan', warheads: 170, status: 'Stockpiled', lastTest: '1998', policy: 'First Use', icbm: false, slbm: false, bomber: true },
  { country: 'India', warheads: 172, status: 'Stockpiled', lastTest: '1998', policy: 'No First Use', icbm: true, slbm: true, bomber: true },
  { country: 'Israel', warheads: 90, status: 'Undeclared', lastTest: 'Unknown', policy: 'Ambiguous', icbm: true, slbm: false, bomber: true },
  { country: 'North Korea', warheads: 50, status: 'Developing', lastTest: '2017', policy: 'First Use', icbm: true, slbm: true, bomber: false },
];

export const qatarContext = {
  neighbors: ['Saudi Arabia', 'Bahrain', 'UAE', 'Iran', 'Kuwait', 'Iraq'],
  nuclearNeighbors: ['Pakistan (170 warheads)', 'Israel (90 warheads)', 'India (172 warheads)'],
  civilNuclear: 'Qatar has no nuclear power plants. Feasibility studies for small modular reactors (SMRs) are under evaluation.',
  defenseAlliances: ['GCC', 'NATO Partnership', 'US CENTCOM Forward HQ (Al Udeid)'],
  recentProcurements: ['Bayraktar TB2 (2024)', 'MQ-9B SkyGuardian (2025)', 'NASAMS III (2025)', 'Coyote Block 3+ (2026)'],
};
