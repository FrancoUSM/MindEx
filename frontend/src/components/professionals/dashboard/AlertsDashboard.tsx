import { useState } from "react";
import { 
  AlertTriangle, AlertCircle, TrendingDown, TrendingUp, 
  Clock, User, Calendar, ChevronRight, Bell, Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_APPOINTMENTS, Appointment } from "@/lib/professionals";

interface AlertsDashboardProps {
  professionalId: string;
}

export function AlertsDashboard({ professionalId }: AlertsDashboardProps) {
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);

  // Filter appointments for this professional
  const appointments = MOCK_APPOINTMENTS.filter(a => a.professionalId === professionalId);
  
  // Categorize by risk level
  const redAlerts = appointments.filter(a => a.checkinData?.riskLevel === 'red');
  const orangeAlerts = appointments.filter(a => a.checkinData?.riskLevel === 'orange');
  const yellowAlerts = appointments.filter(a => a.checkinData?.riskLevel === 'yellow');
  const greenPatients = appointments.filter(a => a.checkinData?.riskLevel === 'green');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-500 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      case 'yellow': return 'bg-yellow-500 text-white';
      case 'green': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'red': return 'destructive';
      case 'orange': return 'default';
      case 'yellow': return 'secondary';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <span className="text-muted-foreground">→</span>;
    }
  };

  const PatientCard = ({ appointment }: { appointment: Appointment }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedPatient?.id === appointment.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedPatient(appointment)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.patientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getRiskColor(appointment.checkinData?.riskLevel || 'green')} flex items-center justify-center`}>
              {appointment.checkinData?.riskLevel === 'red' && <AlertTriangle className="h-2.5 w-2.5" />}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">{appointment.patientName}</p>
              {getTrendIcon(appointment.checkinData?.trend || 'stable')}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={getRiskBadgeVariant(appointment.checkinData?.riskLevel || 'green')}
                className="text-xs"
              >
                Score: {appointment.checkinData?.lastScore}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Racha: {appointment.checkinData?.streak} días
              </span>
            </div>
          </div>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Alerts */}
        {appointment.checkinData?.alerts && appointment.checkinData.alerts.length > 0 && (
          <div className="mt-3 pt-3 border-t space-y-1">
            {appointment.checkinData.alerts.slice(0, 2).map((alert, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <AlertCircle className={`h-3 w-3 mt-0.5 flex-shrink-0 ${
                  alert.includes('ROJA') || alert.includes('crítico') ? 'text-red-500' : 'text-orange-500'
                }`} />
                <span className="text-muted-foreground">{alert}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Alerts Overview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <span className="text-3xl font-bold text-red-600">{redAlerts.length}</span>
              </div>
              <p className="text-sm text-red-700 mt-2">Alertas Rojas</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertCircle className="h-8 w-8 text-orange-500" />
                <span className="text-3xl font-bold text-orange-600">{orangeAlerts.length}</span>
              </div>
              <p className="text-sm text-orange-700 mt-2">Alertas Naranjas</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-yellow-600" />
                <span className="text-3xl font-bold text-yellow-600">{yellowAlerts.length}</span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">En Observación</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <User className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold text-green-600">{greenPatients.length}</span>
              </div>
              <p className="text-sm text-green-700 mt-2">Estables</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Lists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Panel de Alertas Predictivas
            </CardTitle>
            <CardDescription>
              Datos del check-in diario de tus pacientes antes de cada sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="red">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="red" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                  🔴 Críticos ({redAlerts.length})
                </TabsTrigger>
                <TabsTrigger value="orange" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                  🟠 Alerta ({orangeAlerts.length})
                </TabsTrigger>
                <TabsTrigger value="yellow" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700">
                  🟡 Atención ({yellowAlerts.length})
                </TabsTrigger>
                <TabsTrigger value="green" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                  🟢 Estables ({greenPatients.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="red" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {redAlerts.length > 0 ? (
                      redAlerts.map(apt => <PatientCard key={apt.id} appointment={apt} />)
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay alertas rojas activas 🎉
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="orange" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {orangeAlerts.length > 0 ? (
                      orangeAlerts.map(apt => <PatientCard key={apt.id} appointment={apt} />)
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay alertas naranjas activas
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="yellow" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {yellowAlerts.length > 0 ? (
                      yellowAlerts.map(apt => <PatientCard key={apt.id} appointment={apt} />)
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay pacientes en observación
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="green" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {greenPatients.length > 0 ? (
                      greenPatients.map(apt => <PatientCard key={apt.id} appointment={apt} />)
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay pacientes estables registrados
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Patient Detail Sidebar */}
      <div className="space-y-6">
        {selectedPatient ? (
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedPatient.patientName}</CardTitle>
                  <CardDescription>Próxima cita hoy</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Check-in Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Score actual</span>
                  <Badge variant={getRiskBadgeVariant(selectedPatient.checkinData?.riskLevel || 'green')}>
                    {selectedPatient.checkinData?.lastScore}/48
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tendencia</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(selectedPatient.checkinData?.trend || 'stable')}
                    <span className="text-sm capitalize">{selectedPatient.checkinData?.trend}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Último check-in</span>
                  <span className="text-sm">{selectedPatient.checkinData?.lastCheckin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Racha</span>
                  <span className="text-sm">{selectedPatient.checkinData?.streak} días 🔥</span>
                </div>
              </div>

              {/* Alerts */}
              {selectedPatient.checkinData?.alerts && selectedPatient.checkinData.alerts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Alertas detectadas</p>
                  {selectedPatient.checkinData.alerts.map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{alert}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Next appointment */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Próxima sesión</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedPatient.date} - {selectedPatient.time}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver historial
                </Button>
                <Button className="flex-1" size="sm">
                  Iniciar sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Selecciona un paciente para ver sus detalles
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">🤖</span>
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span>📊</span>
              <p>3 pacientes muestran tendencia descendente esta semana</p>
            </div>
            <div className="flex items-start gap-2">
              <span>⚠️</span>
              <p>Carlos Gutiérrez requiere atención prioritaria - sin check-in hace 3 días</p>
            </div>
            <div className="flex items-start gap-2">
              <span>💡</span>
              <p>Patrón detectado: estrés elevado correlaciona con turnos nocturnos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
