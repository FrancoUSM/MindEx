import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  ClipboardList,
  BarChart3,
  Users,
  AlertTriangle,
  Settings,
  LogOut,
  Brain,
  FileText,
  Activity,
  Bell,
  X,
  Check
} from "lucide-react";
import mindexaLogo from "@/assets/mindexa-logo-slogan-color.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppointmentCalendar from "@/components/forms/AppointmentCalendar";
import { getSession, clearSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles: string[];
}

interface Notificacion {
  id: number;
  contenido: string;
  categoria: string;
  estado: string;
  fecha: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Check-in Diario",
    url: "/checkin",
    icon: Heart,
    roles: ["worker"]
  },
  {
    title: "Mis Evaluaciones",
    url: "/evaluations",
    icon: ClipboardList,
    roles: ["worker"]
  },
  {
    title: "Mi Historial",
    url: "/history",
    icon: Activity,
    roles: ["worker"]
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
    roles: ["worker", "psychologist", "management"]
  }
];

export function AppSidebar() {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const session = getSession();
  const idUsuario: number | null = session?.id_usuario ?? null;
  const userRole = session?.rol ?? "USER";

  useEffect(() => {
    if (!idUsuario) return;
    authFetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/${idUsuario}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Notificacion[]) => setNotificaciones(data))
      .catch(() => {});
  }, [idUsuario]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const marcarLeida = async (id: number) => {
    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/leer/${id}`, { method: 'PUT' });
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const pendientes = notificaciones.filter(n => n.estado !== 'DESECHADO');

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const isActive = (path: string) => currentPath === path;
  const roleForMenu = userRole === "PROFESIONAL" ? "psychologist"
    : userRole === "ADMIN" ? "management"
    : "worker";
  const filteredItems = menuItems.filter(item => item.roles.includes(roleForMenu));

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
      <SidebarContent>
        <div className="p-6 border-b">
          <div className="flex items-center justify-center">
            <img src={mindexaLogo} alt="Mindexa - Software for Mental Health" className="h-32" />
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-600/80">Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white font-medium"
                          : "text-blue-700 hover:bg-blue-50"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {roleForMenu === "worker" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-600/80">Ayuda</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-3">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAppointments(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Hablar con Profesional
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Notificaciones */}
        <div className="p-3 border-t relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-blue-600 hover:bg-blue-50 relative"
            onClick={() => setShowNotifications(prev => !prev)}
          >
            <Bell className="h-4 w-4" />
            <span className="ml-2">Notificaciones</span>
            {pendientes.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-auto h-5 min-w-[20px] px-1 text-xs"
              >
                {pendientes.length}
              </Badge>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute bottom-14 left-2 right-2 z-50 bg-white border rounded-lg shadow-xl max-h-72 overflow-y-auto">
              <div className="p-3 border-b flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Notificaciones</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {pendientes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Sin notificaciones pendientes</p>
              ) : (
                pendientes.map(n => (
                  <div
                    key={n.id}
                    className={`p-3 border-b last:border-0 text-sm ${
                      n.categoria === 'ALERTA' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-gray-800">{n.contenido}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-green-600 hover:text-green-800"
                        title="Marcar como leída"
                        onClick={() => marcarLeida(n.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mt-auto p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-blue-600 hover:bg-accent hover:text-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">Cerrar Sesión</span>
          </Button>
        </div>
      </SidebarContent>

      {showAppointments && (
        <AppointmentCalendar onClose={() => setShowAppointments(false)} />
      )}
    </Sidebar>
  );
}
