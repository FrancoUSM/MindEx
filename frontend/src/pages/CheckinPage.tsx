import { useState, useEffect, Suspense } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IDSMCheckinForm } from "@/components/forms/IDSMCheckinForm";
import { ConsentScreen } from "@/components/consent/ConsentScreen";
import { ProgressBar } from "@/components/checkin/ProgressBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, Calendar, Sparkles, Flame, Trophy, ArrowLeft, User, Activity, History } from "lucide-react";
import { UserProgress, BADGES } from "@/lib/gamification";
import { getRandomCopy, RETURN_COPYS, POST_CHECKIN_COPYS } from "@/lib/copys";
import { useNavigate } from "react-router-dom";
import NeuralBackgroundPurple from "@/components/three/NeuralBackgroundPurple";
import mindexaLogo from "@/assets/mindexa-logo-slogan.png";

export default function CheckinPage() {
  const navigate = useNavigate();
  
  // Consent state
  const [hasConsented, setHasConsented] = useState(() => {
    return localStorage.getItem('mindexa_consent') === 'true';
  });

  // User progress state (mock - replace with real data)
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('mindexa_progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      points: 0,
      streak: 0,
      lastCheckinDate: null,
      badges: [],
      totalCheckins: 0,
    };
  });

  // Check-in state
  const [existingCheckin, setExistingCheckin] = useState<any>(null);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  useEffect(() => {
    if (userProgress.lastCheckinDate) {
      const lastDate = new Date(userProgress.lastCheckinDate).toDateString();
      const today = new Date().toDateString();
      setHasCheckedToday(lastDate === today);
      
      const daysSinceLastCheckin = Math.floor(
        (new Date().getTime() - new Date(userProgress.lastCheckinDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastCheckin >= 3) {
        setWelcomeMessage(getRandomCopy(RETURN_COPYS));
      }
    }
    setLoading(false);
  }, [userProgress.lastCheckinDate]);

  useEffect(() => {
    localStorage.setItem('mindexa_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleConsent = () => {
    localStorage.setItem('mindexa_consent', 'true');
    setHasConsented(true);
  };

  const handleCheckinComplete = (score: number, level: string) => {
    setHasCheckedToday(true);
    setExistingCheckin({
      score,
      level,
      date: new Date().toISOString(),
    });
  };

  const handleEditCheckin = () => {
    setHasCheckedToday(false);
  };

  const handleUpdateProgress = (newProgress: UserProgress) => {
    setUserProgress(newProgress);
  };

  // Show consent screen first
  if (!hasConsented) {
    return <ConsentScreen onAccept={handleConsent} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Suspense fallback={null}>
          <NeuralBackgroundPurple />
        </Suspense>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-lg text-white">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-900">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 z-50 group flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600/90 to-fuchsia-600/90 backdrop-blur-md border border-purple-400/30 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
      >
        <ArrowLeft className="h-5 w-5 text-white group-hover:-translate-x-1 transition-transform" />
        <span className="text-white font-semibold text-sm">Volver al Inicio</span>
      </button>
      <Suspense fallback={null}>
        <NeuralBackgroundPurple />
      </Suspense>

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <img 
            src={mindexaLogo} 
            alt="Mindexa" 
            className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />
          
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/evaluations")}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Activity className="h-4 w-4 mr-2" />
              Evaluaciones
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/history")}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <History className="h-4 w-4 mr-2" />
              Historial
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-purple-200 shadow-md">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">Portal Individual</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
              Check-in de{" "}
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Bienestar
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Esto no es una evaluación. Es un momento breve para chequear cómo estás y cuidarte.
            </p>
          </div>

          {/* Welcome back message */}
          {welcomeMessage && !hasCheckedToday && (
            <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-purple-400/20">
              <CardContent className="p-4 text-center">
                <p className="text-purple-200 font-medium">{welcomeMessage}</p>
                <p className="text-sm text-purple-300/70 mt-1">Retomemos con calma el registro de hoy.</p>
              </CardContent>
            </Card>
          )}

          {hasCheckedToday && existingCheckin ? (
            // Completed check-in view
            <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-purple-400/20">
              <CardHeader>
                <div className="flex items-center gap-2 text-purple-300">
                  <CheckCircle className="h-5 w-5" />
                  <CardTitle className="text-white">Check-in Completado</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  Ya completaste tu registro para hoy — {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Progress Summary */}
                <ProgressBar userProgress={userProgress} showDetails={true} />

                {/* Closing message */}
                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4 text-center backdrop-blur-sm">
                  <p className="text-purple-200 font-medium">
                    {getRandomCopy(POST_CHECKIN_COPYS)}
                  </p>
                  <p className="text-xs text-purple-300/60 mt-1">
                    Tu constancia se va construyendo día a día.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-400/20">
                    <Trophy className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="font-bold text-2xl text-white">{userProgress.points}</div>
                    <div className="text-xs text-white/60">Puntos</div>
                  </div>
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-orange-400/20">
                    <Flame className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                    <div className="font-bold text-2xl text-white">{userProgress.streak}</div>
                    <div className="text-xs text-white/60">Días seguidos</div>
                  </div>
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-pink-400/20">
                    <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                    <div className="font-bold text-2xl text-white">{userProgress.totalCheckins}</div>
                    <div className="text-xs text-white/60">Total registros</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleEditCheckin} 
                    className="flex-1 bg-white/5 border-purple-400/30 text-white hover:bg-white/10 hover:border-purple-400/50"
                  >
                    Editar Check-in
                  </Button>
                  <Button 
                    onClick={() => navigate("/history")}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white border-0"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Historial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Check-in form with styled wrapper
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/5 backdrop-blur-xl border border-purple-400/20">
                <CardContent className="p-6">
                  <IDSMCheckinForm 
                    onComplete={handleCheckinComplete}
                    existingCheckin={existingCheckin}
                    userProgress={userProgress}
                    onUpdateProgress={handleUpdateProgress}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Sin Presión</h3>
                <p className="text-sm text-slate-600">
                  No hay respuestas correctas o incorrectas. Solo un momento para ti.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Recompensas</h3>
                <p className="text-sm text-slate-600">
                  Gana puntos por cuidarte, no por "estar bien".
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Tu Privacidad</h3>
                <p className="text-sm text-slate-600">
                  Tus datos son tuyos. Solo tú decides qué compartir.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="max-w-2xl mx-auto bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Heart className="h-5 w-5 text-pink-500" />
                Acerca de este registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <strong className="text-slate-800">Cómo te sientes influye en tu energía, tu seguridad y tu día a día.</strong>{" "}
                Por eso lo observamos de forma continua y simple.
              </p>
              <p className="italic text-purple-700">
                "Nunca presionamos. Siempre invitamos. Eso es lo que hace que la gente vuelva."
              </p>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Los puntos NO se ganan por "estar bien". Se ganan por cuidarse y participar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
