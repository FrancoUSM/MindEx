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
} from "lucide-react";

import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PacienteEmpresa {
  id_paciente: number;
  id_empleado: number;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  turno: string;
  faena: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const session = getSession();

  const [data, setData] = useState<PacienteEmpresa[]>([]);
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
      `${import.meta.env.VITE_API_URL}/api/paciente/empresa/${session.id_usuario}`
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
      `${import.meta.env.VITE_API_URL}/api/empleado/${selected.id_empleado}`,
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

  const deactivate = async (idEmpleado: number) => {

  const confirm = window.confirm(
    "¿Deseas desactivar este trabajador?"
  );

  if (!confirm) return;

  await authFetch(
    `${import.meta.env.VITE_API_URL}/api/empleado/desactivar/${idEmpleado}`,
    {
      method: "PUT",
    }
  );

  loadData(); // refresca lista
};



  const filtered = data.filter(p =>
    `${p.nombre} ${p.apellido} ${p.correo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
    <div className="container mx-auto py-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">
            Panel de Empresa
          </h1>
          <p className="text-sm text-slate-500">
            Gestión de trabajadores
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Buscar trabajador..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">
              {data.length}
            </div>
            <div className="text-sm text-slate-500">
              Trabajadores
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

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Trabajadores</CardTitle>
          <CardDescription>
            Lista de personal de la empresa
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
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Cargo</th>
                  <th>Turno</th>
                  <th>Faena</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(p => (
                  <tr key={p.id_empleado} className="border-b">
                    <td>{p.nombre} {p.apellido}</td>
                    <td>{p.correo}</td>
                    <td>{p.cargo}</td>
                    <td>
                      <Badge>{p.turno}</Badge>
                    </td>
                    <td>{p.faena}</td>
                    <td className="text-right">
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
                    onClick={() => deactivate(p.id_empleado)}>
                    Desactivar
                </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

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