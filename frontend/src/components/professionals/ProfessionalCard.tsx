import { Star, MapPin, Clock, Video, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Professional, formatPrice } from "@/lib/professionals";

interface ProfessionalCardProps {
  professional: Professional;
  onViewProfile: (id: string) => void;
  onBook: (id: string) => void;
}

export function ProfessionalCard({ professional, onViewProfile, onBook }: ProfessionalCardProps) {
  const initials = professional.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
      {/* Match Score Badge */}
      {professional.matchScore && professional.matchScore > 80 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            {professional.matchScore}% Match
          </Badge>
        </div>
      )}

      <CardContent className="pt-6 pb-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={professional.avatar} alt={professional.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {professional.verified && (
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-50" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">
              {professional.name}
            </h3>
            <p className="text-sm text-muted-foreground">{professional.title}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{professional.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({professional.reviewsCount} reseñas)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{professional.location}</span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {professional.specialties.slice(0, 4).map((specialty) => (
            <Badge 
              key={specialty} 
              variant="secondary" 
              className="text-xs bg-secondary/50"
            >
              {specialty}
            </Badge>
          ))}
          {professional.specialties.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{professional.specialties.length - 4}
            </Badge>
          )}
        </div>

        {/* Approach */}
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {professional.approach}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{professional.sessionDuration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="h-3.5 w-3.5" />
            <span>Videoconsulta</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t flex items-center justify-between py-4">
        <div>
          <p className="text-xs text-muted-foreground">Desde</p>
          <p className="text-lg font-bold text-primary">
            {formatPrice(professional.price, professional.currency)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewProfile(professional.id)}
          >
            Ver perfil
          </Button>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            onClick={() => onBook(professional.id)}
          >
            Reservar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
