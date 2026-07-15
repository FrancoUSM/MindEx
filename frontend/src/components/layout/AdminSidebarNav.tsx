import { History, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "@/lib/auth";

interface AdminSidebarNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const items = [
  {
    id: "history",
    label: "Historial",
    description: "Historial de empleados",
    icon: History,
  },
  {
    id: "settings",
    label: "Configuración",
    description: "Configurar empresa",
    icon: Settings,
  },
];

export function AdminSidebarNav({ activeSection, onSectionChange }: AdminSidebarNavProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/auth");
  };

  return (
    <aside className="w-full lg:w-64 rounded-2xl border bg-white p-4 shadow-sm flex flex-col min-h-[520px]">
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-green-700">
        <Settings className="h-5 w-5" />
        <div>
          <p className="text-sm font-semibold">Panel Administrativo</p>
          <p className="text-xs text-green-600/80">Gestión de empleados</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                isActive
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-green-200 hover:bg-green-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </div>
              <p className={`mt-1 text-xs ${isActive ? "text-green-100" : "text-slate-500"}`}>
                {item.description}
              </p>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t pt-3 space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
