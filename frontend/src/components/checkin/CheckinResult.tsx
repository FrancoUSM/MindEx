import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Heart,
  Trophy,
  Flame,
  X
} from "lucide-react";
import { 
  ResultLevel, 
  RESULT_CONFIGS, 
  STREAK_MESSAGES,
  calculateSessionPoints,
  calculateProgressBar,
  UserProgress
} from "@/lib/gamification";
import { 
  getRandomCopy, 
  POST_CHECKIN_COPYS, 
  POINTS_COPYS,
  PROGRESS_COPYS,
  CLOSING_MESSAGE 
} from "@/lib/copys";

interface CheckinResultProps {
  score: number;
  maxScore: number;
  resultLevel: ResultLevel;
  userProgress: UserProgress;
  onClose: () => void;
  onRequestSupport?: () => void;
}

export function CheckinResult({
  score,
  maxScore,
  resultLevel,
  userProgress,
  onClose,
  onRequestSupport,
}: CheckinResultProps) {
  const [showPoints, setShowPoints] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const config = RESULT_CONFIGS[resultLevel];
  const progressValue = calculateProgressBar(userProgress.totalCheckins, userProgress.streak);
  const { basePoints, bonusPoints, bonusReason } = calculateSessionPoints(
    userProgress.totalCheckins === 1,
    userProgress.streak,
    0 // daysAbsent - would come from real data
  );

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressValue]);

  // Show points animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPoints(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getResultIcon = () => {
    switch (resultLevel) {
      case 'green':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'yellow':
        return <AlertCircle className="h-8 w-8 text-yellow-600" />;
      case 'orange':
        return <AlertTriangle className="h-8 w-8 text-orange-600" />;
      case 'red':
        return <Heart className="h-8 w-8 text-red-600" />;
    }
  };

  // Check for streak milestone message
  const streakMessage = STREAK_MESSAGES[userProgress.streak];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-md w-full ${config.bgColor} ${config.borderColor} border-2 animate-in fade-in zoom-in duration-300`}>
        <CardHeader className="text-center pb-2">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Closing message */}
          <p className="text-sm text-muted-foreground mb-4">
            {CLOSING_MESSAGE.main}
          </p>
          <p className="text-xs text-muted-foreground/80 mb-4">
            {CLOSING_MESSAGE.secondary}
          </p>

          {/* Result Icon & Title */}
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
              {getResultIcon()}
            </div>
            <CardTitle className={`text-xl ${config.color}`}>
              {config.title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Message */}
          <p className="text-center text-sm text-muted-foreground">
            {config.message}
          </p>

          {/* Micro-reinforce */}
          <p className="text-center text-xs text-muted-foreground/80 italic">
            {config.microReinforce}
          </p>

          {/* Points Animation */}
          {showPoints && (
            <div className="bg-white/80 rounded-lg p-4 text-center animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-primary">
                  +{basePoints} puntos
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getRandomCopy(POINTS_COPYS)}
              </p>
              
              {/* Bonus points */}
              {bonusPoints > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <span className="text-sm font-medium text-accent">
                    +{bonusPoints} bonus
                  </span>
                  <p className="text-xs text-muted-foreground">{bonusReason}</p>
                </div>
              )}
            </div>
          )}

          {/* Streak Message */}
          {streakMessage && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 text-center border border-orange-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-orange-700">{streakMessage.title}</span>
              </div>
              <p className="text-sm text-orange-600">{streakMessage.message}</p>
              <p className="text-xs text-orange-500/80 mt-1 italic">{streakMessage.micro}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Racha: {userProgress.streak} días
              </span>
              <span>Constancia</span>
            </div>
            <Progress 
              value={animatedProgress} 
              className="h-2 transition-all duration-1000"
            />
            <p className="text-xs text-center text-muted-foreground">
              {getRandomCopy(PROGRESS_COPYS)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {config.showSupport && (
              <Button 
                onClick={onRequestSupport}
                variant={config.urgent ? "destructive" : "outline"}
                className="w-full"
              >
                <Heart className="h-4 w-4 mr-2" />
                {config.urgent ? "Hablar con un profesional" : "Solicitar apoyo"}
              </Button>
            )}
            
            <Button 
              onClick={onClose}
              variant={config.showSupport ? "ghost" : "default"}
              className="w-full"
            >
              {config.showSupport ? "Cerrar por ahora" : CLOSING_MESSAGE.cta}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
