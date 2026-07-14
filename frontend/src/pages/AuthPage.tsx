import React,{ useState, Suspense } from "react";

import { useNavigate } from "react-router-dom";
import { saveSession, saveToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Shield, ArrowLeft, Building2, Sparkles, Activity, AlertCircle } from "lucide-react";
import mindexaLogo from "@/assets/mindexa-logo-slogan.png";
import NeuralBackground from "@/components/three/NeuralBackground";




export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState(""); // valor fijo por ahora
  const [cargo, setCargo] = useState(""); // si más adelante decides usarlo 
  const [estado] = useState("ACTIVO");
  const [contrasena, setContrasena] = useState(""); // si más adelante decides usarlo
  const [turno, setTurno] = useState(""); // para el select Turno
  const [faena, setFaena] = useState(""); // para el select Faena
  const [razonSocial, setRazonSocial] = useState("");

  const [contrasenaLogin, setContrasenaLogin] = useState("");
  const [correoLogin, setCorreoLogin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setLoginError(null);

  try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: correoLogin.trim(),
        contrasena: contrasenaLogin,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "Credenciales inválidas");
    }

    saveSession({
      id_usuario: result.id_usuario,
      nombre: result.nombre.trim(),
      correo: result.correo.trim(),
      rol: result.rol?.toUpperCase().trim(),

    });
    if (result.token) saveToken(result.token);
    console.log("Respuesta login:", result);
    console.log("Rol recibido:", result.rol);

    const rol = result.rol?.toUpperCase().trim();

    if (rol === "ADMIN") {
      navigate("/admin");
    } else if(rol ==="ADMINISTRATIVO"){
      navigate("/administrativo");
    } else if (rol === "PROFESIONAL") {
      navigate("/professionals");
    } else if (rol === "USER") {
      navigate("/checkin");
    } else {
      console.log("Rol no definido o no reconocido:", rol);
      navigate("/");
    }

  } catch (error: any) {
    setLoginError(error.message || "Error al iniciar sesión. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
  }
};

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setRegisterError(null);

const registerData = {
  nombre: nombre.trim(),
  apellido: apellido.trim(),
  correo: correo.trim(),
  telefono: telefono.trim(),
  rol: rol,
  estado: estado,
  contrasena: contrasena,
  razonSocial: razonSocial,
  cargo: cargo,
  turno: turno,
  faena: faena,
  
};
  
  


  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/empleado/crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });
    

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

const result = await response.json();
console.log("Respuesta registro:", result);
console.log("Rol seleccionado en formulario:", rol);
if (result.error) throw new Error(result.error);

const rolFinal = rol.toUpperCase().trim();

saveSession({
  id_usuario: result.id_usuario,
  nombre: result.nombre?.trim(),
  correo: result.correo,
  rol: rolFinal
});

if (result.token) saveToken(result.token);

if (rolFinal === "ADMIN") {
  navigate("/admin");
} else if (rolFinal === "USER") {
  navigate("/checkin");
} else {
  navigate("/");
}
  } catch (error: any) {
    setRegisterError(error.message || "Error al crear la cuenta. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Neural Background */}
      <Suspense fallback={null}>
        <NeuralBackground />
      </Suspense>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 z-50 group flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600/90 to-cyan-600/90 backdrop-blur-md border border-blue-400/30 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
      >
        <ArrowLeft className="h-5 w-5 text-white group-hover:-translate-x-1 transition-transform" />
        <span className="text-white font-semibold text-sm">Volver al Inicio</span>
      </button>

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <img 
            src={mindexaLogo} 
            alt="Mindexa" 
            className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />
          
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-1.5">
            <Building2 className="h-3 w-3 mr-2" />
            Portal Empresarial
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm mb-6">
              <Activity className="h-4 w-4 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">Portal Empresarial B2B</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Salud Mental para tu Empresa
              </span>
            </h1>
            
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
              Protege el bienestar de tus equipos con monitoreo predictivo, alertas tempranas y métricas accionables.
            </p>
          </div>

          {/* Auth Forms */}
          <div className="max-w-md mx-auto mb-16">
            <Card className="border-2 border-blue-400/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                  <TabsTrigger value="login" className="registerData-[state=active]:bg-blue-600 registerData-[state=active]:text-white">
                    Iniciar Sesión
                  </TabsTrigger>
                  <TabsTrigger value="register" className="registerData-[state=active]:bg-blue-600 registerData-[state=active]:text-white">
                    Registrarse
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <CardHeader>
                    <CardTitle className="text-white">Bienvenido de vuelta</CardTitle>
                    <CardDescription className="text-slate-400">
                      Ingresa tus credenciales para acceder a tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={correoLogin}
                          onChange={(e) => setCorreoLogin(e.target.value)}
                          placeholder="tu.email@empresa.com"
                          defaultValue="demo@mindexa.com"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={contrasenaLogin}
                          onChange={(e) => setContrasenaLogin(e.target.value)}
                          placeholder="••••••••"
                          defaultValue="demo1234"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>

                      
                      {loginError && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {loginError}
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        disabled={isLoading}
                      >
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="register">
                  <CardHeader>
                    <CardTitle className="text-white">Crear cuenta</CardTitle>
                    <CardDescription className="text-slate-400">
                      Regístrate para acceder a la plataforma de salud mental
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-slate-300">Nombre</Label>
                          <Input
                            id="firstName"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Juan"
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-slate-300">Apellido</Label>
                          <Input
                            id="lastName"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Pérez"
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                            required
                          />
                        </div>
                      </div>
                      {/*
                      <div className="space-y-2">
                        <Label htmlFor="employeeId" className="text-slate-300">ID Empleado</Label>
                        <Input
                          id="employeeId"
                          placeholder="EMP-001"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>*/}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          placeholder="tu.email@empresa.com"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={contrasena}
                          onChange={(e) => setContrasena(e.target.value)}
                          placeholder="••••••••"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">Cargo</Label>
                        <Input
                          id="cargo"
                          type="text"
                          value={cargo}
                          onChange={(e) => setCargo(e.target.value)}
                          placeholder="Ej: Supervisor"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shift" className="text-slate-300">Turno</Label>
                          <Select
                          value={turno} onValueChange={setTurno} required>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="day">Día</SelectItem>
                              <SelectItem value="night">Noche</SelectItem>
                              <SelectItem value="rotational">Rotativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mineSite" className="text-slate-300">Faena</Label>
                          <Select value={faena} onValueChange={setFaena} required>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="norte">Faena Norte</SelectItem>
                              <SelectItem value="sur">Faena Sur</SelectItem>
                              <SelectItem value="central">Faena Central</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="razonSocial" className="text-slate-300">Razón Social de tu Empresa</Label>
                        <Input
                          id="razonSocial"
                          value={razonSocial}
                          onChange={(e) => setRazonSocial(e.target.value)}
                          placeholder="Ej: Minera Los Andes S.A."
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />

                      </div>
                        {/*LÓGICA DE ROL */}
                      <div className="space-y-2">
                          <Label htmlFor="mineSite" className="text-slate-300">Rol</Label>
                          <Select value={rol} onValueChange={setRol} required>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                              <SelectItem value="ADMINISTRATIVO">ADMINISTRATIVO</SelectItem>
                              <SelectItem value="USER">USER</SelectItem>
                              
                            </SelectContent>
                          </Select>
                        </div>

                      {/* Consent Section */}
                      <div className="space-y-4 pt-4 border-t border-slate-700">
                        <h4 className="font-medium text-sm text-slate-300">Consentimientos</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <Checkbox id="consent-surveys" defaultChecked className="border-slate-500" />
                            <div className="space-y-1">
                              <Label 
                                htmlFor="consent-surveys" 
                                className="text-sm font-normal cursor-pointer text-slate-300"
                              >
                                Acepto participar en encuestas de salud mental
                              </Label>
                              <p className="text-xs text-slate-500">
                                Incluye PHQ-9, GAD-7, DASS-21 y CEAL-SM
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox id="consent-wearables" className="border-slate-500" />
                            <div className="space-y-1">
                              <Label 
                                htmlFor="consent-wearables" 
                                className="text-sm font-normal cursor-pointer text-slate-300"
                              >
                                Acepto compartir datos de dispositivos wearables
                              </Label>
                              <p className="text-xs text-slate-500">
                                Datos de ritmo cardíaco, sueño y actividad física
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox id="consent-ai" className="border-slate-500" />
                            <div className="space-y-1">
                              <Label 
                                htmlFor="consent-ai" 
                                className="text-sm font-normal cursor-pointer text-slate-300"
                              >
                                Acepto el análisis predictivo con IA
                              </Label>
                              <p className="text-xs text-slate-500">
                                Para alertas tempranas y recomendaciones personalizadas
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {registerError && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {registerError}
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Features Preview */}
            <div className="grid grid-cols-3 gap-4 text-center mt-8">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg flex items-center justify-center mx-auto">
                  <Heart className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-xs text-slate-400">Check-ins Diarios</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center mx-auto">
                  <Brain className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-400">Evaluaciones Validadas</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-xs text-slate-400">Alertas Preventivas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 MINDEXA. Plataforma de Salud Mental Predictiva.</p>
        </div>
      </footer>
    </div>
  );
}
