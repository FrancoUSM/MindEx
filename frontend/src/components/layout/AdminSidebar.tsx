import { FlaskConical, Building2, CreditCard, ShieldCheck, ArrowLeft, LogOut, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const items = [
  {
    id: "tests",
    label: "Tests",
    description: "Crear y ver evaluaciones",
    icon: FlaskConical,
  },
  {
    id: "services",
    label: "Servicios",
    description: "Gestionar servicios",
    icon: Briefcase,
  },
  {
    id: "subscriptions",
    label: "Suscripciones",
    description: "Administrar planes por empresa",
    icon: CreditCard,
  },
  {
    id: "companies",
    label: "Empresas",
    description: "Ver empresas registradas",
    icon: Building2,
  },
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("token");
    navigate("/auth");
  };
  return (
    <aside className="w-full lg:w-64 rounded-2xl border bg-white p-4 shadow-sm flex flex-col min-h-[520px]">
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-blue-700">
        <ShieldCheck className="h-5 w-5" />
        <div>
          <p className="text-sm font-semibold">Panel de Administrador</p>
          <p className="text-xs text-blue-600/80">Gestión operativa</p>
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
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </div>
              <p className={`mt-1 text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>
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
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
