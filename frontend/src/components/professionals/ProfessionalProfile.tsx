import { 
  Star, MapPin, Clock, Video, CheckCircle2, GraduationCap, 
  Award, Languages, Calendar, ArrowLeft, Heart, Share2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Professional, formatPrice } from "@/lib/professionals";
import { BookingModal } from "./BookingModal";
import { useState } from "react";

interface ProfessionalProfileProps {
  professional: Professional;
  onBack: () => void;
}

export function ProfessionalProfile({ professional, onBack }: ProfessionalProfileProps) {
  const [showBooking, setShowBooking] = useState(false);

  const initials = professional.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Perfil del Profesional</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage src={professional.avatar} alt={professional.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {professional.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg">
                      <CheckCircle2 className="h-7 w-7 text-green-500 fill-green-50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl font-bold">{professional.name}</h2>
                    {professional.verified && (
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">{professional.title}</p>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{professional.rating}</span>
                      <span className="text-muted-foreground">
                        ({professional.reviewsCount} reseñas)
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{professional.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-center sm:justify-start gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre mí</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{professional.bio}</p>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-sm py-1 px-3">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium mb-2">Enfoque terapéutico</p>
                <Badge variant="outline" className="text-sm">
                  {professional.approach}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Education & Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Formación y Certificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Educación</p>
                <ul className="space-y-1">
                  {professional.education.map((edu, idx) => (
                    <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certificaciones
                </p>
                <div className="flex flex-wrap gap-2">
                  {professional.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="sticky top-6 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Precio por sesión</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(professional.price, professional.currency)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{professional.sessionDuration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>Online</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                size="lg"
                onClick={() => setShowBooking(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reservar hora
              </Button>

              {professional.acceptsMindexa && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    ✓ Acepta MINDEXA
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trabajadores de empresas mineras
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {professional.availability.map((slot, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between text-sm py-2 border-b last:border-0"
                  >
                    <span className="font-medium">{dayNames[slot.dayOfWeek]}</span>
                    <span className="text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Idiomas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {professional.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{professional.experience}</p>
                <p className="text-sm text-muted-foreground">años de experiencia</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal 
          professional={professional} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </div>
  );
}
