import { Check, Sparkles, Crown, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period?: string;
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
    period: "/ primer mes",
    description: "Prueba gratuita para trabajadores activos",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-slate-500 to-slate-600",
    borderColor: "border-slate-400/30",
    glowColor: "shadow-slate-500/20",
    features: [
      { text: "Autoevaluación mental básica", included: true },
      { text: "1 mes de prueba gratis", included: true },
      { text: "Diagnóstico simplificado", included: true },
      { text: "Recomendaciones generales", included: true },
      { text: "Luego elige tu plan", included: true },
    ],
    buttonText: "Probar 1 Mes Gratis",
  },
  {
    name: "PREMIUM",
    price: "$24.99",
    period: "/ mes",
    description: "Seguimiento completo para tu bienestar laboral",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-purple-500 to-fuchsia-500",
    borderColor: "border-purple-400/50",
    glowColor: "shadow-purple-500/30",
    popular: true,
    features: [
      { text: "Diagnóstico completo y detallado", included: true },
      { text: "Seguimiento avanzado", included: true },
      { text: "IA Coach Personal", included: true },
      { text: "Programas personalizados", included: true },
      { text: "Comparativos históricos", included: true },
      { text: "Acceso preferente a especialistas", included: true },
      { text: "Reportes de progreso", included: true },
    ],
    buttonText: "Elegir Premium",
  },
  {
    name: "PREMIUM PLUS",
    price: "$59.99",
    period: "/ mes",
    description: "Atención clínica integral para profesionales",
    icon: <Crown className="h-6 w-6" />,
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-400/50",
    glowColor: "shadow-amber-500/30",
    features: [
      { text: "Todo lo de Premium +", included: true },
      { text: "1 sesión mensual con especialista", included: true },
      { text: "Prioridad en agenda", included: true },
      { text: "Intervención preventiva", included: true },
      { text: "Recomendaciones clínicas personalizadas", included: true },
      { text: "Soporte prioritario 24/7", included: true },
    ],
    buttonText: "Acceder a Premium Plus",
  },
];

export default function IndividualPricing() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-5 py-2 mb-6">
            <Star className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">Planes Individuales</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
              Elige tu plan de bienestar
            </span>
          </h2>
          <p className="text-lg text-purple-200/70 max-w-2xl mx-auto">
            Desde herramientas gratuitas hasta atención clínica completa. Invierte en tu salud mental.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group rounded-3xl bg-slate-900/80 backdrop-blur-xl border-2 ${plan.borderColor} p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.glowColor} ${
                plan.popular ? "ring-2 ring-purple-500/50" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MÁS POPULAR
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
      </div>
    </section>
  );
}
