import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, AlertCircle, Moon, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const checkinSchema = z.object({
  // Energía y Motivación
  energia_turno: z.number().min(1).max(5),
  motivacion_trabajo: z.number().min(1).max(5),
  // Estrés y Carga Mental
  ritmo_sobrepaso: z.number().min(1).max(5),
  manejo_estres: z.number().min(1).max(5),
  // Sueño y Recuperación
  calidad_sueno: z.number().min(1).max(5),
  fatiga_trabajo: z.number().min(1).max(5),
  // Apoyo Social
  apoyo_companeros: z.number().min(1).max(5),
  aislamiento_equipo: z.number().min(1).max(5),
  // Seguridad y Control
  protocolos_seguridad: z.number().min(1).max(5),
  sensacion_peligro: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type CheckinFormData = z.infer<typeof checkinSchema>;

const scoreLabels = ["Nunca", "Casi nunca", "A veces", "Casi siempre", "Siempre"];

const getScoreColor = (score: number, reverse: boolean = false) => {
  if (reverse) {
    // Para preguntas invertidas (menor es mejor)
    if (score <= 2) return "text-accent";
    if (score <= 3) return "text-warning";
    return "text-destructive";
  } else {
    // Para preguntas directas (mayor es mejor)
    if (score <= 2) return "text-destructive";
    if (score <= 3) return "text-warning";
    return "text-accent";
  }
};

const getScoreLabel = (score: number) => {
  return scoreLabels[score - 1] || scoreLabels[0];
};

interface DailyCheckinFormProps {
  onComplete?: () => void;
  existingCheckin?: any;
}

export function DailyCheckinForm({ onComplete, existingCheckin }: DailyCheckinFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CheckinFormData>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      energia_turno: existingCheckin?.energia_turno || 3,
      motivacion_trabajo: existingCheckin?.motivacion_trabajo || 3,
      ritmo_sobrepaso: existingCheckin?.ritmo_sobrepaso || 3,
      manejo_estres: existingCheckin?.manejo_estres || 3,
      calidad_sueno: existingCheckin?.calidad_sueno || 3,
      fatiga_trabajo: existingCheckin?.fatiga_trabajo || 3,
      apoyo_companeros: existingCheckin?.apoyo_companeros || 3,
      aislamiento_equipo: existingCheckin?.aislamiento_equipo || 3,
      protocolos_seguridad: existingCheckin?.protocolos_seguridad || 3,
      sensacion_peligro: existingCheckin?.sensacion_peligro || 3,
      notes: existingCheckin?.notes || "",
    },
  });

  const onSubmit = async (data: CheckinFormData) => {
    setIsSubmitting(true);
    try {
      // Mock save - replace with real Supabase when connected
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Check-in guardado",
        description: "Tu estado de bienestar ha sido registrado exitosamente.",
        variant: "default",
      });

      onComplete?.();
    } catch (error) {
      console.error('Error saving checkin:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el check-in. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedValues = form.watch();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <CardTitle>Check-in Diario</CardTitle>
        </div>
        <CardDescription>
          Evalúa tu bienestar hoy - {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. Energía y Motivación */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Energía y Motivación
              </h3>
              
              <FormField
                control={form.control}
                name="energia_turno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Hoy tuve energía suficiente para mi turno
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivacion_trabajo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Me sentí motivado en mi trabajo
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 2. Estrés y Carga Mental */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Estrés y Carga Mental
              </h3>
              
              <FormField
                control={form.control}
                name="ritmo_sobrepaso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      El ritmo de trabajo me sobrepasó
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value, true)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manejo_estres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Pude manejar situaciones estresantes con calma
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 3. Sueño y Recuperación */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Sueño y Recuperación
              </h3>
              
              <FormField
                control={form.control}
                name="calidad_sueno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Dormí bien antes del turno
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatiga_trabajo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Me sentí fatigado durante el trabajo
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value, true)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Apoyo Social */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Apoyo Social
              </h3>
              
              <FormField
                control={form.control}
                name="apoyo_companeros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Mis compañeros me apoyaron
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aislamiento_equipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Me sentí aislado del equipo
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value, true)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 5. Seguridad y Control */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Seguridad y Control
              </h3>
              
              <FormField
                control={form.control}
                name="protocolos_seguridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Seguí los protocolos de seguridad sin problemas
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sensacion_peligro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Sentí que algo malo podía pasarme
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(field.value, true)}`}>
                        {field.value} - {getScoreLabel(field.value)}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="¿Hay algo específico que quieras compartir sobre tu día?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cualquier comentario adicional sobre tu bienestar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Guardando..." : existingCheckin ? "Actualizar Check-in" : "Guardar Check-in"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}