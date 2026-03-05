import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MissionPlanner from "./pages/MissionPlanner";
import LaunchOps from "./pages/LaunchOps";
import IntelligenceHub from "./pages/IntelligenceHub";
import AlertsIncidents from "./pages/AlertsIncidents";
import FleetManagement from "./pages/FleetManagement";
import Reports from "./pages/Reports";
import PlaceholderPage from "./pages/PlaceholderPage";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<WithLayout><Dashboard /></WithLayout>} />
          <Route path="/missions" element={<WithLayout><MissionPlanner /></WithLayout>} />
          <Route path="/launch" element={<WithLayout><LaunchOps /></WithLayout>} />
          <Route path="/intelligence" element={<WithLayout><IntelligenceHub /></WithLayout>} />
          <Route path="/alerts" element={<WithLayout><AlertsIncidents /></WithLayout>} />
          <Route path="/fleet" element={<WithLayout><FleetManagement /></WithLayout>} />
          <Route path="/reports" element={<WithLayout><Reports /></WithLayout>} />
          <Route path="/swarm" element={<WithLayout><PlaceholderPage pageKey="swarm" /></WithLayout>} />
          <Route path="/firmware" element={<WithLayout><PlaceholderPage pageKey="firmware" /></WithLayout>} />
          <Route path="/simulation" element={<WithLayout><PlaceholderPage pageKey="simulation" /></WithLayout>} />
          <Route path="/integrations" element={<WithLayout><PlaceholderPage pageKey="integrations" /></WithLayout>} />
          <Route path="/security" element={<WithLayout><PlaceholderPage pageKey="security" /></WithLayout>} />
          <Route path="/settings" element={<WithLayout><PlaceholderPage pageKey="settings" /></WithLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
