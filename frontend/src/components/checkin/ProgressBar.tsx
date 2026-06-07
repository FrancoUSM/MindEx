import { Progress } from "@/components/ui/progress";
import { Flame, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProgress, BADGES } from "@/lib/gamification";

interface ProgressBarProps {
  userProgress: UserProgress;
  showDetails?: boolean;
}

export function ProgressBar({ userProgress, showDetails = true }: ProgressBarProps) {
  const progressValue = Math.min(
    (userProgress.totalCheckins * 1.5) + (userProgress.streak * 3),
    100
  );

  return (
    <div className="space-y-3">
      {/* Stats Row */}
      {showDetails && (
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            {/* Points */}
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-medium">{userProgress.points}</span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{userProgress.streak}</span>
              <span className="text-xs text-muted-foreground">días</span>
            </div>
          </div>
          
          {/* Badges count */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              {userProgress.badges.length} insignias
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar - Blue/Green (never red/orange for clinical alerts) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tu constancia</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2 bg-blue-100"
        />
      </div>

      {/* Badges Display */}
      {showDetails && userProgress.badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {userProgress.badges.slice(0, 4).map((badge) => (
            <Badge 
              key={badge.id} 
              variant="secondary" 
              className="text-xs py-0.5"
            >
              {badge.icon} {badge.name}
            </Badge>
          ))}
          {userProgress.badges.length > 4 && (
            <Badge variant="outline" className="text-xs py-0.5">
              +{userProgress.badges.length - 4} más
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
