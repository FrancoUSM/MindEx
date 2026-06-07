import { Check, Building2, Zap, BarChart3, Shield, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  pricePerWorker: string;
  description: string;
  features: PlanFeature[];
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  glowColor: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "CORE",
    pricePerWorker: "$3",
    description: "Fundamentos del bienestar laboral",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-400/40",
    glowColor: "shadow-blue-500/20",
    features: [
      { text: "Evaluaciones periódicas" },
      { text: "Dashboard gerencial" },
      { text: "Indicadores de riesgo" },
      { text: "Alertas tempranas" },
      { text: "Reportes de bienestar" },
    ],
  },
  {
    name: "ADVANCED",
    pricePerWorker: "$6",
    description: "Inteligencia predictiva avanzada",
    icon: <BarChart3 className="h-6 w-6" />,
    gradient: "from-blue-600 to-indigo-600",
    borderColor: "border-indigo-400/50",
    glowColor: "shadow-indigo-500/30",
    popular: true,
    features: [
      { text: "Todo lo de CORE +" },
      { text: "IA predictiva" },
      { text: "Mapas de riesgo mental" },
      { text: "Análisis por turno / rol / área" },
      { text: "Recomendaciones operativas" },
      { text: "Benchmark interno" },
    ],
  },
  {
    name: "ENTERPRISE",
    pricePerWorker: "$10",
    description: "Solución empresarial completa",
    icon: <Shield className="h-6 w-6" />,
    gradient: "from-indigo-600 to-purple-600",
    borderColor: "border-purple-400/50",
    glowColor: "shadow-purple-500/30",
    features: [
      { text: "Todo lo de ADVANCED +" },
      { text: "Integración con HR / EHS / ERP" },
      { text: "API completa" },
      { text: "SSO (Single Sign-On)" },
      { text: "Cumplimiento normativo" },
      { text: "Soporte 24/7" },
      { text: "Comité clínico empresarial" },
    ],
  },
];

export default function EnterprisePricing() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-5 py-2 mb-6">
            <Building2 className="h-4 w-4 text-cyan-300" />
            <span className="text-sm font-medium text-cyan-200">Planes Empresariales B2B</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Protege a tu equipo
            </span>
          </h2>
          <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
            Modelo híbrido: Fee base de plataforma + licencia por trabajador activo
          </p>
        </div>

        {/* Platform Fee Card */}
        <Card className="max-w-md mx-auto mb-12 bg-gradient-to-br from-blue-900/50 to-cyan-900/30 border-2 border-cyan-400/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
              <Building2 className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-medium text-cyan-200">Fee Plataforma</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-bold text-white">$300</span>
              <span className="text-slate-400">USD / mes</span>
            </div>
            <p className="text-sm text-slate-400">Acceso base para todas las empresas</p>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group rounded-3xl bg-slate-900/80 backdrop-blur-xl border-2 ${plan.borderColor} p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.glowColor} ${
                plan.popular ? "ring-2 ring-indigo-500/50" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    RECOMENDADO
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                {plan.icon}
              </div>

              {/* Plan Info */}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{plan.pricePerWorker}</span>
                <span className="text-slate-400">/ trabajador / mes</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-300">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Example Calculator */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-blue-400/20 backdrop-blur-xl mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ejemplo de Inversión</h3>
                <p className="text-sm text-slate-400">Empresa de 200 trabajadores – Plan Advanced</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <span className="text-slate-300">Fee Plataforma</span>
                <span className="text-white font-semibold">$300 USD</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <span className="text-slate-300">Licencias (200 × $6)</span>
                <span className="text-white font-semibold">$1,200 USD</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg px-4 -mx-4">
                <span className="text-white font-bold text-lg">Total Mensual</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">$1,500 USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="px-10 py-7 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
          >
            Solicitar Demo Corporativa
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
