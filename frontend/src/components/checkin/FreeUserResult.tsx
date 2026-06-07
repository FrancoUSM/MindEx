import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Heart,
  Sparkles,
  Crown,
  Lock,
  TrendingUp,
  Brain,
  X
} from "lucide-react";
import { ResultLevel, RESULT_CONFIGS } from "@/lib/gamification";

interface FreeUserResultProps {
  score: number;
  maxScore: number;
  resultLevel: ResultLevel;
  onClose: () => void;
  onUpgrade?: (plan: 'premium' | 'premium-plus') => void;
}

export function FreeUserResult({
  score,
  maxScore,
  resultLevel,
  onClose,
  onUpgrade,
}: FreeUserResultProps) {
  const config = RESULT_CONFIGS[resultLevel];

  const getResultIcon = () => {
    switch (resultLevel) {
      case 'green':
        return <CheckCircle className="h-8 w-8 text-accent" />;
      case 'yellow':
        return <AlertCircle className="h-8 w-8 text-warning" />;
      case 'orange':
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      case 'red':
        return <Heart className="h-8 w-8 text-destructive" />;
    }
  };

  const getSimplifiedMessage = () => {
    switch (resultLevel) {
      case 'green':
        return "Tu estado general se ve estable. ¡Buen momento para mantener el equilibrio!";
      case 'yellow':
        return "Detectamos algunas señales de carga. Es buen momento para poner atención.";
      case 'orange':
        return "Hay indicadores que merecen atención. Considera buscar apoyo.";
      case 'red':
        return "Es importante que busques apoyo profesional. No estás solo/a.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full bg-card border-2 border-border animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pb-2 relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Result Icon */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
              {getResultIcon()}
            </div>
            <CardTitle className="text-xl">
              Diagnóstico Básico
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Simplified Message */}
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-foreground font-medium">
              {getSimplifiedMessage()}
            </p>
          </div>

          {/* Locked Features Preview */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center font-medium">
              Tu plan Free de prueba incluye solo el diagnóstico básico
            </p>
            
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Análisis detallado por categoría</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Recomendaciones personalizadas</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Seguimiento histórico y tendencias</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">IA Coach Personal</span>
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="space-y-3 pt-2">
            <p className="text-center text-sm font-semibold text-foreground">
              Desbloquea tu diagnóstico completo
            </p>
            
            {/* Premium Card */}
            <div 
              onClick={() => onUpgrade?.('premium')}
              className="group cursor-pointer border-2 border-purple-500/30 hover:border-purple-500/60 rounded-xl p-4 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Premium</p>
                    <p className="text-sm text-muted-foreground">Diagnóstico completo + IA Coach</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-400">$24.99</p>
                  <p className="text-xs text-muted-foreground">/mes</p>
                </div>
              </div>
            </div>

            {/* Premium Plus Card */}
            <div 
              onClick={() => onUpgrade?.('premium-plus')}
              className="group cursor-pointer border-2 border-amber-500/30 hover:border-amber-500/60 rounded-xl p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 transition-all hover:shadow-lg hover:shadow-amber-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Premium Plus</p>
                    <p className="text-sm text-muted-foreground">Todo + Sesión con especialista</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-400">$59.99</p>
                  <p className="text-xs text-muted-foreground">/mes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <Button 
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Cerrar por ahora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}