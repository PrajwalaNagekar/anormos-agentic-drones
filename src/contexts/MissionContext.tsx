import { createContext, useContext, useState, ReactNode } from 'react';
import { type MissionPlan, type MissionStatus, sampleMission } from '@/data/missions';

interface MissionContextType {
  missions: MissionPlan[];
  addMission: (m: MissionPlan) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;
  transferToLaunch: (id: string) => void;
  launchQueue: MissionPlan[];
}

const MissionContext = createContext<MissionContextType | null>(null);

export const useMissionContext = () => {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMissionContext must be inside MissionProvider');
  return ctx;
};

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [missions, setMissions] = useState<MissionPlan[]>([sampleMission]);

  const addMission = (m: MissionPlan) => setMissions(prev => [...prev, m]);

  const updateMissionStatus = (id: string, status: MissionStatus) =>
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m));

  const transferToLaunch = (id: string) => {
    // Simulates POST /missions/{id}/transfer-to-launch
    updateMissionStatus(id, 'ready_for_launch');
  };

  const launchQueue = missions.filter(m => m.status === 'ready_for_launch' || m.status === 'launched');

  return (
    <MissionContext.Provider value={{ missions, addMission, updateMissionStatus, transferToLaunch, launchQueue }}>
      {children}
    </MissionContext.Provider>
  );
};