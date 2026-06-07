import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, CheckCircle, ArrowLeft, ArrowRight, Loader2,
  Users, Brain, Shield, Star, AlertCircle, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import NeuralBackground from "@/components/three/NeuralBackground";
import mindexaLogo from "@/assets/mindexa-logo-slogan.png";

const API = import.meta.env.VITE_API_URL;

interface Plan {
  id_plan: number;
  nombre_plan: string;
  descripcion: string;
  tipo_plan: string;
  precio_por_usuario: number;
  duracion_meses: number;
}

interface EmpresaCreada {
  id_empresa: number;
  razonSocial: string;
  nombre_comercial: string;
}

const PLAN_ICONS: Record<string, typeof Brain> = {
  BASICO: Shield,
  PROFESIONAL: Brain,
  ENTERPRISE: Star,
};

const PLAN_COLORS: Record<string, string> = {
  BASICO: "border-blue-400/40 hover:border-blue-400/70 hover:shadow-blue-500/20",
  PROFESIONAL: "border-purple-400/40 hover:border-purple-400/70 hover:shadow-purple-500/20",
  ENTERPRISE: "border-amber-400/40 hover:border-amber-400/70 hover:shadow-amber-500/20",
};

const PLAN_ACCENT: Record<string, string> = {
  BASICO: "text-blue-400",
  PROFESIONAL: "text-purple-400",
  ENTERPRISE: "text-amber-400",
};

const PLAN_BADGE: Record<string, string> = {
  BASICO: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  PROFESIONAL: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  ENTERPRISE: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export default function B2BOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Step 1 state
  const [razonSocial, setRazonSocial] = useState("");
  const [nombreComercial, setNombreComercial] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [direccion, setDireccion] = useState("");

  // Step 2 state
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null);
  const [empresa, setEmpresa] = useState<EmpresaCreada | null>(null);
  const [loadingPlanes, setLoadingPlanes] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setLoadingPlanes(true);
      fetch(`${API}/api/plan`)
        .then(r => r.ok ? r.json() : [])
        .then((data: Plan[]) => setPlanes(data.filter(p => !p.nombre_plan?.includes("desactivado"))))
        .catch(() => setPlanes([]))
        .finally(() => setLoadingPlanes(false));
    }
  }, [step]);

  const handleRegistrarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razonSocial.trim() || !correo.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/empresa/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razonSocial: razonSocial.trim(),
          nombre_comercial: nombreComercial.trim() || razonSocial.trim(),
          correo: correo.trim(),
          telefono: telefono.trim(),
          sitio_web: sitioWeb.trim(),
          direccion: direccion.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al registrar la empresa");
      setEmpresa({
        id_empresa: json.id_empresa,
        razonSocial: json.razonSocial ?? razonSocial.trim(),
        nombre_comercial: (json.nombre_comercial ?? nombreComercial.trim()) || razonSocial.trim(),
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Error de conexión. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuscribir = async () => {
    if (!empresa || !planSeleccionado) return;
    setError(null);
    setLoading(true);
    try {
      const hoy = new Date();
      const fechaInicio = hoy.toISOString().slice(0, 10);
      const fechaFin = new Date(hoy.setMonth(hoy.getMonth() + Math.round(planSeleccionado.duracion_meses)))
        .toISOString().slice(0, 10);

      const res = await fetch(`${API}/api/suscripcion/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_empresa: empresa.id_empresa,
          id_plan: planSeleccionado.id_plan,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al crear la suscripción");
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Error de conexión. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copyRazonSocial = () => {
    navigator.clipboard.writeText(empresa?.razonSocial ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <Suspense fallback={null}>
        <NeuralBackground />
      </Suspense>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Inicio
          </Button>
          <img src={mindexaLogo} alt="Mindexa" className="h-9 cursor-pointer" onClick={() => navigate("/")} />
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
            <Building2 className="h-3 w-3 mr-1" />
            Registro Empresarial
          </Badge>
        </div>
      </header>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { n: 1, label: "Tu empresa" },
              { n: 2, label: "Elige tu plan" },
              { n: 3, label: "¡Listo!" },
            ].map(({ n, label }, i, arr) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`flex flex-col items-center gap-1`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    step > n ? "bg-green-500 border-green-500 text-white" :
                    step === n ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30" :
                    "border-white/20 text-white/40"
                  }`}>
                    {step > n ? <Check className="h-4 w-4" /> : n}
                  </div>
                  <span className={`text-xs hidden sm:block ${step === n ? "text-white" : "text-white/40"}`}>
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`h-0.5 w-16 mb-4 transition-all ${step > n ? "bg-green-500" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── PASO 1: Registro empresa ── */}
          {step === 1 && (
            <Card className="border-2 border-blue-400/20 bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Registra tu empresa</CardTitle>
                    <CardDescription className="text-slate-400">
                      Ingresa los datos de tu organización
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistrarEmpresa} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        Razón social <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={razonSocial}
                        onChange={e => setRazonSocial(e.target.value)}
                        placeholder="Ej: Minera Norte S.A."
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                        required
                      />
                      <p className="text-xs text-slate-500">Los empleados usarán este nombre exacto al registrarse</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nombre comercial</Label>
                      <Input
                        value={nombreComercial}
                        onChange={e => setNombreComercial(e.target.value)}
                        placeholder="Ej: MineraNorte"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        Email corporativo <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        type="email"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        placeholder="rrhh@empresa.com"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Teléfono</Label>
                      <Input
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        placeholder="+56 9 1234 5678"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Sitio web</Label>
                      <Input
                        value={sitioWeb}
                        onChange={e => setSitioWeb(e.target.value)}
                        placeholder="https://www.empresa.com"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Dirección</Label>
                      <Input
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                        placeholder="Av. Principal 123, Santiago"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mt-2"
                    size="lg"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registrando...</>
                    ) : (
                      <>Continuar <ArrowRight className="h-4 w-4 ml-2" /></>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ── PASO 2: Selección de plan ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white">Elige el plan para tu empresa</h2>
                <p className="text-slate-400 mt-1">
                  Empresa registrada: <span className="text-blue-300 font-medium">{empresa?.nombre_comercial}</span>
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {loadingPlanes ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-3 gap-4">
                  {planes.map(plan => {
                    const Icon = PLAN_ICONS[plan.tipo_plan] ?? Shield;
                    const isSelected = planSeleccionado?.id_plan === plan.id_plan;
                    return (
                      <Card
                        key={plan.id_plan}
                        className={`cursor-pointer border-2 bg-slate-900/80 backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                          isSelected
                            ? "border-blue-400 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400"
                            : PLAN_COLORS[plan.tipo_plan] ?? "border-white/20"
                        }`}
                        onClick={() => setPlanSeleccionado(plan)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`h-6 w-6 ${PLAN_ACCENT[plan.tipo_plan] ?? "text-white"}`} />
                            {isSelected && <Check className="h-5 w-5 text-blue-400" />}
                          </div>
                          <Badge className={`w-fit text-xs ${PLAN_BADGE[plan.tipo_plan] ?? ""}`}>
                            {plan.tipo_plan}
                          </Badge>
                          <CardTitle className="text-white text-lg mt-2">{plan.nombre_plan}</CardTitle>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-bold ${PLAN_ACCENT[plan.tipo_plan] ?? "text-white"}`}>
                              ${plan.precio_por_usuario}
                            </span>
                            <span className="text-slate-400 text-sm">/usuario/mes</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-400 leading-relaxed">{plan.descripcion}</p>
                          <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                            <CheckCircle className="h-3 w-3" />
                            Duración: {plan.duracion_meses === 1 ? "1 mes" : `${plan.duracion_meses} meses`}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <Button
                  onClick={handleSuscribir}
                  disabled={!planSeleccionado || loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  size="lg"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Activando plan...</>
                  ) : (
                    <>Activar {planSeleccionado?.nombre_plan ?? "plan"} <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ── PASO 3: Confirmación ── */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">¡Todo listo!</h2>
                <p className="text-slate-400">
                  <span className="text-white font-medium">{empresa?.nombre_comercial}</span> está registrada
                  con el plan <span className="text-blue-300 font-medium">{planSeleccionado?.nombre_plan}</span>.
                </p>
              </div>

              {/* Instrucciones para empleados */}
              <Card className="border border-blue-400/20 bg-slate-900/80 backdrop-blur-xl text-left">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Instrucciones para tus empleados
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Comparte esta información con tu equipo para que puedan registrarse
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">1. Ir a <span className="text-blue-300 font-mono">/auth</span> y crear una cuenta</p>
                    <p className="text-sm text-slate-400">2. En el campo <strong className="text-white">"Contratista"</strong> escribir exactamente:</p>
                    <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <code className="text-blue-300 font-mono text-sm flex-1 break-all">{empresa?.razonSocial}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-400 hover:text-blue-300 shrink-0"
                        onClick={copyRazonSocial}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">⚠️ El nombre debe coincidir exactamente (mayúsculas, espacios y puntuación)</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-sm text-slate-400">
                      Plan activo: <span className="text-white font-medium">{planSeleccionado?.nombre_plan}</span>
                      {" · "}Duración: <span className="text-white">{planSeleccionado?.duracion_meses === 1 ? "1 mes" : `${planSeleccionado?.duracion_meses} meses`}</span>
                      {" · "}Precio: <span className="text-white">${planSeleccionado?.precio_por_usuario}/usuario/mes</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Volver al inicio
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ir al login / registro
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
