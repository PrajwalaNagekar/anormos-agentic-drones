import {
  LayoutDashboard, Map, Rocket, BookOpen, AlertTriangle, Wrench,
  BarChart3, Cpu, Download, FlaskConical, Link2, ShieldCheck, Settings, LogOut
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import anormosLogo from '@/assets/anormos-logo.png';

const navGroups = [
  {
    label: 'Core Operations',
    items: [
      { title: 'C2 Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { title: 'Mission Planner', url: '/missions', icon: Map },
      { title: 'Launch Ops', url: '/launch', icon: Rocket },
    ],
  },
  {
    label: 'Intelligence & Alerts',
    items: [
      { title: 'Intelligence Hub', url: '/intelligence', icon: BookOpen },
      { title: 'Alerts & Incidents', url: '/alerts', icon: AlertTriangle },
    ],
  },
  {
    label: 'Fleet & Autonomy',
    items: [
      { title: 'Fleet Management', url: '/fleet', icon: Wrench },
      { title: 'Reports & Analytics', url: '/reports', icon: BarChart3 },
      { title: 'Swarm & Autonomy', url: '/swarm', icon: Cpu },
    ],
  },
  {
    label: 'Admin & System',
    items: [
      { title: 'OTA & Firmware', url: '/firmware', icon: Download },
      { title: 'Simulation Lab', url: '/simulation', icon: FlaskConical },
      { title: 'Integrations', url: '/integrations', icon: Link2 },
      { title: 'Security', url: '/security', icon: ShieldCheck },
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        <div className={`p-4 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-2">
            <img src={anormosLogo} alt="ANORMOS skAI" className="w-6 h-6 object-contain shrink-0" />
            {!collapsed && (
              <div>
                <h2 className="text-sm font-display font-bold tracking-[0.15em] text-sidebar-primary">
                  ANORMOS <span className="text-sidebar-foreground">sk</span><span className="text-accent">AI</span>
                </h2>
                <p className="text-[9px] font-mono text-sidebar-foreground opacity-60">C2 COMMAND v4.2</p>
              </div>
            )}
          </div>
        </div>

        {navGroups.map(group => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-mono text-sidebar-foreground/50 uppercase tracking-wider px-4">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className={`flex items-center gap-3 px-4 py-2 text-xs font-mono transition-colors rounded-sm
                            ${isActive ? 'bg-sidebar-accent text-sidebar-primary font-bold' : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'}`}
                          activeClassName=""
                        >
                          <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sidebar-primary' : ''}`} />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="status-online" />
              <span className="text-[10px] font-mono text-sidebar-foreground">OPR-2741 | CMDR. OPERATOR</span>
            </div>
            <NavLink to="/" className="flex items-center gap-2 text-[10px] font-mono text-sidebar-foreground/50 hover:text-destructive transition-colors" activeClassName="">
              <LogOut className="w-3 h-3" /> Secure Logout
            </NavLink>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;