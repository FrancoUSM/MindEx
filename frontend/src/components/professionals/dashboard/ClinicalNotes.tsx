import { useState } from "react";
import { 
  FileText, Sparkles, Mic, MicOff, Play, Pause, 
  Save, Copy, CheckCircle, Clock, User, Wand2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Appointment, MOCK_APPOINTMENTS } from "@/lib/professionals";

interface ClinicalNotesProps {
  professionalId: string;
}

export function ClinicalNotes({ professionalId }: ClinicalNotesProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    MOCK_APPOINTMENTS.find(a => a.professionalId === professionalId) || null
  );
  
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [aiSummary, setAiSummary] = useState('');

  const appointments = MOCK_APPOINTMENTS.filter(a => a.professionalId === professionalId);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Grabación iniciada 🎙️",
      description: "La sesión está siendo grabada para transcripción",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(true);

    // Simulate transcription
    setTimeout(() => {
      setIsTranscribing(false);
      setTranscript(`[Transcripción automática de la sesión]

Terapeuta: Buenos días Juan, ¿cómo te has sentido esta semana?

Paciente: Hola doctora. La verdad es que ha sido una semana difícil. El cambio de turno me está afectando más de lo que pensé.

Terapeuta: Cuéntame más sobre eso. ¿Qué has notado específicamente?

Paciente: Principalmente el sueño. Me cuesta mucho dormir durante el día, y cuando llego al turno nocturno me siento agotado. Ayer casi tuve un incidente en la mina porque no estaba concentrado.

Terapeuta: Eso suena preocupante. ¿Has podido aplicar las técnicas de higiene del sueño que practicamos?

Paciente: He intentado, pero es difícil mantener la habitación oscura con los niños en casa durante el día...

[Continúa transcripción...]`);

      toast({
        title: "Transcripción completada ✓",
        description: "La grabación ha sido transcrita automáticamente",
      });
    }, 2000);
  };

  const handleGenerateSummary = () => {
    toast({
      title: "Generando resumen IA...",
      description: "Analizando la transcripción",
    });

    setTimeout(() => {
      setAiSummary(`## Resumen de Sesión - IA Copilot

**Paciente:** Juan Pérez M.
**Fecha:** 21/01/2026
**Sesión #:** 4

### Motivo de consulta
Dificultades de adaptación al cambio de turno (diurno → nocturno) con impacto en calidad de sueño y concentración laboral.

### Síntomas reportados
- Insomnio de conciliación durante horario diurno
- Fatiga significativa durante turno nocturno  
- Disminución de la concentración (incidente laboral reportado)
- Irritabilidad con familia

### Intervenciones realizadas
1. Revisión de técnicas de higiene del sueño
2. Identificación de barreras ambientales (ruido, luz)
3. Psicoeducación sobre ritmos circadianos
4. Técnica de relajación progresiva

### Plan de seguimiento
- Implementar cortinas blackout en dormitorio
- Practicar técnica de relajación antes de dormir
- Coordinar con familia para reducir ruido diurno
- Próxima sesión: evaluar evolución en 1 semana

### Indicadores de riesgo
⚠️ Incidente laboral por falta de concentración - monitorear
⚠️ Score IDSM-Plus descendiente últimas 2 semanas

### Código diagnóstico sugerido
F51.0 - Insomnio no orgánico`);

      toast({
        title: "Resumen generado ✓",
        description: "El copiloto IA ha creado el borrador de notas clínicas",
      });
    }, 1500);
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notas guardadas ✓",
      description: "Las notas clínicas han sido guardadas exitosamente",
    });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recording Controls */}
        <Card className={isRecording ? "border-red-500 bg-red-50" : ""}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isRecording ? (
                  <Button 
                    variant="destructive" 
                    size="lg"
                    onClick={handleStopRecording}
                  >
                    <MicOff className="h-5 w-5 mr-2" />
                    Detener Grabación
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    onClick={handleStartRecording}
                    disabled={isTranscribing}
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Iniciar Grabación
                  </Button>
                )}
                
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-600 font-medium">Grabando sesión...</span>
                  </div>
                )}

                {isTranscribing && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Transcribiendo...
                  </Badge>
                )}
              </div>

              {selectedAppointment && (
                <Badge variant="outline">
                  <User className="h-3 w-3 mr-1" />
                  {selectedAppointment.patientName}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas Clínicas
            </CardTitle>
            <CardDescription>
              Escribe tus notas o genera un borrador con IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notes">
              <TabsList className="mb-4">
                <TabsTrigger value="notes">Notas manuales</TabsTrigger>
                <TabsTrigger value="transcript">Transcripción</TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Resumen IA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes">
                <Textarea
                  placeholder="Escribe tus notas de la sesión aquí..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="transcript">
                {transcript ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyToClipboard(transcript)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Inicia una grabación para generar la transcripción automática</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ai">
                {aiSummary ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyToClipboard(aiSummary)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <div className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border border-primary/20 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {aiSummary}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wand2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground mb-4">
                      Genera un resumen estructurado de la sesión con IA
                    </p>
                    <Button 
                      onClick={handleGenerateSummary}
                      disabled={!transcript}
                      className="bg-gradient-to-r from-primary to-primary-glow"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar resumen IA
                    </Button>
                    {!transcript && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Primero necesitas una transcripción
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleSaveNotes}>
                <Save className="h-4 w-4 mr-2" />
                Guardar notas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Sessions List */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sesiones del día</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAppointment?.id === apt.id 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedAppointment(apt)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{apt.patientName}</span>
                  <Badge variant="outline" className="text-xs">
                    {apt.time}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={apt.status === 'completed' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {apt.status === 'completed' ? '✓ Completada' : 'Pendiente'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Template Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plantillas rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { icon: '📋', label: 'Nota SOAP', desc: 'Subjetivo, Objetivo, Análisis, Plan' },
              { icon: '📝', label: 'Nota DAP', desc: 'Datos, Análisis, Plan' },
              { icon: '🎯', label: 'Seguimiento', desc: 'Progreso y próximos pasos' },
              { icon: '⚠️', label: 'Alerta clínica', desc: 'Documentación de riesgo' },
            ].map((template, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => setNotes(`[Plantilla: ${template.label}]\n\n`)}
              >
                <span className="text-lg mr-3">{template.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-sm">{template.label}</p>
                  <p className="text-xs text-muted-foreground">{template.desc}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* AI Tips */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-sm">Tip del Copiloto</p>
                <p className="text-xs text-muted-foreground mt-1">
                  La transcripción detectó menciones de "incidente laboral" y "falta de sueño". 
                  Considera documentar estos factores de riesgo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
