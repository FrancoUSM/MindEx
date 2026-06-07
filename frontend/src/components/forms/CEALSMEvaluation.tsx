import { useState } from "react";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  q1: z.number().min(1).max(5), q2: z.number().min(1).max(5), q3: z.number().min(1).max(5),
  q4: z.number().min(1).max(5), q5: z.number().min(1).max(5), q6: z.number().min(1).max(5),
  q7: z.number().min(1).max(5), q8: z.number().min(1).max(5), q9: z.number().min(1).max(5),
  q10: z.number().min(1).max(5), q11: z.number().min(1).max(5), q12: z.number().min(1).max(5),
  q13: z.number().min(1).max(5), q14: z.number().min(1).max(5), q15: z.number().min(1).max(5),
  q16: z.number().min(1).max(5), q17: z.number().min(1).max(5), q18: z.number().min(1).max(5),
  q19: z.number().min(1).max(5), q20: z.number().min(1).max(5),
});
type FormData = z.infer<typeof schema>;

// Dimensiones del CEAL-SM adaptado al contexto minero
const questions: { text: string; dim: string }[] = [
  // Demandas laborales (1-5)
  { text: "El ritmo de trabajo en mi faena me resulta excesivo", dim: "Demandas" },
  { text: "Debo trabajar muchas horas extras o bajo presión constante de tiempo", dim: "Demandas" },
  { text: "Mi trabajo requiere un esfuerzo físico y mental muy alto de forma simultánea", dim: "Demandas" },
  { text: "Las exigencias de mi trabajo afectan mi descanso y recuperación", dim: "Demandas" },
  { text: "Me cuesta desconectarme del trabajo cuando estoy fuera del turno", dim: "Demandas" },
  // Control y autonomía (6-9)
  { text: "Puedo tomar decisiones sobre cómo realizo mis tareas", dim: "Control" },
  { text: "Tengo la posibilidad de aprender y desarrollarme en mi trabajo", dim: "Control" },
  { text: "Puedo organizar mis tiempos de trabajo con cierta flexibilidad", dim: "Control" },
  { text: "Siento que mis opiniones y sugerencias son tomadas en cuenta", dim: "Control" },
  // Apoyo social (10-13)
  { text: "Mis compañeros de trabajo me apoyan cuando lo necesito", dim: "Apoyo" },
  { text: "Mi jefe o supervisor me trata con respeto y consideración", dim: "Apoyo" },
  { text: "Me siento parte de un equipo de trabajo unido", dim: "Apoyo" },
  { text: "Puedo hablar abiertamente con mi jefe sobre problemas del trabajo", dim: "Apoyo" },
  // Compensaciones (14-17)
  { text: "Mi sueldo es justo en relación con el esfuerzo que realizo", dim: "Compensaciones" },
  { text: "Mi trabajo es reconocido y valorado por mis superiores", dim: "Compensaciones" },
  { text: "Tengo estabilidad laboral y seguridad en mi empleo", dim: "Compensaciones" },
  { text: "Siento que hay posibilidades de ascenso o mejora en mi carrera", dim: "Compensaciones" },
  // Condiciones de seguridad (18-20)
  { text: "Las condiciones físicas de mi lugar de trabajo son seguras", dim: "Seguridad" },
  { text: "Cuento con los equipos y herramientas necesarios para trabajar de forma segura", dim: "Seguridad" },
  { text: "Me siento protegido(a) ante riesgos de accidente o enfermedad profesional", dim: "Seguridad" },
];

// Ítems que se deben invertir (mayor valor = menos riesgo en la dimensión de control/apoyo)
// Demandas: a mayor puntaje = mayor estrés; el resto: mayor puntaje = mejor
const INVERTED_ITEMS = [1, 2, 3, 4, 5]; // Demandas se invierten para el riesgo total

const options = [
  { value: 1, label: "Nunca" },
  { value: 2, label: "Pocas veces" },
  { value: 3, label: "Algunas veces" },
  { value: 4, label: "Frecuentemente" },
  { value: 5, label: "Siempre" },
];

const DIM_COLORS: Record<string, string> = {
  Demandas: "text-red-500",
  Control: "text-blue-500",
  Apoyo: "text-green-500",
  Compensaciones: "text-orange-500",
  Seguridad: "text-purple-500",
};

function getSeverity(riskScore: number): string {
  // riskScore en rango 0-100 (normalizado)
  if (riskScore <= 25) return "Bajo";
  if (riskScore <= 50) return "Moderado";
  if (riskScore <= 75) return "Alto";
  return "Muy alto";
}

interface Props {
  onComplete: (score: number, severity: string, showReport: boolean) => void;
  onBack: () => void;
}

export function CEALSMEvaluation({ onComplete, onBack }: Props) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [`q${i + 1}`, 3])
  ) as FormData;

  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues });
  const watchedValues = form.watch();
  const currentAnswer = watchedValues[`q${currentQuestion + 1}` as keyof FormData];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Calcular puntaje de riesgo: demandas altas + poco control/apoyo/compensación/seguridad
      let riskSum = 0;
      for (let i = 1; i <= 20; i++) {
        const val = data[`q${i}` as keyof FormData] as number;
        // Para demandas: valor alto = más riesgo; para el resto: valor bajo = más riesgo
        if (INVERTED_ITEMS.includes(i)) {
          riskSum += val; // 1-5, demandas altas → más riesgo
        } else {
          riskSum += (6 - val); // invertir: valor bajo de control/apoyo → más riesgo
        }
      }
      // riskSum: mín 20 (sin riesgo), máx 100 (máximo riesgo)
      const normalizedRisk = Math.round(((riskSum - 20) / 80) * 100);
      const severidad = getSeverity(normalizedRisk);
      const rawScore = Object.values(data).reduce((s, v) => s + (v as number), 0);

      const session = getSession();
      if (session) {
        try {
          await authFetch(`${import.meta.env.VITE_API_URL}/api/checkin/evaluacion`, {
            method: 'POST',
            body: JSON.stringify({
              id_usuario: session.id_usuario,
              tipo: 'CEAL-SM',
              score: normalizedRisk,
              max_score: 100,
              severidad,
            }),
          });
        } catch (err) {
          console.error('Error guardando CEAL-SM:', err);
        }
      }

      toast({
        title: "CEAL-SM completado",
        description: `Riesgo psicosocial laboral: ${severidad} (${normalizedRisk}/100)`,
      });

      onComplete(rawScore, severidad, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else form.handleSubmit(onSubmit)();
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const currentDim = questions[currentQuestion].dim;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>CEAL-SM - Evaluación Organizacional</CardTitle>
        </div>
        <CardDescription>
          Indica con qué frecuencia cada situación describe tu ambiente de trabajo actual.
        </CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span className={`font-medium ${DIM_COLORS[currentDim]}`}>{currentDim}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name={`q${currentQuestion + 1}` as keyof FormData}
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-medium">
                    {questions[currentQuestion].text}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value?.toString()}
                      className="grid grid-cols-1 gap-3"
                    >
                      {options.map((opt) => (
                        <div key={opt.value} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent">
                          <RadioGroupItem value={opt.value.toString()} id={`opt-${opt.value}`} />
                          <Label htmlFor={`opt-${opt.value}`} className="flex-1 cursor-pointer font-normal">
                            {opt.value} — {opt.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-4">
              <Button type="button" variant="outline" onClick={currentQuestion === 0 ? onBack : handlePrevious} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {currentQuestion === 0 ? "Volver" : "Anterior"}
              </Button>
              <Button type="button" onClick={handleNext} disabled={currentAnswer === undefined || isSubmitting} className="flex items-center gap-2">
                {currentQuestion === questions.length - 1 ? (isSubmitting ? "Guardando..." : "Finalizar") : "Siguiente"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
