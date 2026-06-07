import { Check, Stethoscope, Zap, Award, TrendingUp, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  price: string;
  period?: string;
  commission: string;
  commissionNote?: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  glowColor: string;
}

const plans: Plan[] = [
  {
    name: "FREE",
    price: "$0",
    period: "/ mes",
    commission: "15%",
    commissionNote: "por sesión",
    description: "Comienza a practicar en nuestra plataforma",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-400/40",
    glowColor: "shadow-emerald-500/20",
    features: [
      { text: "Perfil público profesional" },
      { text: "Agenda integrada" },
      { text: "Match con pacientes" },
      { text: "Videoconsulta incluida" },
      { text: "Historial básico de pacientes" },
    ],
    buttonText: "Registrarme Gratis",
  },
  {
    name: "PRO",
    price: "$29",
    period: "/ mes",
    commission: "10%",
    commissionNote: "por sesión",
    description: "Maximiza tu práctica profesional",
    icon: <Award className="h-6 w-6" />,
    gradient: "from-teal-500 to-cyan-500",
    borderColor: "border-teal-400/50",
    glowColor: "shadow-teal-500/30",
    popular: true,
    features: [
      { text: "Todo lo de Free +" },
      { text: "Mayor visibilidad en búsquedas" },
      { text: "IA de apoyo clínico" },
      { text: "Automatización de informes" },
      { text: "Marketing interno prioritario" },
      { text: "Comisión reducida (10%)" },
    ],
    buttonText: "Ser Profesional Pro",
  },
];

export default function ProfessionalPricing() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-5 py-2 mb-6">
            <Stethoscope className="h-4 w-4 text-emerald-300" />
            <span className="text-sm font-medium text-emerald-200">Planes para Profesionales</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              Potencia tu práctica clínica
            </span>
          </h2>
          <p className="text-lg text-emerald-200/70 max-w-2xl mx-auto">
            Únete a nuestra red de especialistas y conecta con pacientes que te necesitan
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group rounded-3xl bg-slate-900/80 backdrop-blur-xl border-2 ${plan.borderColor} p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.glowColor} ${
                plan.popular ? "ring-2 ring-teal-500/50" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
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
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-400">{plan.period}</span>}
              </div>
              
              {/* Commission Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-3 py-1.5 mb-4">
                <Percent className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Comisión: <span className="text-emerald-400 font-semibold">{plan.commission}</span> {plan.commissionNote}
                </span>
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

              {/* CTA Button */}
              <Button
                className={`w-full py-6 text-base font-semibold rounded-xl bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition-opacity border-0`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Value Props */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Sin costos de adquisición</h4>
            <p className="text-sm text-slate-400">Los pacientes llegan a ti a través de nuestra plataforma</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Herramientas clínicas</h4>
            <p className="text-sm text-slate-400">IA de apoyo, evaluaciones validadas y seguimiento integrado</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Credibilidad</h4>
            <p className="text-sm text-slate-400">Verificación de credenciales y reviews de pacientes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
