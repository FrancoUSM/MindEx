import { useState } from "react";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const phq9Schema = z.object({
  q1: z.number().min(0).max(3),
  q2: z.number().min(0).max(3),
  q3: z.number().min(0).max(3),
  q4: z.number().min(0).max(3),
  q5: z.number().min(0).max(3),
  q6: z.number().min(0).max(3),
  q7: z.number().min(0).max(3),
  q8: z.number().min(0).max(3),
  q9: z.number().min(0).max(3),
});

type PHQ9FormData = z.infer<typeof phq9Schema>;

const questions = [
  "Poco interés o placer en hacer cosas",
  "Sentirse desanimado(a), deprimido(a), o sin esperanzas",
  "Dificultad para quedarse o permanecer dormido(a), o dormir demasiado",
  "Sentirse cansado(a) o con poca energía",
  "Poco apetito o comer en exceso",
  "Sentirse mal con usted mismo(a) - o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia",
  "Dificultad para concentrarse en cosas, tales como leer el periódico o ver la televisión",
  "¿Moverse o hablar tan lento que otras personas podrían notarlo? O tan inquieto(a) o agitado(a) que ha estado moviéndose mucho más de lo normal",
  "Pensamientos de que estaría mejor muerto(a) o de lastimarse de alguna manera"
];

const options = [
  { value: 0, label: "Para nada" },
  { value: 1, label: "Varios días" },
  { value: 2, label: "Más de la mitad de los días" },
  { value: 3, label: "Casi todos los días" }
];

interface PHQ9EvaluationProps {
  onComplete: (score: number, severity: string, showReport: boolean) => void;
  onBack: () => void;
}

export function PHQ9Evaluation({ onComplete, onBack }: PHQ9EvaluationProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PHQ9FormData>({
    resolver: zodResolver(phq9Schema),
    defaultValues: {
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0,
      q6: 0, q7: 0, q8: 0, q9: 0
    },
  });

  const watchedValues = form.watch();
  const currentAnswer = watchedValues[`q${currentQuestion + 1}` as keyof PHQ9FormData];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const calculateScore = (data: PHQ9FormData) => {
    return Object.values(data).reduce((sum, value) => sum + value, 0);
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return "Mínima";
    if (score <= 9) return "Leve";
    if (score <= 14) return "Moderada";
    if (score <= 19) return "Moderadamente severa";
    return "Severa";
  };

  const onSubmit = async (data: PHQ9FormData) => {
    setIsSubmitting(true);
    try {
      const score = calculateScore(data);
      const severity = getSeverity(score);
      
      const session = getSession();
      if (session) {
        try {
          await authFetch(`${import.meta.env.VITE_API_URL}/api/checkin/evaluacion`, {
            method: 'POST',
            body: JSON.stringify({
              id_usuario: session.id_usuario,
              tipo: 'PHQ-9',
              score,
              max_score: 27,
              severidad: severity,
            }),
          });
        } catch (err) {
          console.error('Error guardando PHQ-9 en backend:', err);
        }
      }

      toast({
        title: "Evaluación PHQ-9 completada",
        description: `Puntuación: ${score}/27 - ${severity}`,
        variant: "default",
      });

      onComplete(score, severity, true);
    } catch (error) {
      console.error('Error saving PHQ-9:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la evaluación. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const canGoNext = currentAnswer !== undefined;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>PHQ-9 - Evaluación de Depresión</CardTitle>
        </div>
        <CardDescription>
          Durante las últimas 2 semanas, ¿qué tan seguido ha tenido molestias debido a los siguientes problemas?
        </CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name={`q${currentQuestion + 1}` as keyof PHQ9FormData}
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-medium">
                    {questions[currentQuestion]}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      className="grid grid-cols-1 gap-3"
                    >
                      {options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent">
                          <RadioGroupItem 
                            value={option.value.toString()} 
                            id={`option-${option.value}`}
                          />
                          <Label 
                            htmlFor={`option-${option.value}`}
                            className="flex-1 cursor-pointer font-normal"
                          >
                            {option.label}
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
              <Button 
                type="button"
                variant="outline" 
                onClick={currentQuestion === 0 ? onBack : handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {currentQuestion === 0 ? "Volver" : "Anterior"}
              </Button>

              <Button 
                type="button"
                onClick={handleNext}
                disabled={!canGoNext || isSubmitting}
                className="flex items-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? 
                  (isSubmitting ? "Guardando..." : "Finalizar") :
                  "Siguiente"
                }
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}