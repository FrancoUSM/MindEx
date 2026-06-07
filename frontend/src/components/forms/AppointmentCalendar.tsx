import { useState, useEffect } from "react";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, User, AlertTriangle, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { fetchProfesionales } from "@/lib/professionals";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  professional: string;
  type: string;
  status: string;
  reason?: string;
}

interface BackendCita {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  tipo: string;
  estado: string;
  profesional_nombre?: string;
  profesional_apellido?: string;
}

interface ProfOption {
  id: number;
  name: string;
  speciality: string;
}

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'];

export default function AppointmentCalendar({ onClose }: { onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [selectedProf, setSelectedProf] = useState<string>('');
  const [reason, setReason] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<ProfOption[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = startOfDay(new Date());

  useEffect(() => {
    fetchProfesionales().then(list =>
      setProfessionals(list.map(p => ({
        id: p.backendId ?? 0,
        name: p.name,
        speciality: p.title,
      })))
    );

    const session = getSession();
    if (!session) return;
    authFetch(`${import.meta.env.VITE_API_URL}/api/agendamiento/mis-citas/${session.id_usuario}`)
      .then(r => r.json())
      .then((data: BackendCita[]) => {
        setAppointments(data.map(c => ({
          id: String(c.id),
          date: new Date(c.fecha),
          time: c.hora ?? '',
          professional: c.profesional_nombre
            ? `${c.profesional_nombre} ${c.profesional_apellido ?? ''}`.trim()
            : 'Profesional asignado',
          type: c.tipo ?? 'follow-up',
          status: c.estado === 'ACTIVO' ? 'scheduled' : 'cancelled',
          reason: c.motivo,
        })));
      })
      .catch(() => {});
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-destructive text-destructive-foreground';
      case 'evaluation':
        return 'bg-warning text-warning-foreground';
      case 'follow-up':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-accent';
      case 'scheduled':
        return 'text-warning';
      case 'completed':
        return 'text-muted-foreground';
      case 'cancelled':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isBefore(date, today)) {
      setSelectedDate(date);
      setShowBookingForm(true);
      setSelectedTime('');
      setAppointmentType('');
      setReason('');
    }
  };

  const handleBookAppointment = async () => {
    const session = getSession();
    if (!selectedDate || !selectedTime || !appointmentType || !reason.trim() || !selectedProf) {
      toast({ title: "Campos requeridos", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }
    if (!session) {
      toast({ title: "Sesión requerida", description: "Debes iniciar sesión para agendar", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const profId = parseInt(selectedProf);
      const profObj = professionals.find(p => p.id === profId);
      const fechaStr = format(selectedDate, 'yyyy-MM-dd');

      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agendamiento/solicitar`, {
        method: 'POST',
        body: JSON.stringify({
          id_usuario: session.id_usuario,
          id_profesional: profId,
          fecha: fechaStr,
          hora: selectedTime,
          motivo: reason,
          tipo: appointmentType,
        }),
      });

      if (!res.ok) throw new Error('Error al agendar');

      const newCita = await res.json();
      setAppointments(prev => [...prev, {
        id: String(newCita.id),
        date: selectedDate,
        time: selectedTime,
        professional: profObj?.name ?? 'Profesional asignado',
        type: appointmentType,
        status: 'scheduled',
        reason,
      }]);

      toast({
        title: "Cita agendada exitosamente",
        description: `Cita programada para el ${format(selectedDate, 'PPPP', { locale: es })} a las ${selectedTime}`,
      });

      setShowBookingForm(false);
      setSelectedDate(undefined);
      setSelectedTime('');
      setAppointmentType('');
      setSelectedProf('');
      setReason('');
    } catch {
      toast({ title: "Error", description: "No se pudo agendar la cita. Intenta nuevamente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/api/agendamiento/cancelar/${appointmentId}`, { method: 'DELETE' });
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'cancelled' } : a));
      toast({ title: "Cita cancelada", description: "Tu cita ha sido cancelada exitosamente" });
    } catch {
      toast({ title: "Error", description: "No se pudo cancelar la cita", variant: "destructive" });
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Calendario de Citas con Profesionales
          </DialogTitle>
          <DialogDescription>
            Agenda una cita con nuestros profesionales de salud mental o gestiona tus citas existentes
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selecciona una fecha</CardTitle>
                <CardDescription>
                  Elige el día que prefieras para tu cita
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => isBefore(date, today)}
                  locale={es}
                  className={cn("rounded-md border pointer-events-auto")}
                  modifiers={{
                    hasAppointment: (date) => getAppointmentsForDate(date).length > 0
                  }}
                  modifiersStyles={{
                    hasAppointment: { 
                      backgroundColor: 'hsl(var(--primary))', 
                      color: 'hsl(var(--primary-foreground))',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Booking Form */}
            {showBookingForm && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Agendar cita para {format(selectedDate, 'PPPP', { locale: es })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profesional</Label>
                    <Select value={selectedProf} onValueChange={setSelectedProf}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un profesional" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map(p => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {p.name} — {p.speciality}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Horario</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map(t => (
                          <SelectItem key={t} value={t}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {t}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de consulta</Label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evaluation">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Evaluación Psicológica
                          </div>
                        </SelectItem>
                        <SelectItem value="follow-up">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-accent" />
                            Consulta de Seguimiento
                          </div>
                        </SelectItem>
                        <SelectItem value="emergency">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Consulta Urgente
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo de la consulta</Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe brevemente el motivo de tu consulta..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleBookAppointment} disabled={isSubmitting} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Agendando...' : 'Agendar Cita'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBookingForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Appointments Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tus Próximas Citas</CardTitle>
                <CardDescription>
                  Gestiona y revisa tus citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tienes citas programadas</p>
                    <p className="text-sm">Selecciona una fecha para agendar tu primera cita</p>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getTypeColor(appointment.type)}>
                            {appointment.type === 'emergency' ? 'Urgente' :
                             appointment.type === 'evaluation' ? 'Evaluación' : 'Seguimiento'}
                          </Badge>
                          <span className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'confirmed' ? 'Confirmada' :
                             appointment.status === 'scheduled' ? 'Programada' :
                             appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                          </span>
                        </div>
                        {appointment.status === 'scheduled' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'PPPP', { locale: es })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.professional}</span>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Motivo:</strong> {appointment.reason}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Importante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Las citas pueden agendarse con un mínimo de 24 horas de anticipación</p>
                <p>• Para cancelar una cita, hazlo con al menos 2 horas de anticipación</p>
                <p>• En caso de emergencia, contacta directamente al número de urgencias</p>
                <p>• Todas las consultas son confidenciales y privadas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}