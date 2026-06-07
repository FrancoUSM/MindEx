import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Video, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Professional, formatPrice } from "@/lib/professionals";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";

interface BookingModalProps {
  professional: Professional;
  onClose: () => void;
}

export function BookingModal({ professional, onClose }: BookingModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'date' | 'time' | 'confirm' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  // Generate available times based on professional's availability
  const getAvailableTimes = (date: Date) => {
    const dayOfWeek = date.getDay();
    const availability = professional.availability.find(a => a.dayOfWeek === dayOfWeek);
    
    if (!availability) return [];
    
    const times: string[] = [];
    const [startHour] = availability.startTime.split(':').map(Number);
    const [endHour] = availability.endTime.split(':').map(Number);
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour + 1 < endHour) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Simulate some taken slots
    const takenSlots = ['10:00', '11:30', '15:00'];
    return times.filter(t => !takenSlots.includes(t));
  };

  // Check if a date has availability
  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return professional.availability.some(a => a.dayOfWeek === dayOfWeek);
  };

  const handleConfirm = async () => {
    const session = getSession();
    if (!session) {
      toast({ title: "Error", description: "Debes iniciar sesión para reservar.", variant: "destructive" });
      return;
    }
    if (!selectedDate || !selectedTime) return;

    const profesionalId = professional.backendId ?? parseInt(professional.id);
    if (!profesionalId || isNaN(profesionalId)) {
      toast({ title: "Error", description: "No se pudo identificar al profesional.", variant: "destructive" });
      return;
    }

    setLoadingConfirm(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/agendamiento/solicitar`, {
        method: "POST",
        body: JSON.stringify({
          id_usuario: session.id_usuario,
          id_profesional: profesionalId,
          fecha: format(selectedDate, "yyyy-MM-dd"),
          hora: selectedTime,
          motivo: reason || "Sin especificar",
          tipo: "Videoconsulta",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error al agendar" }));
        throw new Error(err.error ?? "Error al agendar la cita");
      }
      toast({ title: "¡Reserva confirmada! ✓", description: `Tu cita con ${professional.name} ha sido agendada.` });
      setStep('success');
    } catch (e: any) {
      toast({ title: "Error al reservar", description: e.message, variant: "destructive" });
    } finally {
      setLoadingConfirm(false);
    }
  };

  const availableTimes = selectedDate ? getAvailableTimes(selectedDate) : [];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'success' ? '¡Reserva Confirmada!' : 'Reservar hora'}
          </DialogTitle>
          <DialogDescription>
            {step !== 'success' && `Agenda tu sesión con ${professional.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* Step: Date Selection */}
        {step === 'date' && (
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                if (date) setStep('time');
              }}
              disabled={(date) => 
                date < new Date() || 
                date > addDays(new Date(), 30) ||
                !isDateAvailable(date)
              }
              locale={es}
              className="rounded-md border mx-auto"
            />
            <p className="text-sm text-muted-foreground text-center">
              Selecciona una fecha disponible
            </p>
          </div>
        )}

        {/* Step: Time Selection */}
        {step === 'time' && selectedDate && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setStep('date')}>
                ← Cambiar fecha
              </Button>
              <Badge variant="secondary">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedTime(time);
                      setStep('confirm');
                    }}
                    className={selectedTime === time ? "bg-primary" : ""}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </Button>
                ))
              ) : (
                <p className="col-span-3 text-center text-muted-foreground py-8">
                  No hay horarios disponibles para esta fecha
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step: Confirmation */}
        {step === 'confirm' && selectedDate && (
          <div className="space-y-4">
            <Card className="p-4 bg-muted/30">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profesional</span>
                  <span className="font-medium">{professional.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fecha</span>
                  <span className="font-medium">
                    {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hora</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duración</span>
                  <span className="font-medium">{professional.sessionDuration} minutos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <Badge variant="secondary">
                    <Video className="h-3 w-3 mr-1" />
                    Videoconsulta
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(professional.price, professional.currency)}
                  </span>
                </div>
              </div>
            </Card>

            <div>
              <Label>Motivo de consulta (opcional)</Label>
              <Textarea
                placeholder="Cuéntanos brevemente qué te gustaría trabajar..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep('time')}
              >
                Atrás
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                onClick={handleConfirm}
                disabled={loadingConfirm}
              >
                {loadingConfirm ? "Agendando..." : "Confirmar reserva"}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && selectedDate && (
          <div className="text-center space-y-4 py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">¡Tu cita está confirmada!</h3>
              <p className="text-muted-foreground">
                Recibirás un correo con los detalles y el enlace para la videoconsulta.
              </p>
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20 text-left">
              <div className="space-y-2 text-sm">
                <p><strong>Profesional:</strong> {professional.name}</p>
                <p><strong>Fecha:</strong> {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
              </div>
            </Card>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cerrar
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  // Add to calendar logic would go here
                  toast({
                    title: "Agregado al calendario",
                    description: "El evento ha sido agregado a tu calendario.",
                  });
                }}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Agregar al calendario
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
