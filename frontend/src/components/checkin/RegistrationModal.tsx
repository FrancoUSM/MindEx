import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Briefcase, Building2, AlertCircle } from "lucide-react";
import { LegalDocumentModal } from "@/components/consent/LegalDocumentModal";
import { saveSession, saveToken } from "@/lib/auth";

const registrationSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Ingresa un email válido").max(255),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmarContrasena: z.string(),
  empresa: z.string().optional(),
  cargo: z.string().min(2, "Ingresa tu cargo actual").max(100),
  sector: z.string().min(1, "Selecciona un sector"),
  aceptaTerminos: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones"
  }),
  aceptaPrivacidad: z.boolean().refine(val => val === true, {
    message: "Debes aceptar la política de privacidad"
  }),
}).refine(data => data.contrasena === data.confirmarContrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContrasena"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export interface RegistrationSession {
  id_usuario: number;
  nombre: string;
  correo: string;
}

const SECTORES = [
  "Tecnología",
  "Salud",
  "Educación",
  "Finanzas y Banca",
  "Retail y Comercio",
  "Manufactura",
  "Servicios Profesionales",
  "Gobierno y Sector Público",
  "Construcción",
  "Transporte y Logística",
  "Hotelería y Turismo",
  "Telecomunicaciones",
  "Energía",
  "Agricultura",
  "Otro",
];

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (session: RegistrationSession) => void;
}

const API = import.meta.env.VITE_API_URL;

export function RegistrationModal({
  open,
  onOpenChange,
  onComplete,
}: RegistrationModalProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nombre: "",
      email: "",
      contrasena: "",
      confirmarContrasena: "",
      empresa: "",
      cargo: "",
      sector: "",
      aceptaTerminos: false,
      aceptaPrivacidad: false,
    },
  });

  const aceptaTerminos = watch("aceptaTerminos");
  const aceptaPrivacidad = watch("aceptaPrivacidad");

  const onSubmit = async (data: RegistrationFormData) => {
    setApiError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/usuario/registro-publico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          apellido: "",
          correo: data.email,
          contrasena: data.contrasena,
          cargo: data.cargo,
          sector: data.sector,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiError(json.error || "Error al crear la cuenta. Intenta de nuevo.");
        return;
      }

      const session: RegistrationSession = {
        id_usuario: json.id_usuario,
        nombre: json.nombre,
        correo: json.correo,
      };

      saveSession(session);
      if (json.token) saveToken(json.token);
      onComplete(session);
    } catch {
      setApiError("No se pudo conectar con el servidor. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle>Registro para ver tu diagnóstico</DialogTitle>
            </div>
            <DialogDescription>
              Completa tus datos para guardar tu evaluación y acceder a tu diagnóstico personalizado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {apiError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {apiError}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                placeholder="Tu nombre"
                {...register("nombre")}
                className={errors.nombre ? "border-destructive" : ""}
              />
              {errors.nombre && (
                <p className="text-xs text-destructive">{errors.nombre.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña *</Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register("contrasena")}
                className={errors.contrasena ? "border-destructive" : ""}
              />
              {errors.contrasena && (
                <p className="text-xs text-destructive">{errors.contrasena.message}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmarContrasena">Confirmar contraseña *</Label>
              <Input
                id="confirmarContrasena"
                type="password"
                placeholder="Repite tu contraseña"
                {...register("confirmarContrasena")}
                className={errors.confirmarContrasena ? "border-destructive" : ""}
              />
              {errors.confirmarContrasena && (
                <p className="text-xs text-destructive">{errors.confirmarContrasena.message}</p>
              )}
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="cargo" className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                Cargo actual *
              </Label>
              <Input
                id="cargo"
                placeholder="Ej: Analista, Gerente, Coordinador..."
                {...register("cargo")}
                className={errors.cargo ? "border-destructive" : ""}
              />
              {errors.cargo && (
                <p className="text-xs text-destructive">{errors.cargo.message}</p>
              )}
            </div>

            {/* Empresa (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="empresa" className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Empresa <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Input
                id="empresa"
                placeholder="Nombre de tu empresa"
                {...register("empresa")}
              />
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <Label>Sector laboral *</Label>
              <Select onValueChange={(value) => setValue("sector", value)}>
                <SelectTrigger className={errors.sector ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecciona tu sector" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORES.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector && (
                <p className="text-xs text-destructive">{errors.sector.message}</p>
              )}
            </div>

            {/* Términos y condiciones */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terminos"
                  checked={aceptaTerminos}
                  onCheckedChange={(checked) => setValue("aceptaTerminos", checked as boolean)}
                />
                <Label htmlFor="terminos" className="text-sm leading-tight cursor-pointer">
                  Acepto los{" "}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                    className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                  >
                    términos y condiciones
                  </button>{" "}
                  del servicio *
                </Label>
              </div>
              {errors.aceptaTerminos && (
                <p className="text-xs text-destructive">{errors.aceptaTerminos.message}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacidad"
                  checked={aceptaPrivacidad}
                  onCheckedChange={(checked) => setValue("aceptaPrivacidad", checked as boolean)}
                />
                <Label htmlFor="privacidad" className="text-sm leading-tight cursor-pointer">
                  Acepto la{" "}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}
                    className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                  >
                    política de privacidad
                  </button>{" "}
                  y el tratamiento de mis datos *
                </Label>
              </div>
              {errors.aceptaPrivacidad && (
                <p className="text-xs text-destructive">{errors.aceptaPrivacidad.message}</p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <p>
                🔒 Tus datos están protegidos y solo se utilizarán para personalizar tu experiencia
                y brindarte recomendaciones de bienestar laboral.
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Registrando..." : "Ver mi diagnóstico"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <LegalDocumentModal open={showTerms} onOpenChange={setShowTerms} type="terms" />
      <LegalDocumentModal open={showPrivacy} onOpenChange={setShowPrivacy} type="privacy" />
    </>
  );
}
