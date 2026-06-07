import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Zap, Moon, Users, Heart, AlertCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckinResult } from "@/components/checkin/CheckinResult";
import { ProgressBar } from "@/components/checkin/ProgressBar";
import { RegistrationModal, RegistrationSession } from "@/components/checkin/RegistrationModal";
import { getResultLevel, evaluateFlags, applyFlags, UserProgress, POINTS_CONFIG } from "@/lib/gamification";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";

// IDSM-Plus MINDEXA - 8 ítems con escala 1-6
const idsmSchema = z.object({
  // 1. Claridad mental
  claridad_mental: z.number().min(1).max(6),
  // 2. Estrés (invertido)
  estres_dificultad: z.number().min(1).max(6),
  // 3. Energía (invertido)
  poca_energia: z.number().min(1).max(6),
  // 4. Somnolencia (invertido)
  somnolencia: z.number().min(1).max(6),
  // 5. Irritabilidad (invertido)
  irritabilidad: z.number().min(1).max(6),
  // 6. Sobrecarga mental (invertido)
  mente_sobrecargada: z.number().min(1).max(6),
  // 7. Regulación emocional
  manejo_emociones: z.number().min(1).max(6),
  // 8. Apoyo social
  apoyo_equipo: z.number().min(1).max(6),
});

type IDSMFormData = z.infer<typeof idsmSchema>;

// Ítems del IDSM con sus iconos y si son invertidos (mayor = peor)
const IDSM_ITEMS = [
  {
    id: 'claridad_mental',
    icon: Brain,
    emoji: '🧠',
    text: 'Hoy mi mente estuvo clara y pude concentrarme fácilmente.',
    reversed: false, // Mayor = mejor
  },
  {
    id: 'estres_dificultad',
    icon: AlertCircle,
    emoji: '🌀',
    text: 'Hoy el estrés me dificultó trabajar con normalidad.',
    reversed: true, // Mayor = peor
  },
  {
    id: 'poca_energia',
    icon: Zap,
    emoji: '⚡',
    text: 'Hoy me sentí con poca energía para realizar mis tareas.',
    reversed: true,
  },
  {
    id: 'somnolencia',
    icon: Moon,
    emoji: '😴',
    text: 'Hoy me sentí somnoliento/a o con sueño durante el trabajo.',
    reversed: true,
  },
  {
    id: 'irritabilidad',
    icon: AlertCircle,
    emoji: '😠',
    text: 'Hoy estuve más irritable o de mal humor que de costumbre.',
    reversed: true,
  },
  {
    id: 'mente_sobrecargada',
    icon: Brain,
    emoji: '📊',
    text: 'Hoy sentí mi mente sobrecargada o saturada.',
    reversed: true,
  },
  {
    id: 'manejo_emociones',
    icon: Heart,
    emoji: '💚',
    text: 'Hoy manejé bien mis emociones ante las dificultades.',
    reversed: false,
  },
  {
    id: 'apoyo_equipo',
    icon: Users,
    emoji: '🤝',
    text: 'Hoy me sentí apoyado/a por mi equipo o supervisión.',
    reversed: false,
  },
];

// Escala de respuesta 1-6
const RESPONSE_OPTIONS = [
  { value: 1, label: 'No es cierto en absoluto' },
  { value: 2, label: 'Casi no es cierto' },
  { value: 3, label: 'Algo no cierto' },
  { value: 4, label: 'Algo cierto' },
  { value: 5, label: 'Casi cierto' },
  { value: 6, label: 'Totalmente cierto' },
];

interface IDSMCheckinFormProps {
  onComplete?: (score: number, level: string) => void;
  existingCheckin?: any;
  userProgress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export function IDSMCheckinForm({ 
  onComplete, 
  existingCheckin,
  userProgress,
  onUpdateProgress 
}: IDSMCheckinFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<IDSMFormData | null>(null);
  const [resultData, setResultData] = useState<{
    score: number;
    maxScore: number;
    level: 'green' | 'yellow' | 'orange' | 'red';
  } | null>(null);
  
  const form = useForm<IDSMFormData>({
    resolver: zodResolver(idsmSchema),
    defaultValues: {
      claridad_mental: existingCheckin?.claridad_mental || 3,
      estres_dificultad: existingCheckin?.estres_dificultad || 3,
      poca_energia: existingCheckin?.poca_energia || 3,
      somnolencia: existingCheckin?.somnolencia || 3,
      irritabilidad: existingCheckin?.irritabilidad || 3,
      mente_sobrecargada: existingCheckin?.mente_sobrecargada || 3,
      manejo_emociones: existingCheckin?.manejo_emociones || 3,
      apoyo_equipo: existingCheckin?.apoyo_equipo || 3,
    },
  });

  const calculateScore = (data: IDSMFormData): number => {
    // Para ítems invertidos, el score se suma directamente (mayor = peor)
    // Para ítems normales, se invierte (7 - valor)
    let totalScore = 0;
    
    IDSM_ITEMS.forEach((item) => {
      const value = data[item.id as keyof IDSMFormData];
      if (item.reversed) {
        totalScore += value; // Mayor valor = peor estado
      } else {
        totalScore += (7 - value); // Invertir: menor valor = peor estado
      }
    });
    
    return totalScore;
  };

  const processCheckin = async (data: IDSMFormData, session: { id_usuario: number; nombre: string }) => {
    setIsSubmitting(true);
    setShowRegistration(false);

    try {
      const score = calculateScore(data);
      const maxScore = 48;
      const baseLevel = getResultLevel(score, maxScore);
      const flags = evaluateFlags(
        data.estres_dificultad,
        data.somnolencia,
        data.manejo_emociones
      );
      const level = applyFlags(baseLevel, flags);

      await authFetch(`${import.meta.env.VITE_API_URL}/api/checkin/idsm`, {
        method: 'POST',
        body: JSON.stringify({
          id_usuario: session.id_usuario,
          rhi_score: score,
          result_level: level,
          ...data,
        }),
      });

      const today = new Date().toISOString().slice(0, 10);
      const lastDate = userProgress.lastCheckinDate?.slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = lastDate === yesterday ? userProgress.streak + 1 : 1;

      const newProgress: UserProgress = {
        ...userProgress,
        points: userProgress.points + POINTS_CONFIG.DAILY_CHECKIN,
        streak: newStreak,
        totalCheckins: userProgress.totalCheckins + 1,
        lastCheckinDate: today,
      };

      if (newStreak === 3) newProgress.points += POINTS_CONFIG.STREAK_3_DAYS;
      else if (newStreak === 5) newProgress.points += POINTS_CONFIG.STREAK_5_DAYS;
      else if (newStreak === 7) newProgress.points += POINTS_CONFIG.STREAK_7_DAYS;

      onUpdateProgress(newProgress);
      setResultData({ score, maxScore, level });
      setShowResult(true);
      setPendingFormData(null);

      toast({
        title: "¡Check-in guardado!",
        description: `Hola ${session.nombre}, tu evaluación ha sido registrada.`,
      });
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

  const onSubmit = (data: IDSMFormData) => {
    const session = getSession();
    if (session) {
      processCheckin(data, session);
    } else {
      setPendingFormData(data);
      setShowRegistration(true);
    }
  };

  const handleRegistrationComplete = (session: RegistrationSession) => {
    if (!pendingFormData) return;
    processCheckin(pendingFormData, session);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    if (resultData) {
      onComplete?.(resultData.score, resultData.level);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto bg-white border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-800">IDSM-Plus MINDEXA</CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Registro diario de tu estado hoy — {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          </CardDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <ProgressBar userProgress={userProgress} />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Instruction */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-800">
              <strong>Instrucción:</strong> A continuación encontrarás afirmaciones sobre tu experiencia hoy en el trabajo. 
              Por favor, selecciona la opción que mejor represente tu vivencia durante esta jornada.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {IDSM_ITEMS.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={item.id as keyof IDSMFormData}
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <FormLabel className="text-sm font-medium flex items-start gap-2 text-slate-800">
                        <span className="text-lg">{item.emoji}</span>
                        <span>{index + 1}. {item.text}</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                        >
                          {RESPONSE_OPTIONS.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={option.value.toString()} 
                                id={`${item.id}-${option.value}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`${item.id}-${option.value}`}
                                className="flex-1 cursor-pointer rounded-md border-2 border-slate-200 bg-white p-2 text-xs text-center hover:bg-purple-50 hover:border-purple-300 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 peer-data-[state=checked]:text-purple-900 transition-colors"
                              >
                                <span className="block font-medium text-slate-700">{option.value}</span>
                                <span className="block text-slate-500 mt-0.5 leading-tight">
                                  {option.label}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                {isSubmitting ? "Guardando..." : "Completar registro"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Registration Modal */}
      <RegistrationModal
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onComplete={handleRegistrationComplete}
      />

      {/* Result Modal */}
      {showResult && resultData && (
        <CheckinResult
          score={resultData.score}
          maxScore={resultData.maxScore}
          resultLevel={resultData.level}
          userProgress={userProgress}
          onClose={handleCloseResult}
          onRequestSupport={() => {
            // Handle support request
            toast({
              title: "Solicitud enviada",
              description: "Un profesional se pondrá en contacto contigo.",
            });
          }}
        />
      )}
    </>
  );
}
