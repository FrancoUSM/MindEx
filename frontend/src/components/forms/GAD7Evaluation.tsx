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
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const gad7Schema = z.object({
  q1: z.number().min(0).max(3),
  q2: z.number().min(0).max(3),
  q3: z.number().min(0).max(3),
  q4: z.number().min(0).max(3),
  q5: z.number().min(0).max(3),
  q6: z.number().min(0).max(3),
  q7: z.number().min(0).max(3),
});

type GAD7FormData = z.infer<typeof gad7Schema>;

const questions = [
  "Sentirse nervioso(a), ansioso(a) o muy alterado(a)",
  "No ser capaz de parar o controlar las preocupaciones",
  "Preocuparse demasiado por diferentes cosas",
  "Dificultad para relajarse",
  "Estar tan inquieto(a) que es difícil permanecer sentado(a)",
  "Sentirse fácilmente molesto(a) o irritable",
  "Sentir miedo como si algo terrible fuera a suceder"
];

const options = [
  { value: 0, label: "Para nada" },
  { value: 1, label: "Varios días" },
  { value: 2, label: "Más de la mitad de los días" },
  { value: 3, label: "Casi todos los días" }
];

interface GAD7EvaluationProps {
  onComplete: (score: number, severity: string, showReport: boolean) => void;
  onBack: () => void;
}

export function GAD7Evaluation({ onComplete, onBack }: GAD7EvaluationProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GAD7FormData>({
    resolver: zodResolver(gad7Schema),
    defaultValues: {
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0
    },
  });

  const watchedValues = form.watch();
  const currentAnswer = watchedValues[`q${currentQuestion + 1}` as keyof GAD7FormData];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const calculateScore = (data: GAD7FormData) => {
    return Object.values(data).reduce((sum, value) => sum + value, 0);
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return "Mínima";
    if (score <= 9) return "Leve";
    if (score <= 14) return "Moderada";
    return "Severa";
  };

  const onSubmit = async (data: GAD7FormData) => {
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
              tipo: 'GAD-7',
              score,
              max_score: 21,
              severidad: severity,
            }),
          });
        } catch (err) {
          console.error('Error guardando GAD-7 en backend:', err);
        }
      }

      toast({
        title: "Evaluación GAD-7 completada",
        description: `Puntuación: ${score}/21 - ${severity}`,
        variant: "default",
      });

      onComplete(score, severity, true);
    } catch (error) {
      console.error('Error saving GAD-7:', error);
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
          <Heart className="h-5 w-5 text-primary" />
          <CardTitle>GAD-7 - Evaluación de Ansiedad</CardTitle>
        </div>
        <CardDescription>
          Durante las últimas 2 semanas, ¿qué tan seguido ha sido molestado por los siguientes problemas?
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
              name={`q${currentQuestion + 1}` as keyof GAD7FormData}
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
                            id={`gad7-option-${option.value}`}
                          />
                          <Label 
                            htmlFor={`gad7-option-${option.value}`}
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