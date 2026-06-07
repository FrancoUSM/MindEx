import { useState, useMemo, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, UserPlus, Bot, Users, Sparkles, 
  Shield, Award, Search, Stethoscope, Heart,
  Brain, CalendarCheck, FileText, BarChart3,
  ChevronRight, Star, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NeuralBackgroundGreen from "@/components/three/NeuralBackgroundGreen";

import { MOCK_PROFESSIONALS, Professional, fetchProfesionales } from "@/lib/professionals";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";
import { ProfessionalProfile } from "@/components/professionals/ProfessionalProfile";
import { ProfessionalFilters, FilterState } from "@/components/professionals/ProfessionalFilters";
import { ProfessionalRegistration } from "@/components/professionals/ProfessionalRegistration";
import { TriageBot } from "@/components/professionals/TriageBot";
import { ProfessionalDashboard } from "@/components/professionals/dashboard/ProfessionalDashboard";

type ViewMode = 'landing' | 'directory' | 'profile' | 'register' | 'dashboard';

const ProfessionalsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [showTriageBot, setShowTriageBot] = useState(false);
  
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);

  useEffect(() => {
    fetchProfesionales().then(setProfessionals);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    specialties: [],
    approach: '',
    priceRange: [0, 100000],
    minRating: 0,
    onlyVerified: false,
    onlyMindexa: false,
  });

  // Filter professionals
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(prof => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          prof.name.toLowerCase().includes(searchLower) ||
          prof.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
          prof.approach.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.specialties.length > 0) {
        const hasSpecialty = filters.specialties.some(s => 
          prof.specialties.includes(s)
        );
        if (!hasSpecialty) return false;
      }

      if (filters.approach && prof.approach !== filters.approach) {
        return false;
      }

      if (prof.price < filters.priceRange[0] || prof.price > filters.priceRange[1]) {
        return false;
      }

      if (filters.minRating > 0 && prof.rating < filters.minRating) {
        return false;
      }

      if (filters.onlyVerified && !prof.verified) {
        return false;
      }

      if (filters.onlyMindexa && !prof.acceptsMindexa) {
        return false;
      }

      return true;
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [filters]);

  const selectedProfessional = selectedProfessionalId
    ? professionals.find(p => p.id === selectedProfessionalId)
    : null;

  const handleViewProfile = (id: string) => {
    setSelectedProfessionalId(id);
    setViewMode('profile');
  };

  const handleBook = (id: string) => {
    setSelectedProfessionalId(id);
    setViewMode('profile');
  };

  // Dashboard View
  if (viewMode === 'dashboard') {
    const session = (() => {
      try { return JSON.parse(localStorage.getItem('mindexa_session') || '{}'); }
      catch { return {}; }
    })();
    const userId: number = session?.id_usuario ?? 0;
    return (
      <ProfessionalDashboard
        userId={userId}
        onBack={() => setViewMode('landing')}
      />
    );
  }

  // Registration View
  if (viewMode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <header className="border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode('landing')}
              className="text-emerald-400 hover:bg-emerald-500/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MINDEXA</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Portal Profesional
              </Badge>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ProfessionalRegistration 
            onComplete={() => setViewMode('landing')}
            onBack={() => setViewMode('landing')}
          />
        </main>
      </div>
    );
  }

  // Profile View
  if (viewMode === 'profile' && selectedProfessional) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <header className="border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode('directory')}
              className="text-emerald-400 hover:bg-emerald-500/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MINDEXA</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ProfessionalProfile 
            professional={selectedProfessional}
            onBack={() => setViewMode('directory')}
          />
        </main>
      </div>
    );
  }

  // Directory View
  if (viewMode === 'directory') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <header className="border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('landing')}
                  className="text-emerald-400 hover:bg-emerald-500/10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">MINDEXA</span>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowTriageBot(!showTriageBot)}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Bot className="h-4 w-4 mr-2" />
                {showTriageBot ? 'Cerrar asistente' : 'Ayuda para elegir'}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className={`flex-1 ${showTriageBot ? 'lg:max-w-[60%]' : ''}`}>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-white">
                  Encuentra tu profesional ideal
                </h1>
                <p className="text-slate-400">
                  Psicólogos y psiquiatras especializados en salud mental
                </p>
              </div>

              <ProfessionalFilters 
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredProfessionals.length}
              />

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    professional={professional}
                    onViewProfile={handleViewProfile}
                    onBook={handleBook}
                  />
                ))}
              </div>

              {filteredProfessionals.length === 0 && (
                <Card className="mt-8 bg-slate-900/50 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-white">
                      No encontramos profesionales
                    </h3>
                    <p className="text-slate-400">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {showTriageBot && (
              <div className="hidden lg:block w-[400px] flex-shrink-0">
                <div className="sticky top-24">
                  <TriageBot 
                    onSelectProfessional={handleViewProfile}
                    onClose={() => setShowTriageBot(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Landing View (default) - COMPLETELY REDESIGNED
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 z-50 group flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-md border border-emerald-400/30 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
      >
        <ArrowLeft className="h-5 w-5 text-white group-hover:-translate-x-1 transition-transform" />
        <span className="text-white font-semibold text-sm">Volver al Inicio</span>
      </button>

      {/* 3D Neural Background */}
      <Suspense fallback={null}>
        <NeuralBackgroundGreen />
      </Suspense>

      {/* Floating Header */}
      <header className="relative z-50 border-b border-emerald-500/20 bg-slate-950/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/')}
                className="text-emerald-400 hover:bg-emerald-500/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">MINDEXA</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Portal Profesional
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setViewMode('dashboard')}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                Acceso Profesionales
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-1.5">
            <Sparkles className="h-3 w-3 mr-2" />
            Red de Profesionales de Salud Mental
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Conectamos mentes,
            </span>
            <br />
            <span className="text-white">
              transformamos vidas
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Plataforma que une a personas que buscan apoyo psicológico con profesionales 
            especializados que quieren expandir su práctica clínica.
          </p>

          {/* Two Main Access Points */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* For Users */}
            <div 
              onClick={() => setViewMode('directory')}
              className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-slate-900/50 to-slate-900/80 border-2 border-cyan-400/30 backdrop-blur-xl hover:border-cyan-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                Busco Apoyo
              </Badge>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Encuentra tu Profesional
              </h3>
              <p className="text-slate-400 mb-6">
                Accede a nuestra red de psicólogos y psiquiatras verificados. 
                Nuestro bot de triaje te ayuda a encontrar el match perfecto.
              </p>
              <div className="flex items-center justify-center gap-2 text-cyan-400 font-medium group-hover:gap-4 transition-all">
                <Search className="h-5 w-5" />
                Buscar profesionales
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            {/* For Professionals */}
            <div 
              onClick={() => setViewMode('register')}
              className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-slate-900/80 border-2 border-emerald-400/30 backdrop-blur-xl hover:border-emerald-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Soy Profesional
              </Badge>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Únete a la Red
              </h3>
              <p className="text-slate-400 mb-6">
                Crea tu perfil profesional, gestiona pacientes con herramientas IA 
                y expande tu práctica clínica.
              </p>
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium group-hover:gap-4 transition-all">
                <UserPlus className="h-5 w-5" />
                Registrarme ahora
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Users */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-slate-900/50 to-slate-950/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              Para personas
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Encuentra el apoyo que necesitas
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tecnología inteligente para conectarte con el profesional ideal según tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Bot className="h-7 w-7 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Bot de Triaje IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Nuestro asistente inteligente analiza tus necesidades y te recomienda 
                  al profesional más compatible.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Profesionales Verificados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Todos nuestros profesionales pasan por un riguroso proceso de 
                  verificación de credenciales.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Star className="h-7 w-7 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Matching Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Algoritmo que conecta basándose en compatibilidad y éxito 
                  histórico en casos similares.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => setViewMode('directory')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25"
            >
              <Search className="mr-2 h-5 w-5" />
              Explorar Profesionales
            </Button>
          </div>
        </div>
      </section>

      {/* Features for Professionals */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Para profesionales
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Herramientas avanzadas para tu práctica
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Potencia tu consulta con tecnología de vanguardia diseñada por y para profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
              <CardHeader>
                <Award className="h-8 w-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg text-white">Perfil Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Crea tu perfil verificado y gana visibilidad ante miles de potenciales pacientes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg text-white">Dashboard Predictivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Visualiza datos del check-in y alertas de riesgo antes de cada sesión.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
              <CardHeader>
                <FileText className="h-8 w-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg text-white">Copiloto de Notas IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Transcripción automática y resúmenes IA para generar fichas clínicas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
              <CardHeader>
                <CalendarCheck className="h-8 w-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg text-white">Gestión de Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Sistema completo de reservas, recordatorios y seguimiento de pacientes.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => setViewMode('register')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/25"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Únete como Profesional
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {professionals.length}+
              </p>
              <p className="text-slate-400 mt-2">Profesionales verificados</p>
            </div>
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                98%
              </p>
              <p className="text-slate-400 mt-2">Satisfacción pacientes</p>
            </div>
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                24h
              </p>
              <p className="text-slate-400 mt-2">Respuesta promedio</p>
            </div>
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                100%
              </p>
              <p className="text-slate-400 mt-2">Confidencialidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Ya sea que busques apoyo profesional o quieras expandir tu práctica clínica, 
              MINDEXA te conecta con las oportunidades correctas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setViewMode('directory')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25"
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar profesional
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setViewMode('register')}
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Registrarme como profesional
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 MINDEXA. Plataforma de Salud Mental Predictiva.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalsPage;
