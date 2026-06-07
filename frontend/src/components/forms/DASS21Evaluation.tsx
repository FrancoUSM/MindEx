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
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  q1: z.number().min(0).max(3), q2: z.number().min(0).max(3), q3: z.number().min(0).max(3),
  q4: z.number().min(0).max(3), q5: z.number().min(0).max(3), q6: z.number().min(0).max(3),
  q7: z.number().min(0).max(3), q8: z.number().min(0).max(3), q9: z.number().min(0).max(3),
  q10: z.number().min(0).max(3), q11: z.number().min(0).max(3), q12: z.number().min(0).max(3),
  q13: z.number().min(0).max(3), q14: z.number().min(0).max(3), q15: z.number().min(0).max(3),
  q16: z.number().min(0).max(3), q17: z.number().min(0).max(3), q18: z.number().min(0).max(3),
  q19: z.number().min(0).max(3), q20: z.number().min(0).max(3), q21: z.number().min(0).max(3),
});
type FormData = z.infer<typeof schema>;

// S=Estrés D=Depresión A=Ansiedad
const questions = [
  { text: "Me resultó difícil calmarme", sub: "S" },
  { text: "Noté que tenía la boca seca", sub: "A" },
  { text: "No pude sentir ningún sentimiento positivo", sub: "D" },
  { text: "Tuve dificultad para respirar (sensación de ahogo sin esfuerzo físico)", sub: "A" },
  { text: "Me resultó difícil ponerme en marcha para hacer cosas", sub: "D" },
  { text: "Tuve tendencia a reaccionar exageradamente ante las situaciones", sub: "S" },
  { text: "Sentí temblores (ej. en las manos)", sub: "A" },
  { text: "Sentí que estaba gastando mucha energía nerviosa", sub: "S" },
  { text: "Me preocupé por situaciones en que podría entrar en pánico", sub: "A" },
  { text: "Sentí que no tenía nada que esperar del futuro", sub: "D" },
  { text: "Me sentí agitado(a)", sub: "S" },
  { text: "Me resultó difícil relajarme", sub: "S" },
  { text: "Me sentí triste y deprimido(a)", sub: "D" },
  { text: "Fui intolerante cuando algo me impedía continuar lo que hacía", sub: "S" },
  { text: "Sentí que estaba al borde del pánico", sub: "A" },
  { text: "No me pude entusiasmar por nada", sub: "D" },
  { text: "Sentí que no valía mucho como persona", sub: "D" },
  { text: "Sentí que estaba muy irritable", sub: "S" },
  { text: "Noté el latido de mi corazón sin hacer esfuerzo físico", sub: "A" },
  { text: "Me sentí asustado(a) sin razón válida", sub: "A" },
  { text: "Sentí que la vida no tenía ningún sentido", sub: "D" },
];

const options = [
  { value: 0, label: "No me aplicó" },
  { value: 1, label: "Me aplicó un poco" },
  { value: 2, label: "Me aplicó bastante" },
  { value: 3, label: "Me aplicó mucho" },
];

// Índices base-1 por subescala
const DEPRESSION_ITEMS = [3, 5, 10, 13, 16, 17, 21];
const ANXIETY_ITEMS = [2, 4, 7, 9, 15, 19, 20];
const STRESS_ITEMS = [1, 6, 8, 11, 12, 14, 18];

function calcSubscale(data: FormData, items: number[]) {
  return items.reduce((sum, i) => sum + (data[`q${i}` as keyof FormData] as number), 0) * 2;
}

function severityDepression(s: number) {
  if (s <= 9) return "Normal";
  if (s <= 13) return "Leve";
  if (s <= 20) return "Moderada";
  if (s <= 27) return "Severa";
  return "Muy severa";
}
function severityAnxiety(s: number) {
  if (s <= 7) return "Normal";
  if (s <= 9) return "Leve";
  if (s <= 14) return "Moderada";
  if (s <= 19) return "Severa";
  return "Muy severa";
}
function severityStress(s: number) {
  if (s <= 14) return "Normal";
  if (s <= 18) return "Leve";
  if (s <= 25) return "Moderada";
  if (s <= 33) return "Severa";
  return "Muy severa";
}

function worstSeverity(d: string, a: string, s: string): string {
  const rank = ["Normal", "Leve", "Moderada", "Severa", "Muy severa"];
  return [d, a, s].reduce((worst, cur) =>
    rank.indexOf(cur) > rank.indexOf(worst) ? cur : worst
  );
}

interface Props {
  onComplete: (score: number, severity: string, showReport: boolean) => void;
  onBack: () => void;
}

export function DASS21Evaluation({ onComplete, onBack }: Props) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = Object.fromEntries(
    Array.from({ length: 21 }, (_, i) => [`q${i + 1}`, 0])
  ) as FormData;

  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues });
  const watchedValues = form.watch();
  const currentAnswer = watchedValues[`q${currentQuestion + 1}` as keyof FormData];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const dScore = calcSubscale(data, DEPRESSION_ITEMS);
      const aScore = calcSubscale(data, ANXIETY_ITEMS);
      const sScore = calcSubscale(data, STRESS_ITEMS);
      const totalRaw = Object.values(data).reduce((s, v) => s + (v as number), 0);
      const dSev = severityDepression(dScore);
      const aSev = severityAnxiety(aScore);
      const sSev = severityStress(sScore);
      const severidad = worstSeverity(dSev, aSev, sSev);

      const session = getSession();
      if (session) {
        try {
          await authFetch(`${import.meta.env.VITE_API_URL}/api/checkin/evaluacion`, {
            method: 'POST',
            body: JSON.stringify({
              id_usuario: session.id_usuario,
              tipo: 'DASS-21',
              score: totalRaw,
              max_score: 63,
              severidad,
            }),
          });
        } catch (err) {
          console.error('Error guardando DASS-21:', err);
        }
      }

      toast({
        title: "DASS-21 completado",
        description: `Depresión: ${dSev} | Ansiedad: ${aSev} | Estrés: ${sSev}`,
      });

      onComplete(totalRaw, severidad, true);
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

  const subLabel: Record<string, string> = { D: "Depresión", A: "Ansiedad", S: "Estrés" };
  const subColor: Record<string, string> = {
    D: "text-blue-600", A: "text-orange-500", S: "text-red-500"
  };
  const currentSub = questions[currentQuestion].sub;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle>DASS-21 - Estado Emocional</CardTitle>
        </div>
        <CardDescription>
          ¿Con qué frecuencia cada afirmación se aplicó a usted durante la semana pasada?
        </CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span className={`font-medium ${subColor[currentSub]}`}>
              {subLabel[currentSub]}
            </span>
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
