import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Calendar, 
  UserRound, 
  AlertTriangle, 
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EvaluationReportProps {
  evaluationType: 'PHQ-9' | 'GAD-7' | 'DASS-21' | 'CEAL-SM';
  evaluationTitle: string;
  score: number;
  maxScore: number;
  severity: string;
  date: Date;
  onBack: () => void;
}

const getSeverityColor = (severity: string) => {
  const n = severity.toLowerCase();
  if (n.includes('normal') || n.includes('mínima') || n.includes('leve') || n.includes('bajo')) {
    return 'bg-accent text-accent-foreground';
  }
  if (n.includes('moderad')) {
    return 'bg-warning text-warning-foreground';
  }
  return 'bg-destructive text-destructive-foreground';
};

const getSeverityIcon = (severity: string) => {
  const n = severity.toLowerCase();
  if (n.includes('normal') || n.includes('mínima') || n.includes('leve') || n.includes('bajo')) {
    return <CheckCircle className="h-5 w-5" />;
  }
  if (n.includes('moderad')) {
    return <AlertCircle className="h-5 w-5" />;
  }
  return <AlertTriangle className="h-5 w-5" />;
};

const getRecommendations = (evaluationType: string, severity: string) => {
  const normalized = severity.toLowerCase();
  
  const baseRecommendations = {
    'PHQ-9': {
      mínima: [
        'Mantén hábitos saludables de sueño y alimentación',
        'Continúa con actividades que te generen bienestar',
        'Realiza check-ins regulares para monitorear tu estado'
      ],
      leve: [
        'Considera técnicas de relajación y mindfulness',
        'Mantén conexiones sociales activas',
        'Establece rutinas diarias estructuradas',
        'Considera hablar con un profesional si los síntomas persisten'
      ],
      moderada: [
        'Se recomienda consulta con un profesional de salud mental',
        'Evalúa opciones de terapia cognitivo-conductual',
        'Mantén seguimiento regular de síntomas',
        'Considera apoyo farmacológico si es indicado'
      ],
      severa: [
        'Consulta urgente con un profesional de salud mental',
        'Evaluación para tratamiento integral',
        'Considera apoyo inmediato de red de apoyo',
        'Seguimiento cercano y regular'
      ]
    },
    'GAD-7': {
      mínima: [
        'Practica técnicas de respiración diarias',
        'Mantén actividad física regular',
        'Establece límites saludables con el trabajo'
      ],
      leve: [
        'Incorpora ejercicios de relajación progresiva',
        'Reduce consumo de cafeína y estimulantes',
        'Practica mindfulness o meditación',
        'Considera hablar con un profesional si la ansiedad interfiere'
      ],
      moderada: [
        'Consulta con un profesional de salud mental',
        'Evaluación para terapia especializada en ansiedad',
        'Técnicas de manejo del estrés estructuradas',
        'Posible evaluación farmacológica'
      ],
      severa: [
        'Consulta urgente con especialista',
        'Tratamiento integral recomendado',
        'Evaluación de factores de riesgo',
        'Apoyo inmediato necesario'
      ]
    }
  };

  const dass21Recs = {
    normal: ['Tu estado emocional está dentro del rango normal', 'Mantén hábitos de autocuidado y descanso', 'Realiza evaluaciones periódicas para hacer seguimiento'],
    leve: ['Incorpora técnicas de manejo del estrés en tu rutina', 'Habla con personas de confianza sobre lo que sientes', 'Considera orientación profesional si los síntomas persisten'],
    moderada: ['Se recomienda consulta con un psicólogo o psiquiatra', 'Evita el aislamiento social y mantén rutinas', 'Considera terapia cognitivo-conductual o similar'],
    severa: ['Consulta urgente con un profesional de salud mental', 'Informa a tu médico o profesional tratante', 'Busca apoyo inmediato de tu red cercana'],
  };
  const cealsmRecs = {
    bajo: ['Tu ambiente laboral presenta bajo riesgo psicosocial', 'Mantén canales de comunicación abiertos con tu equipo', 'Sigue promoviendo buenas prácticas de convivencia'],
    moderado: ['Identifica factores de estrés laboral específicos', 'Conversa con tu supervisor sobre cargas de trabajo', 'Participa en instancias de bienestar que ofrezca la empresa'],
    alto: ['Reporta situaciones de riesgo a tu encargado de SSO', 'Solicita apoyo del área de recursos humanos o bienestar', 'Considera hablar con un profesional de salud mental ocupacional'],
    muyAlto: ['Se recomienda intervención organizacional urgente', 'Comunica la situación a RRHH y SSO inmediatamente', 'Busca apoyo profesional de salud mental sin demora'],
  };

  if (evaluationType === 'DASS-21') {
    if (normalized.includes('normal')) return dass21Recs.normal;
    if (normalized.includes('leve')) return dass21Recs.leve;
    if (normalized.includes('moderad')) return dass21Recs.moderada;
    return dass21Recs.severa;
  }
  if (evaluationType === 'CEAL-SM') {
    if (normalized.includes('bajo')) return cealsmRecs.bajo;
    if (normalized.includes('moderado')) return cealsmRecs.moderado;
    if (normalized.includes('muy alto')) return cealsmRecs.muyAlto;
    return cealsmRecs.alto;
  }

  const evalRecs = baseRecommendations[evaluationType as keyof typeof baseRecommendations] || baseRecommendations['PHQ-9'];
  if (normalized.includes('mínima')) return evalRecs.mínima;
  if (normalized.includes('leve')) return evalRecs.leve;
  if (normalized.includes('moderada')) return evalRecs.moderada;
  return evalRecs.severa;
};

export function EvaluationReport({
  evaluationType,
  evaluationTitle,
  score,
  maxScore,
  severity,
  date,
  onBack
}: EvaluationReportProps) {
  const navigate = useNavigate();
  const recommendations = getRecommendations(evaluationType, severity);
  const percentage = Math.round((score / maxScore) * 100);

  const handleDownloadReport = () => {
    // Generate PDF report content
    const reportContent = `
INFORME DE EVALUACIÓN CLÍNICA
================================

MINDEXA - Plataforma de Salud Mental

Tipo de Evaluación: ${evaluationType}
Nombre: ${evaluationTitle}
Fecha: ${date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

RESULTADOS
----------
Puntuación: ${score}/${maxScore} (${percentage}%)
Nivel de Severidad: ${severity}

INTERPRETACIÓN
--------------
${evaluationType === 'PHQ-9' ? 
  'El PHQ-9 es una herramienta validada para detectar y medir la severidad de síntomas depresivos.' :
  'El GAD-7 es una herramienta validada para detectar y medir la severidad de síntomas de ansiedad generalizada.'}

Rangos de puntuación:
- 0-4: Mínima
- 5-9: Leve
- 10-14: Moderada
- 15+: Severa

RECOMENDACIONES
---------------
${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

IMPORTANTE
----------
Este informe es orientativo y no reemplaza una evaluación profesional completa.
Si experimentas síntomas severos o pensamientos de autolesión, busca ayuda profesional inmediata.

Línea de crisis Chile: 600 360 7777

---
Generado por MINDEXA
www.mindexa.cl
    `.trim();

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Informe_${evaluationType}_${date.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleContactProfessional = () => {
    navigate('/professionals');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Informe de Resultados</h1>
          <p className="text-muted-foreground">{evaluationTitle}</p>
        </div>
      </div>

      {/* Score Card */}
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <CardDescription>Tu puntuación</CardDescription>
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl font-bold text-primary">{score}</div>
            <div className="text-2xl text-muted-foreground">/ {maxScore}</div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <Badge className={`text-lg px-4 py-2 ${getSeverityColor(severity)}`}>
            {getSeverityIcon(severity)}
            <span className="ml-2">{severity}</span>
          </Badge>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {date.toLocaleDateString('es-CL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recomendaciones Personalizadas</CardTitle>
          <CardDescription>
            Basadas en tu puntuación de {severity.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                </div>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadReport}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Informe
            </Button>
            <Button 
              onClick={handleContactProfessional}
              className="flex-1"
            >
              <UserRound className="h-4 w-4 mr-2" />
              Hablar con un Profesional
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Nuestros profesionales están disponibles para ayudarte a interpretar 
            estos resultados y definir un plan de acción personalizado.
          </p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground px-4">
        Este informe es orientativo y no reemplaza una evaluación profesional completa. 
        Si experimentas síntomas severos, busca ayuda profesional inmediata.
      </p>
    </div>
  );
}
