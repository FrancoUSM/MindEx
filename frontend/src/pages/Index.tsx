import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Stethoscope, ExternalLink, Sparkles, Activity, Check, Zap, Crown, Star, TrendingUp, Stethoscope as StethoscopeIcon, Award, Users } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { Button } from "@/components/ui/button";

const NeuralBackground = lazy(() => import("@/components/three/NeuralBackground"));

type ActivePricing = 'enterprise' | 'individual' | 'professional';

const Index = () => {
  const navigate = useNavigate();
  const [activePricing, setActivePricing] = useState<ActivePricing>('individual');

  const tabs = [
    { 
      id: 'enterprise' as const, 
      label: 'Empresarial', 
      icon: Building2,
      color: 'from-[hsl(206,100%,50%)] to-[hsl(187,85%,53%)]',
      activeColor: 'bg-[hsl(206,100%,50%)]',
      borderColor: 'border-[hsl(206,100%,50%)]'
    },
    { 
      id: 'individual' as const, 
      label: 'Individual', 
      icon: User,
      color: 'from-[hsl(280,70%,60%)] to-[hsl(320,70%,55%)]',
      activeColor: 'bg-[hsl(280,70%,60%)]',
      borderColor: 'border-[hsl(280,70%,60%)]'
    },
    { 
      id: 'professional' as const, 
      label: 'Profesional', 
      icon: Stethoscope,
      color: 'from-[hsl(160,84%,39%)] to-[hsl(173,80%,40%)]',
      activeColor: 'bg-[hsl(160,84%,39%)]',
      borderColor: 'border-[hsl(160,84%,39%)]'
    },
  ];

  // Plans data
  const individualPlans = [
    {
      name: "FREE",
      price: "$0",
      period: "/ primer mes",
      description: "Prueba gratuita para trabajadores activos",
      icon: <Zap className="h-6 w-6" />,
      features: ["Autoevaluación mental básica", "1 mes de prueba gratis", "Diagnóstico simplificado", "Recomendaciones generales", "Luego elige tu plan"],
      buttonText: "Probar 1 Mes Gratis",
      note: "Solo primer mes",
    },
    {
      name: "PREMIUM",
      price: "$24.99",
      period: "/ mes",
      description: "Seguimiento completo para tu bienestar laboral",
      icon: <Sparkles className="h-6 w-6" />,
      popular: true,
      features: ["Diagnóstico completo y detallado", "Seguimiento avanzado", "IA Coach Personal", "Programas personalizados", "Comparativos históricos", "Acceso preferente a especialistas", "Reportes de progreso"],
      buttonText: "Elegir Premium",
    },
    {
      name: "PREMIUM PLUS",
      price: "$59.99",
      period: "/ mes",
      description: "Atención clínica integral para profesionales",
      icon: <Crown className="h-6 w-6" />,
      features: ["Todo lo de Premium +", "1 sesión mensual con especialista", "Prioridad en agenda", "Intervención preventiva", "Recomendaciones clínicas personalizadas", "Soporte prioritario 24/7"],
      buttonText: "Acceder a Premium Plus",
    },
  ];

  const enterprisePlans = [
    {
      name: "CORE",
      price: "$3",
      period: "/ trabajador / mes",
      description: "Monitoreo básico de bienestar laboral",
      icon: <Users className="h-6 w-6" />,
      features: ["Evaluaciones periódicas", "Dashboard gerencial", "Indicadores de riesgo", "Alertas tempranas", "Reportes de bienestar"],
      buttonText: "Solicitar Demo",
      note: "+ Fee base $300/mes",
    },
    {
      name: "ADVANCED",
      price: "$6",
      period: "/ trabajador / mes",
      description: "Analítica predictiva avanzada",
      icon: <TrendingUp className="h-6 w-6" />,
      popular: true,
      features: ["Todo lo de Core +", "IA predictiva", "Mapas de riesgo mental", "Análisis por turno/rol/área", "Recomendaciones operativas", "Benchmark interno"],
      buttonText: "Solicitar Demo",
      note: "+ Fee base $300/mes",
    },
    {
      name: "ENTERPRISE",
      price: "$10",
      period: "/ trabajador / mes",
      description: "Solución integral empresarial",
      icon: <Building2 className="h-6 w-6" />,
      features: ["Todo lo de Advanced +", "Integración HR/EHS/ERP", "API & SSO", "Cumplimiento normativo", "Soporte 24/7", "Comité clínico empresarial"],
      buttonText: "Contactar Ventas",
      note: "+ Fee base $300/mes",
    },
  ];

  const professionalPlans = [
    {
      name: "FREE",
      price: "$0",
      period: "/ mes",
      description: "Comienza a atender pacientes",
      icon: <StethoscopeIcon className="h-6 w-6" />,
      features: ["Perfil público", "Agenda integrada", "Match con pacientes", "Videoconsulta", "Historial básico"],
      buttonText: "Registrarse Gratis",
      commission: "15% comisión por sesión",
    },
    {
      name: "PRO",
      price: "$29",
      period: "/ mes",
      description: "Maximiza tu práctica profesional",
      icon: <Award className="h-6 w-6" />,
      popular: true,
      features: ["Todo lo de Free +", "Mayor visibilidad", "IA apoyo clínico", "Automatización de informes", "Marketing interno"],
      buttonText: "Ser Profesional Pro",
      commission: "10% comisión por sesión",
    },
    {
      name: "CLÍNICA",
      price: "Personalizado",
      description: "Para clínicas y centros de salud",
      icon: <Building2 className="h-6 w-6" />,
      features: ["Múltiples profesionales", "Gestión centralizada", "Reportes consolidados", "Branding personalizado", "Soporte prioritario"],
      buttonText: "Contactar",
      commission: "Comisión negociable",
    },
  ];

  const getPlans = () => {
    switch (activePricing) {
      case 'enterprise': return enterprisePlans;
      case 'individual': return individualPlans;
      case 'professional': return professionalPlans;
    }
  };

  const getGradient = () => {
    switch (activePricing) {
      case 'enterprise': return 'from-[hsl(206,100%,50%)] to-[hsl(187,85%,53%)]';
      case 'individual': return 'from-[hsl(280,70%,60%)] to-[hsl(320,70%,55%)]';
      case 'professional': return 'from-[hsl(160,84%,39%)] to-[hsl(173,80%,40%)]';
    }
  };

  const getAccentColor = () => {
    switch (activePricing) {
      case 'enterprise': return 'text-[hsl(187,85%,53%)]';
      case 'individual': return 'text-[hsl(320,70%,65%)]';
      case 'professional': return 'text-[hsl(160,84%,49%)]';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-hero-bg via-hero-bg-deep to-hero-bg relative overflow-hidden">
      {/* 3D Neural Background */}
      <Suspense fallback={null}>
        <NeuralBackground />
      </Suspense>
      
      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-hero-bg/30 via-transparent to-hero-bg/50 z-[1]" />

      {/* Floating Website Button */}
      <a 
        href="https://mindexa.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 group"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-hero-blue/90 to-hero-cyan/90 backdrop-blur-md border border-hero-text/20 rounded-full px-5 py-3 shadow-2xl shadow-hero-blue/30 hover:shadow-hero-blue/50 transition-all duration-300 hover:scale-105">
          <Sparkles className="h-5 w-5 text-hero-text" />
          <span className="text-hero-text font-semibold text-sm">Conoce más sobre Mindexa</span>
          <ExternalLink className="h-4 w-4 text-hero-text/80 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-hero-text/10 backdrop-blur-sm border border-hero-text/20 rounded-full px-5 py-2 mb-6">
            <Activity className="h-4 w-4 text-hero-cyan" />
            <span className="text-sm font-medium text-hero-cyan">Plataforma de Salud Mental Predictiva</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-hero-blue via-hero-cyan to-hero-blue bg-clip-text text-transparent">
              Tu bienestar,
            </span>
            <br />
            <span className="bg-gradient-to-r from-hero-text-muted via-hero-text to-hero-text-muted bg-clip-text text-transparent">
              nuestra prioridad
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-hero-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Monitoreo inteligente y evaluaciones científicas para cuidar 
            tu salud mental. Para empresas y personas.
          </p>

          {/* Portal Access Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {/* Empresas Card */}
            <Card 
              className="group cursor-pointer bg-[hsl(217,33%,10%)]/80 backdrop-blur-xl border-2 border-[hsl(206,100%,50%)]/30 hover:border-[hsl(206,100%,50%)]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(206,100%,50%)]/20"
              onClick={() => navigate('/empresa')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(206,100%,50%)] to-[hsl(187,85%,53%)] flex items-center justify-center shadow-lg shadow-[hsl(206,100%,50%)]/30 group-hover:shadow-[hsl(206,100%,50%)]/50 transition-all">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-[hsl(187,85%,53%)] transition-colors">
                  Empresas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-white/60 mb-4">
                  Gestión de bienestar laboral y cumplimiento normativo
                </p>
                <div className="flex items-center justify-center gap-2 text-[hsl(187,85%,53%)] font-medium">
                  <span>Acceder al portal</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Personas Card */}
            <Card 
              className="group cursor-pointer bg-[hsl(217,33%,10%)]/80 backdrop-blur-xl border-2 border-[hsl(280,70%,60%)]/30 hover:border-[hsl(280,70%,60%)]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(280,70%,60%)]/20"
              onClick={() => navigate('/checkin')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(280,70%,60%)] to-[hsl(320,70%,55%)] flex items-center justify-center shadow-lg shadow-[hsl(280,70%,60%)]/30 group-hover:shadow-[hsl(280,70%,60%)]/50 transition-all">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-[hsl(320,70%,65%)] transition-colors">
                  Personas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-white/60 mb-4">
                  Autoevaluación para trabajadores activos
                </p>
                <div className="flex items-center justify-center gap-2 text-[hsl(320,70%,65%)] font-medium">
                  <span>Comenzar check-in</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Profesionales Card */}
            <Card 
              className="group cursor-pointer bg-[hsl(217,33%,10%)]/80 backdrop-blur-xl border-2 border-[hsl(160,84%,39%)]/30 hover:border-[hsl(160,84%,39%)]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(160,84%,39%)]/20"
              onClick={() => navigate('/professionals')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(160,84%,39%)] to-[hsl(173,80%,40%)] flex items-center justify-center shadow-lg shadow-[hsl(160,84%,39%)]/30 group-hover:shadow-[hsl(160,84%,39%)]/50 transition-all">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-[hsl(160,84%,49%)] transition-colors">
                  Profesionales
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-white/60 mb-4">
                  Portal para especialistas en salud mental
                </p>
                <div className="flex items-center justify-center gap-2 text-[hsl(160,84%,49%)] font-medium">
                  <span>Portal profesional</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Section Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-4">
              <Star className="h-4 w-4 text-white/70" />
              <span className="text-sm font-medium text-white/70">Nuestros Planes</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Elige el plan perfecto para ti
            </h2>
          </div>

          {/* Pricing Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-[hsl(217,33%,10%)] rounded-2xl p-1.5 border border-white/10 backdrop-blur-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activePricing === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePricing(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full mb-12">
            {getPlans().map((plan, index) => (
              <div
                key={plan.name}
                className={`relative group rounded-3xl bg-[hsl(217,33%,10%)]/90 backdrop-blur-xl border-2 p-6 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? `border-gradient-to-r ${tabs.find(t => t.id === activePricing)?.borderColor} ring-2 ring-offset-2 ring-offset-transparent` 
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{
                  borderColor: plan.popular ? undefined : undefined,
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className={`bg-gradient-to-r ${getGradient()} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
                      RECOMENDADO
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center mb-4 shadow-lg`}>
                  {plan.icon}
                </div>

                {/* Plan Info */}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/50 text-sm">{plan.period}</span>}
                </div>
                <p className="text-sm text-white/60 mb-4">{plan.description}</p>

                {/* Commission/Note badge */}
                {'commission' in plan && (
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getGradient()} bg-opacity-20 mb-4`}>
                    <span className={`text-xs font-semibold ${getAccentColor()}`}>{plan.commission}</span>
                  </div>
                )}
                {'note' in plan && (
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 mb-4">
                    <span className="text-xs font-semibold text-white/70">{plan.note}</span>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2 mb-6 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-sm text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-5 text-sm font-semibold rounded-xl bg-gradient-to-r ${getGradient()} hover:opacity-90 transition-opacity border-0`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* Bottom Stats/Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-hero-blue to-hero-cyan bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-hero-text-muted mt-1">Confidencial</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-hero-text-muted to-hero-text bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-hero-text-muted mt-1">Disponibilidad</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-hero-emerald to-hero-teal bg-clip-text text-transparent">
                IA
              </div>
              <div className="text-sm text-hero-text-muted mt-1">Predictiva</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer subtle */}
      <div className="py-8 text-center relative z-10">
        <p className="text-xs text-hero-text-muted/50">
          © 2025 Mindexa — Cuidando tu salud mental
        </p>
      </div>
    </div>
  );
};

export default Index;
