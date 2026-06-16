import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, AlertTriangle, TrendingDown, TrendingUp, Minus, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface CheckinRecord {
  id: number;
  contenido: string;
  estado_riesgo: string;
  fecha: string;
  rhi_score: number | null;
  id_score: number | null;
  ir_score: number | null;
  color_base: string | null;
  color_final: string | null;
  flag_convergencia_critica: boolean | null;
  flag_somnolencia_critica: boolean | null;
  flag_estres_desregulado: boolean | null;
}

interface ParsedCheckin extends CheckinRecord {
  rhi: number | null;
}

function getRiskBadge(estado: string) {
  switch (estado) {
    case "RIESGO_ALTO":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Alerta Alta</Badge>;
    case "RIESGO_MEDIANO":
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Sobrecarga</Badge>;
    default:
      return <Badge className="bg-green-100 text-green-700 border-green-200">Estable</Badge>;
  }
}

function getRhiColor(rhi: number | null): string {
  if (rhi === null) return "text-slate-500";
  if (rhi <= 22) return "text-green-600";
  if (rhi <= 30) return "text-yellow-600";
  if (rhi <= 38) return "text-orange-600";
  return "text-red-600";
}

function getTrendIcon(records: ParsedCheckin[], index: number) {
  if (index >= records.length - 1) return <Minus className="h-4 w-4 text-slate-400" />;
  const current = records[index].rhi ?? 0;
  const prev = records[index + 1].rhi ?? 0;
  if (current < prev) return <TrendingDown className="h-4 w-4 text-green-500" aria-label="Mejora respecto al anterior" />;
  if (current > prev) return <TrendingUp className="h-4 w-4 text-red-500" aria-label="Aumento respecto al anterior" />;
  return <Minus className="h-4 w-4 text-slate-400" />;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const session = getSession();

  const [records, setRecords] = useState<ParsedCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    authFetch(`${import.meta.env.VITE_API_URL}/api/checkin/idsm/historial/${session.id_usuario}`)
      .then((r) => {
        if (!r.ok) throw new Error("Error al obtener historial");
        return r.json() as Promise<CheckinRecord[]>;
      })
      .then((data) => {
        const parsed: ParsedCheckin[] = data.map((rec) => ({
          ...rec,
          rhi: rec.rhi_score ?? null,
        }));
        setRecords(parsed);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (!session) {
    return (
      <div className="container mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
        <h2 className="text-xl font-semibold text-slate-700">Inicia sesión para ver tu historial</h2>
        <p className="text-slate-500 text-sm">Tu historial de check-ins requiere una cuenta activa.</p>
        <Button onClick={() => navigate("/auth")}>
          <LogIn className="h-4 w-4 mr-2" />
          Ir al login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Mi Historial</h1>
        {session && (
          <span className="text-sm text-slate-500 ml-2">— {session.nombre}</span>
        )}
      </div>

      {/* Summary cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-slate-800">{records.length}</div>
              <div className="text-sm text-slate-500 mt-1">Check-ins totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className={`text-3xl font-bold ${getRhiColor(records[0]?.rhi ?? null)}`}>
                {records[0]?.rhi ?? "—"}
              </div>
              <div className="text-sm text-slate-500 mt-1">RHI último registro</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-600">
                {records.filter((r) => r.estado_riesgo === "RIESGO_ALTO").length}
              </div>
              <div className="text-sm text-slate-500 mt-1">Alertas altas</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historial de Check-ins IDSM
          </CardTitle>
          <CardDescription>
            Registros de tu estado diario ordenados del más reciente al más antiguo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="py-12 text-center text-slate-400 animate-pulse">Cargando historial...</div>
          )}

          {error && (
            <div className="py-8 text-center text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && records.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <p className="text-slate-500">Aún no tienes check-ins registrados.</p>
              <Button variant="outline" onClick={() => navigate("/checkin")}>
                Hacer mi primer check-in
              </Button>
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <div className="space-y-3">
              {records.map((rec, index) => (
                <div
                  key={rec.id}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getTrendIcon(records, index)}
                    <div>
                      <div className="font-medium text-slate-800">
                        {rec.fecha
                          ? format(parseISO(rec.fecha), "EEEE d 'de' MMMM, yyyy", { locale: es })
                          : "Fecha desconocida"}
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        {rec.fecha
                          ? format(parseISO(rec.fecha), "HH:mm 'hs'")
                          : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getRhiColor(rec.rhi)}`}>
                        {rec.rhi ?? "—"}
                      </div>
                      <div className="text-xs text-slate-400">RHI / 48</div>
                    </div>
                    {rec.color_final && (
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        rec.color_final === "rojo" ? "bg-red-100 text-red-700" :
                        rec.color_final === "naranja" ? "bg-orange-100 text-orange-700" :
                        rec.color_final === "amarillo" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {rec.color_final}
                      </div>
                    )}
                    {getRiskBadge(rec.estado_riesgo)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
