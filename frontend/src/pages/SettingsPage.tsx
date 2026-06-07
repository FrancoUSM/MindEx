import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, User, CheckCircle, AlertCircle } from "lucide-react";
import { getSession, saveSession } from "@/lib/auth";
import { authFetch } from "@/lib/api";

export default function SettingsPage() {
  const session = getSession();

  const nameParts = session?.nombre?.split(" ") ?? ["", ""];
  const [nombre, setNombre] = useState(nameParts[0] ?? "");
  const [apellido, setApellido] = useState(nameParts.slice(1).join(" ") ?? "");
  const [telefono, setTelefono] = useState("");

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");

  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleActualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoadingProfile(true);
    setProfileMsg(null);
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/usuario/perfil/${session.id_usuario}`,
        {
          method: "PUT",
          body: JSON.stringify({ nombre, apellido, telefono }),
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Error al actualizar");
      saveSession({ ...session, nombre: data.nombre });
      setProfileMsg({ type: "ok", text: "Perfil actualizado correctamente" });
    } catch (err: any) {
      setProfileMsg({ type: "err", text: err.message || "Error al actualizar el perfil" });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contrasenaNueva !== contrasenaConfirmar) {
      setPassMsg({ type: "err", text: "Las contraseñas no coinciden" });
      return;
    }
    if (contrasenaNueva.length < 8) {
      setPassMsg({ type: "err", text: "La nueva contraseña debe tener al menos 8 caracteres" });
      return;
    }
    setLoadingPass(true);
    setPassMsg(null);
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/usuario/contrasena/${session?.id_usuario}`,
        {
          method: "PUT",
          body: JSON.stringify({ contrasena_actual: contrasenaActual, contrasena_nueva: contrasenaNueva }),
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Error al cambiar contraseña");
      setContrasenaActual("");
      setContrasenaNueva("");
      setContrasenaConfirmar("");
      setPassMsg({ type: "ok", text: "Contraseña actualizada correctamente" });
    } catch (err: any) {
      setPassMsg({ type: "err", text: err.message || "Error al cambiar la contraseña" });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
      </div>

      <div className="grid gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription>
              Gestiona tu información personal — correo: <strong>{session?.correo}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleActualizarPerfil} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+56 9 1234 5678"
                />
              </div>
              {profileMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  profileMsg.type === "ok"
                    ? "bg-green-500/10 border border-green-500/30 text-green-600"
                    : "bg-red-500/10 border border-red-500/30 text-red-500"
                }`}>
                  {profileMsg.type === "ok"
                    ? <CheckCircle className="h-4 w-4 shrink-0" />
                    : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {profileMsg.text}
                </div>
              )}
              <Button type="submit" disabled={loadingProfile}>
                {loadingProfile ? "Actualizando..." : "Actualizar Perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Recordatorios de Check-in</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe recordatorios diarios para completar tu check-in
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Evaluaciones Programadas</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones sobre evaluaciones psicológicas pendientes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Contacto Profesional</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas cuando un profesional intenta contactarte
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacidad y Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidad y Seguridad
            </CardTitle>
            <CardDescription>
              Controla la privacidad de tus datos y cambia tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Datos Anónimos</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir el uso de datos anónimos para investigación
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Compartir con Supervisor</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que tu supervisor vea resúmenes de tu bienestar
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <form onSubmit={handleCambiarContrasena} className="space-y-4">
              <Label className="text-base">Cambiar Contraseña</Label>
              <div className="grid gap-2">
                <Input
                  type="password"
                  placeholder="Contraseña actual"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Nueva contraseña (mín. 8 caracteres)"
                  value={contrasenaNueva}
                  onChange={(e) => setContrasenaNueva(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  value={contrasenaConfirmar}
                  onChange={(e) => setContrasenaConfirmar(e.target.value)}
                  required
                />
              </div>
              {passMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  passMsg.type === "ok"
                    ? "bg-green-500/10 border border-green-500/30 text-green-600"
                    : "bg-red-500/10 border border-red-500/30 text-red-500"
                }`}>
                  {passMsg.type === "ok"
                    ? <CheckCircle className="h-4 w-4 shrink-0" />
                    : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {passMsg.text}
                </div>
              )}
              <Button type="submit" variant="outline" disabled={loadingPass}>
                {loadingPass ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
