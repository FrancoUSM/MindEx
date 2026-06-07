import { useState, useEffect } from "react";
import {
  LayoutDashboard, Calendar, Users, FileText,
  Bell, Settings, Video, ArrowLeft, Clock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertsDashboard } from "./AlertsDashboard";
import { ClinicalNotes } from "./ClinicalNotes";
import mindexaLogo from "@/assets/mindexa-logo-slogan-color.png";
import { authFetch } from "@/lib/api";

interface ProfessionalDashboardProps {
  userId: number;
  onBack: () => void;
}

interface ProfesionalData {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  especialidades: string[];
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  tipo: string;
  estado: string;
  profesional_nombre: string;
  profesional_apellido: string;
}

const API = import.meta.env.VITE_API_URL;

export function ProfessionalDashboard({ userId, onBack }: ProfessionalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profesional, setProfesional] = useState<ProfesionalData | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [alertasAlto, setAlertasAlto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [perfilRes, alertasRes] = await Promise.all([
          authFetch(`${API}/api/profesional/mi-perfil/${userId}`),
          authFetch(`${API}/api/profesional/alertas-alto`),
        ]);

        if (!perfilRes.ok) throw new Error('No se pudo cargar el perfil profesional');
        const perfil: ProfesionalData = await perfilRes.json();
        setProfesional(perfil);

        if (alertasRes.ok) {
          const alertasData = await alertasRes.json();
          setAlertasAlto(alertasData.total ?? 0);
        }

        const citasRes = await authFetch(`${API}/api/agendamiento/citas-profesional/${perfil.id}`);
        if (citasRes.ok) {
          const citasData: Cita[] = await citasRes.json();
          setCitas(citasData);
        }
      } catch (e: any) {
        setError(e.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [userId]);

  const hoy = new Date().toISOString().slice(0, 10);
  const citasHoy = citas.filter(c => c.fecha === hoy && c.estado !== 'INACTIVO');
  const citasProximas = citas.filter(c => c.fecha >= hoy && c.estado !== 'INACTIVO');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profesional) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || 'Perfil profesional no encontrado'}</p>
        <Button variant="outline" onClick={onBack}>Volver</Button>
      </div>
    );
  }

  const nombreCompleto = `${profesional.nombre} ${profesional.apellido}`;
  const initials = `${profesional.nombre[0] ?? ''}${profesional.apellido[0] ?? ''}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <img src={mindexaLogo} alt="MINDEXA" className="h-10" />
              <Badge variant="secondary">Portal Profesional</Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {alertasAlto > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alertasAlto}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{nombreCompleto}</p>
                  <p className="text-xs text-muted-foreground">
                    {profesional.especialidades?.[0] ?? 'Profesional de Salud Mental'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Inicio
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2 relative">
              <Bell className="h-4 w-4" />
              Alertas
              {alertasAlto > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                  {alertasAlto}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              Notas Clínicas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Calendar className="h-8 w-8 text-primary" />
                    <span className="text-3xl font-bold">{citasHoy.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Citas hoy</p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Bell className="h-8 w-8 text-red-500" />
                    <span className="text-3xl font-bold text-red-600">{alertasAlto}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Alertas riesgo alto (sistema)</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Clock className="h-8 w-8 text-green-500" />
                    <span className="text-3xl font-bold text-green-600">{citasProximas.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Citas próximas</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agenda de hoy</CardTitle>
                  <CardDescription>Tus sesiones programadas para hoy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {citasHoy.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Sin citas para hoy
                    </p>
                  ) : (
                    citasHoy.map(c => (
                      <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-medium">{c.fecha}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{c.motivo || 'Consulta'}</p>
                          <Badge variant="outline" className="text-xs mt-1">{c.estado}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximas citas</CardTitle>
                  <CardDescription>Todas tus citas agendadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                  {citasProximas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Sin citas próximas
                    </p>
                  ) : (
                    citasProximas.map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{c.motivo || 'Consulta'}</p>
                          <p className="text-xs text-muted-foreground">{c.fecha}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{c.estado}</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsDashboard professionalId={String(profesional.id)} />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Citas</CardTitle>
                <CardDescription>Todas tus citas agendadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {citas.filter(c => c.estado !== 'INACTIVO').map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{c.motivo || 'Consulta'}</p>
                      <p className="text-xs text-muted-foreground">{c.fecha}</p>
                    </div>
                    <Badge>{c.estado}</Badge>
                  </div>
                ))}
                {citas.filter(c => c.estado !== 'INACTIVO').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Sin citas agendadas</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <ClinicalNotes professionalId={String(profesional.id)} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
