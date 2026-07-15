import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Users,
  Building2,
  LogIn,
  AlertTriangle,
  Pencil,
  Brain,
  TrendingUp,
} from "lucide-react";

import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { AdminSidebarNav } from "@/components/layout/AdminSidebarNav";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UsuarioSlim {
  nombre: string;
  correo: string;
}

interface PacienteEmpresa {
  id_paciente?: number;
  id_empleado: number;
  cargo: string;
  turno: string;
  faena: string;
  usuario?: UsuarioSlim;
}

interface EmployeePsychologicalData {
  testCount: number;
  lastTestDate?: string;
  consistency: number; // percentage 0-100
  averageScore?: number;
}


export default function AdminPage() {
  const navigate = useNavigate();
  const session = getSession();

  // Role-based protection: Only ADMINISTRADOR role can access this page
  useEffect(() => {
    /*
    if (!session) {
      navigate("/auth");
      return;
    }

    if (session.rol !== "ADMINISTRADOR") {
      navigate("/");
      return;
    }
  }, [session, navigate]);

  // If not authorized, don't render anything
  
  if (!session || session.rol !== "ADMINISTRADOR") {
    return null;*/
  }, []);

  const [activeSection, setActiveSection] = useState("history");

  const [data, setData] = useState<PacienteEmpresa[]>([]);
  const [psychologicalData, setPsychologicalData] = useState<Record<number, EmployeePsychologicalData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // modal
  const [selected, setSelected] = useState<PacienteEmpresa | null>(null);
  const [cargo, setCargo] = useState("");
  const [turno, setTurno] = useState("");
  const [faena, setFaena] = useState("");

  const loadData = () => {
    if (!session) return;

    setLoading(true);

    authFetch(
      `${import.meta.env.VITE_API_URL}/api/empleado`
    )
      .then(r => {
        if (!r.ok) throw new Error("Error cargando datos");
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEdit = (item: PacienteEmpresa) => {
    setSelected(item);
    setCargo(item.cargo ?? "");
    setTurno(item.turno ?? "");
    setFaena(item.faena ?? "");
  };

  const saveEdit = async () => {
    if (!selected) return;

    await authFetch(
      `${import.meta.env.VITE_API_URL}/api/empleado/empleado/${selected.id_empleado}`,
      {
        method: "PUT",
        body: JSON.stringify({
          cargo,
          turno,
          faena,
        }),
      }
    );

    setSelected(null);
    loadData();
  };

  const deactivate = async (id_empleado: number) => {

  const confirm = window.confirm(
    "¿Deseas desactivar este trabajador?"
  );

  if (!confirm) return;

  await authFetch(
    `${import.meta.env.VITE_API_URL}/api/empleado/desactivar/${id_empleado}`,
    {
      method: "PUT",
    }
  );

  loadData(); // refresca lista
};



  const filtered = data.filter(p => {
    const nombre = p.usuario?.nombre ?? "";
    const correo = p.usuario?.correo ?? "";
    return `${nombre} ${correo}`.toLowerCase().includes(search.toLowerCase());
  });


  if (!session) {
    return (
      <div className="container mx-auto py-16 text-center">
        <AlertTriangle className="h-10 w-10 mx-auto text-yellow-500" />
        <p className="mt-3">Debes iniciar sesión</p>
        <Button className="mt-4" onClick={() => navigate("/auth")}>
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <AdminSidebarNav activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* HEADER */}
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">
                {activeSection === "history" ? "Historial de Empleados" : "Configuración"}
              </h1>
              <p className="text-sm text-slate-500">
                {activeSection === "history" 
                  ? "Revisa el historial y consistencia de tus empleados" 
                  : "Configura la empresa"}
              </p>
            </div>
          </div>

          {/* HISTORY SECTION */}
          {activeSection === "history" && (
            <>
              {/* SEARCH */}
              <Input
                placeholder="Buscar empleado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold">
                      {data.length}
                    </div>
                    <div className="text-sm text-slate-500">
                      Empleados Totales
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Set(data.map(d => d.turno)).size}
                    </div>
                    <div className="text-sm text-slate-500">
                      Turnos
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(data.map(d => d.faena)).size}
                    </div>
                    <div className="text-sm text-slate-500">
                      Faenas
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* EMPLOYEES TABLE WITH PSYCHOLOGICAL DATA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Historial de Empleados
                  </CardTitle>
                  <CardDescription>
                    Información de participación en evaluaciones psicológicas y consistencia
                  </CardDescription>
                </CardHeader>

                <CardContent>

                  {loading && (
                    <div className="text-center py-10 text-slate-400">
                      Cargando...
                    </div>
                  )}

                  {error && (
                    <div className="text-center text-red-500">
                      {error}
                    </div>
                  )}

                  {!loading && !error && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-slate-50">
                            <th className="text-left p-3 font-semibold">Nombre</th>
                            <th className="text-left p-3 font-semibold">Correo</th>
                            <th className="text-left p-3 font-semibold">Cargo</th>
                            <th className="text-center p-3 font-semibold">
                              <div className="flex items-center justify-center gap-1">
                                <Brain className="h-4 w-4" />
                                Tests
                              </div>
                            </th>
                            <th className="text-center p-3 font-semibold">
                              <div className="flex items-center justify-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                Consistencia
                              </div>
                            </th>
                            <th className="text-right p-3 font-semibold">Acciones</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filtered.map(p => (
                            <tr key={p.id_empleado} className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium">{p.usuario?.nombre ?? "—"}</td>
                              <td className="p-3 text-slate-600">{p.usuario?.correo ?? "—"}</td>
                              <td className="p-3">{p.cargo}</td>
                              <td className="p-3 text-center">
                                <Badge variant="outline" className="bg-blue-50">
                                  {psychologicalData[p.id_empleado]?.testCount ?? 0} tests
                                </Badge>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-24 bg-slate-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all"
                                      style={{ width: `${psychologicalData[p.id_empleado]?.consistency ?? 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium min-w-10">
                                    {psychologicalData[p.id_empleado]?.consistency ?? 0}%
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEdit(p)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deactivate(p.id_empleado)}
                                >
                                  Desactivar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Empresa</CardTitle>
                <CardDescription>
                  Configura los parámetros de tu empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600">
                  <p>Próximamente: Configuración de planes, costos por usuario y más opciones.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL EDIT */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar trabajador</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Cargo" />
            <Input value={turno} onChange={e => setTurno(e.target.value)} placeholder="Turno" />
            <Input value={faena} onChange={e => setFaena(e.target.value)} placeholder="Faena" />

            <Button className="w-full" onClick={saveEdit}>
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}