import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, Shield, AlertTriangle, Clock, CheckCircle, Lock, LogIn } from "lucide-react";
import { PHQ9Evaluation } from "@/components/forms/PHQ9Evaluation";
import { GAD7Evaluation } from "@/components/forms/GAD7Evaluation";
import { DASS21Evaluation } from "@/components/forms/DASS21Evaluation";
import { CEALSMEvaluation } from "@/components/forms/CEALSMEvaluation";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { EvaluationReport } from "@/components/evaluations/EvaluationReport";
import { getSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface EvaluationCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: string;
  lastCompleted?: string;
  nextDue?: string;
  status: 'completed' | 'pending' | 'overdue';
  score?: number;
  severity?: string;
  requiresPayment?: boolean;
}

const evaluations: EvaluationCard[] = [
  {
    id: 'phq9',
    title: 'PHQ-9 - Depresión',
    description: 'Cuestionario de salud del paciente para depresión (9 preguntas)',
    icon: Brain,
    duration: '5 min',
    status: 'pending',
    requiresPayment: true
  },
  {
    id: 'gad7',
    title: 'GAD-7 - Ansiedad',
    description: 'Escala de ansiedad generalizada (7 preguntas)',
    icon: Heart,
    duration: '3 min',
    status: 'pending',
    requiresPayment: true
  },
  {
    id: 'dass21',
    title: 'DASS-21 - Estado Emocional',
    description: 'Escala de depresión, ansiedad y estrés (21 preguntas)',
    icon: AlertTriangle,
    duration: '8 min',
    status: 'pending',
    requiresPayment: true
  },
  {
    id: 'ceal_sm',
    title: 'CEAL-SM - Evaluación Organizacional',
    description: 'Cuestionario de evaluación de ambiente laboral en salud mental',
    icon: Shield,
    duration: '15 min',
    status: 'pending',
    requiresPayment: true
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-accent text-accent-foreground';
    case 'pending':
      return 'bg-warning text-warning-foreground';
    case 'overdue':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'mínima':
    case 'leve':
      return 'text-accent';
    case 'moderada':
      return 'text-warning';
    case 'severa':
    case 'grave':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export default function EvaluationsPage() {
  const navigate = useNavigate();
  const session = getSession();
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<{
    evaluationType: 'PHQ-9' | 'GAD-7' | 'DASS-21' | 'CEAL-SM';
    evaluationTitle: string;
    score: number;
    maxScore: number;
    severity: string;
    date: Date;
  } | null>(null);
  const [completedEvals, setCompletedEvals] = useState<Record<string, { score: number; severity: string; date: string }>>({});

  useEffect(() => {
    if (!session) return;
    authFetch(`${import.meta.env.VITE_API_URL}/api/checkin/idsm/historial/${session.id_usuario}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        const completed: Record<string, { score: number; severity: string; date: string }> = {};
        const typeMap: Record<string, string> = { 'PHQ-9': 'phq9', 'GAD-7': 'gad7', 'DASS-21': 'dass21', 'CEAL-SM': 'ceal_sm' };
        data.forEach(rec => {
          const content = rec.contenido ?? '';
          const match = content.match(/^(PHQ-9|GAD-7|DASS-21|CEAL-SM)\s+score=(\d+)/);
          if (match) {
            const key = typeMap[match[1]];
            const sevMatch = content.match(/severidad=(\S+)/);
            if (key && !completed[key]) {
              completed[key] = { score: parseInt(match[2]), severity: sevMatch?.[1] ?? '', date: rec.fecha };
            }
          }
        });
        setCompletedEvals(completed);
      })
      .catch(() => {});
  }, []);

  // Calculate progress metrics
  const completedCount = Object.keys(completedEvals).length;
  const totalCount = evaluations.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const handleStartEvaluation = (evaluationId: string) => {
    const evaluation = evaluations.find(e => e.id === evaluationId);
    if (evaluation?.requiresPayment && !isPaid) {
      setShowPaymentModal(true);
      return;
    }
    setSelectedEvaluation(evaluationId);
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
  };

  const handleCompleteEvaluation = (score: number, severity: string, shouldShowReport: boolean) => {
    if (selectedEvaluation) {
      setCompletedEvals(prev => ({
        ...prev,
        [selectedEvaluation]: { score, severity, date: new Date().toISOString() },
      }));
    }

    if (shouldShowReport && selectedEvaluation) {
      const evaluation = evaluations.find(e => e.id === selectedEvaluation);
      if (evaluation) {
        const evalTypeMap: Record<string, 'PHQ-9' | 'GAD-7' | 'DASS-21' | 'CEAL-SM'> = {
          'phq9': 'PHQ-9',
          'gad7': 'GAD-7',
          'dass21': 'DASS-21',
          'ceal_sm': 'CEAL-SM'
        };
        const maxScoreMap: Record<string, number> = {
          'phq9': 27,
          'gad7': 21,
          'dass21': 63,
          'ceal_sm': 100
        };
        
        setReportData({
          evaluationType: evalTypeMap[selectedEvaluation],
          evaluationTitle: evaluation.title,
          score,
          maxScore: maxScoreMap[selectedEvaluation],
          severity,
          date: new Date()
        });
        setShowReport(true);
      }
    }
    setSelectedEvaluation(null);
  };

  const handleBackToList = () => {
    setSelectedEvaluation(null);
    setShowReport(false);
    setReportData(null);
  };

  // Show report after completing evaluation
  if (showReport && reportData) {
    return (
      <div className="container mx-auto py-6">
        <EvaluationReport
          evaluationType={reportData.evaluationType}
          evaluationTitle={reportData.evaluationTitle}
          score={reportData.score}
          maxScore={reportData.maxScore}
          severity={reportData.severity}
          date={reportData.date}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  // Show specific evaluation form
  if (selectedEvaluation) {
    switch (selectedEvaluation) {
      case 'phq9':
        return (
          <div className="container mx-auto py-6">
            <PHQ9Evaluation 
              onComplete={handleCompleteEvaluation}
              onBack={handleBackToList}
            />
          </div>
        );
      case 'gad7':
        return (
          <div className="container mx-auto py-6">
            <GAD7Evaluation 
              onComplete={handleCompleteEvaluation}
              onBack={handleBackToList}
            />
          </div>
        );
      case 'dass21':
        return (
          <div className="container mx-auto py-6">
            <DASS21Evaluation onComplete={handleCompleteEvaluation} onBack={handleBackToList} />
          </div>
        );
      case 'ceal_sm':
        return (
          <div className="container mx-auto py-6">
            <CEALSMEvaluation onComplete={handleCompleteEvaluation} onBack={handleBackToList} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        amount={5}
        productName="Pack Evaluaciones Clínicas"
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mis Evaluaciones</h1>
          <p className="text-muted-foreground">
            Mantén un seguimiento de tu salud mental a través de evaluaciones validadas científicamente
          </p>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Progreso de Evaluaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {completedCount} de {totalCount} evaluaciones completadas
                </span>
                <span className="text-sm font-medium">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {!session && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Inicia sesión para guardar tus evaluaciones y ver tu historial.</span>
          <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate("/auth")}>
            <LogIn className="h-3 w-3 mr-1" />
            Iniciar sesión
          </Button>
        </div>
      )}

      {/* Evaluations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {evaluations.map((evaluation) => {
          const completed = completedEvals[evaluation.id];
          const isCompleted = !!completed;
          return (
          <Card
            key={evaluation.id}
            className="relative hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    evaluation.requiresPayment && !isPaid
                      ? 'bg-muted'
                      : 'bg-primary/10'
                  }`}>
                    {evaluation.requiresPayment && !isPaid ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <evaluation.icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{evaluation.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {evaluation.requiresPayment && !isPaid ? (
                        <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                          <Lock className="h-3 w-3 mr-1" />
                          $5 USD
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={getStatusColor(isCompleted ? 'completed' : 'pending')}
                        >
                          {isCompleted ? 'Completada' : 'Disponible'}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {evaluation.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription>{evaluation.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {completed && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Último resultado:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold">{completed.score}</div>
                      <div className={`text-sm ${getSeverityColor(completed.severity)}`}>
                        {completed.severity}
                      </div>
                    </div>
                  </div>
                  {completed.date && (
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Última vez:</span>
                      <span>{new Date(completed.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => handleStartEvaluation(evaluation.id)}
                variant={evaluation.requiresPayment && !isPaid ? 'secondary' :
                        isCompleted ? 'outline' : 'default'}
                className="w-full"
              >
                {evaluation.requiresPayment && !isPaid ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Desbloquear por $5 USD
                  </>
                ) : isCompleted ?
                  'Repetir Evaluación' : 'Iniciar Evaluación'}
              </Button>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>¿Por qué estas evaluaciones son importantes?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">PHQ-9 (Depresión)</h4>
              <p className="text-muted-foreground">
                Detecta síntomas depresivos y su severidad. Es una herramienta estándar 
                utilizada mundialmente por profesionales de la salud mental.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">GAD-7 (Ansiedad)</h4>
              <p className="text-muted-foreground">
                Evalúa niveles de ansiedad generalizada. Ayuda a identificar cuando 
                los niveles de preocupación interfieren con el bienestar diario.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">DASS-21 (Estado Emocional)</h4>
              <p className="text-muted-foreground">
                Mide simultáneamente depresión, ansiedad y estrés. Proporciona una 
                visión integral del estado emocional actual.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">CEAL-SM (Ambiente Laboral)</h4>
              <p className="text-muted-foreground">
                Evalúa factores organizacionales que impactan la salud mental en el 
                trabajo, específicamente adaptado para el contexto minero.
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </>
  );
}