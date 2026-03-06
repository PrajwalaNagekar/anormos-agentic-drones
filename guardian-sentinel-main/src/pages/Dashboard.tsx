import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Radio, Shield, Activity, ChevronRight, MapPin, Gauge, Battery, Signal, Crosshair } from 'lucide-react';
import { drones, alerts, missions, type Drone } from '@/data/drones';
import TacticalMap from '@/components/dashboard/TacticalMap';
import DroneDetailPanel from '@/components/dashboard/DroneDetailPanel';
import AlertTicker from '@/components/dashboard/AlertTicker';
import FleetList from '@/components/dashboard/FleetList';

const Dashboard = () => {
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [liveAlerts, setLiveAlerts] = useState(alerts);

  const activeDrones = drones.filter(d => ['active', 'patrol', 'pursuit'].includes(d.status)).length;
  const totalFleet = 450;
  const activeMissions = missions.filter(m => m.status === 'active').length;
  const critAlerts = liveAlerts.filter(a => a.type === 'critical').length;

  return (
    <div className="flex flex-col h-full">
      {/* Alert Ticker */}
      <AlertTicker alerts={liveAlerts} />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border-b border-border">
        {[
          { icon: Radio, label: 'ACTIVE DRONES', value: `${activeDrones}/${totalFleet}`, color: 'text-primary' },
          { icon: Shield, label: 'ACTIVE MISSIONS', value: activeMissions, color: 'text-primary' },
          { icon: AlertTriangle, label: 'CRITICAL ALERTS', value: critAlerts, color: 'text-destructive' },
          { icon: Activity, label: 'SYSTEM STATUS', value: 'OPERATIONAL', color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="military-panel p-3 flex items-center gap-3">
            <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{stat.label}</p>
              <p className={`text-sm font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Tactical Map */}
        <div className="flex-1 relative">
          <TacticalMap drones={drones} selectedDrone={selectedDrone} onSelectDrone={setSelectedDrone} />
        </div>

        {/* Fleet sidebar */}
        <div className="w-72 xl:w-80 border-l border-border flex flex-col overflow-hidden">
          {selectedDrone ? (
            <DroneDetailPanel drone={selectedDrone} onClose={() => setSelectedDrone(null)} />
          ) : (
            <FleetList drones={drones} onSelect={setSelectedDrone} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
