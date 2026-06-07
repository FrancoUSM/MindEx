import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  User, Mail, Phone, MapPin, GraduationCap, Award, 
  FileText, Upload, CheckCircle, ArrowLeft, ArrowRight,
  Brain, Clock, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { SPECIALTIES, APPROACHES } from "@/lib/professionals";
import { Navigate } from "react-router-dom";



const registrationSchema = z.object({
  // Step 1: Personal Info
  firstName: z.string().min(3, "Nombres requerido"),
  lastName: z.string().min(3, "Apellidos requeridos"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono requerido"),
  password: z.string().min(8,"Contraseña requerida"),
  professionalTitle: z.string().min(1, "Selecciona tu título profesional"),
  nationalId: z.string().min(5, "RUT/DNI requerido"),
  
  // Step 2: Professional Info
  specialties: z.array(z.string()).min(1, "Selecciona al menos una especialidad"),
  approach: z.string().min(1, "Selecciona un enfoque"),
  experience: z.number().min(0, "Años de experiencia requeridos"),
  bio: z.string().min(50, "Mínimo 50 caracteres").max(500, "Máximo 500 caracteres"),
  
  // Step 3: Education & Certifications
  education: z.string().min(10, "Ingresa tu formación académica"),
  certifications: z.string().optional(),
  licenseNumber: z.string().min(1, "Número de registro profesional requerido"),
  
  // Step 4: Service Details
  sessionPrice: z.number().min(1000, "Precio mínimo $1.000"),
  sessionDuration: z.number().min(30, "Duración mínima 30 minutos"),
  location: z.string().min(1, "Ciudad requerida"),
  languages: z.array(z.string()).min(1, "Selecciona al menos un idioma"),
  acceptsMindexa: z.boolean(),
  
  // Step 5: Terms
  termsAccepted: z.boolean().refine(val => val === true, "Debes aceptar los términos"),
  privacyAccepted: z.boolean().refine(val => val === true, "Debes aceptar la política de privacidad"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface ProfessionalRegistrationProps {
  onComplete: () => void;
  onBack: () => void;
}



export function ProfessionalRegistration({ onComplete, onBack }: ProfessionalRegistrationProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName:'',
      email: '',
      phone: '',
      password: '',
      professionalTitle: '',
      nationalId: '',
      specialties: [],
      approach: '',
      experience: 0,
      bio: '',
      education: '',
      certifications: '',
      licenseNumber: '',
      sessionPrice: 0,
      sessionDuration: 50,
      location: '',
      languages: ['Español'],
      acceptsMindexa: true,
      termsAccepted: false,
      privacyAccepted: false,
    },
  }


);


  const handleNext = async () => {
    // Validate current step fields
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };
const onSubmit = async (data: RegistrationData) => {
  try {
    const payload = {
      usuarioProfesional: {
        nombre: data.firstName,
        apellido: data.lastName,
        correo: data.email,
        telefono: data.phone,
        contrasena: data.password,
        rol: 'PROFESIONAL',
        estado: 'ACTIVO',
        numero_registro_salud: parseInt(data.licenseNumber) || 0,
        biografia_profesional: data.bio,
        descripcion_formacion_academica: data.education,
        anios_experiencia: data.experience,
        acepta_empleados_mindexa: data.acceptsMindexa,
        enfoque_terapeutico: data.approach,
        especialidades: data.specialties,
      },
      certificacionesProfesionales: data.certifications
        ? {
            nombre_certificacion: data.certifications,
            tipo_certificacion: 'general',
            institucion_emisora: 'por definir',
          }
        : null,
      servicioProfesional: {
        nombreServicio: 'Consulta Psicológica',
        descripcion_servicio: data.bio,
        duracion_servicio: data.sessionDuration,
        precio_servicio: data.sessionPrice,
      },
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profesional/crear-profesional`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    console.log("Usuario creado:", result);

    toast({
      title: "¡Registro enviado! 🎉",
      description: "Revisaremos tu solicitud en 24-48 horas.",
    });

    onComplete();
  } catch (e) {
    console.error(e);
    toast({
      title: "Error",
      description: "No se pudo registrar el usuario",
      variant: "destructive",
    });
  }
};

  const getFieldsForStep = (stepNum: number): (keyof RegistrationData)[] => {
    switch (stepNum) {
      case 1: return ['firstName', 'lastName', 'email', 'phone', 'professionalTitle', 'nationalId'];
      case 2: return ['specialties', 'approach', 'experience', 'bio'];
      case 3: return ['education', 'licenseNumber'];
      case 4: return ['sessionPrice', 'sessionDuration', 'location', 'languages'];
      case 5: return ['termsAccepted', 'privacyAccepted'];
      default: return [];
    }
  };

  const selectedSpecialties = form.watch('specialties') || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Registro de Profesional</h1>
          <p className="text-muted-foreground">Paso {step} de {totalSteps}</p>
        </div>
      </div>

      <Progress value={(step / totalSteps) * 100} className="mb-8" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Datos básicos de identificación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Juan Hernán" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez González" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder="***********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email profesional</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+56 9 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="professionalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título profesional</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu título" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="psicologo">Psicólogo/a Clínico/a</SelectItem>
                          <SelectItem value="psiquiatra">Psiquiatra</SelectItem>
                          <SelectItem value="psicologo-org">Psicólogo/a Organizacional</SelectItem>
                          <SelectItem value="psicologo-infanto">Psicólogo/a Infanto-Juvenil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUT / DNI</FormLabel>
                      <FormControl>
                        <Input placeholder="12.345.678-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Professional Info */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Información Profesional
                </CardTitle>
                <CardDescription>
                  Cuéntanos sobre tu práctica y experiencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="specialties"
                  render={() => (
                    <FormItem>
                      <FormLabel>Especialidades (selecciona hasta 5)</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {SPECIALTIES.map((specialty) => (
                          <Badge
                            key={specialty}
                            variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                            className="cursor-pointer transition-colors"
                            onClick={() => {
                              const current = form.getValues('specialties');
                              if (current.includes(specialty)) {
                                form.setValue('specialties', current.filter(s => s !== specialty));
                              } else if (current.length < 5) {
                                form.setValue('specialties', [...current, specialty]);
                              }
                            }}
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enfoque terapéutico principal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu enfoque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {APPROACHES.map((approach) => (
                            <SelectItem key={approach} value={approach}>
                              {approach}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Años de experiencia</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografía profesional</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Cuéntale a tus potenciales pacientes sobre tu enfoque y experiencia..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Education */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Formación y Credenciales
                </CardTitle>
                <CardDescription>
                  Tu formación académica y certificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formación académica</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ej: Psicología, Universidad de Chile (2015). Magíster en Psicología Clínica, PUC (2018)"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Incluye títulos, universidades y años
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificaciones y especializaciones (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ej: Certificación TCC, EMDR Level II, Coach ICF..."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de registro profesional</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Colegio de Psicólogos #12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Upload className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Documentos de verificación</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Después del registro inicial, te pediremos que subas copias de tu título, 
                        certificaciones y registro profesional para verificar tu perfil.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Service Details */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Detalles del Servicio
                </CardTitle>
                <CardDescription>
                  Configura tu consulta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sessionPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio por sesión (CLP)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              min={1000}
                              step={1000}
                              className="pl-10"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sessionDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración (minutos)</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(parseInt(val))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="45">45 minutos</SelectItem>
                            <SelectItem value="50">50 minutos</SelectItem>
                            <SelectItem value="60">60 minutos</SelectItem>
                            <SelectItem value="90">90 minutos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu ciudad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Santiago, Chile">Santiago</SelectItem>
                          <SelectItem value="Antofagasta, Chile">Antofagasta</SelectItem>
                          <SelectItem value="Calama, Chile">Calama</SelectItem>
                          <SelectItem value="Copiapó, Chile">Copiapó</SelectItem>
                          <SelectItem value="Iquique, Chile">Iquique</SelectItem>
                          <SelectItem value="La Serena, Chile">La Serena</SelectItem>
                          <SelectItem value="Concepción, Chile">Concepción</SelectItem>
                          <SelectItem value="Valparaíso, Chile">Valparaíso</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={() => (
                    <FormItem>
                      <FormLabel>Idiomas de atención</FormLabel>
                      <div className="flex gap-2 mt-2">
                        {['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Chino'].map((lang) => {
                          const current = form.getValues('languages') || [];
                          const isSelected = current.includes(lang);
                          return (
                            <Badge
                              key={lang}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                if (isSelected) {
                                  form.setValue('languages', current.filter(l => l !== lang));
                                } else {
                                  form.setValue('languages', [...current, lang]);
                                }
                              }}
                            >
                              {lang}
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptsMindexa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-primary/5 border-primary/20">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Acepto trabajadores MINDEXA</FormLabel>
                        <FormDescription>
                          Atenderás a trabajadores de empresas mineras con convenio MINDEXA
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 5: Terms */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Términos y Condiciones
                </CardTitle>
                <CardDescription>
                  Revisa y acepta para completar tu registro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Acepto los términos y condiciones</FormLabel>
                        <FormDescription>
                          He leído y acepto los <a href="#" className="text-primary underline">términos de servicio</a> para profesionales de MINDEXA
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacyAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Acepto la política de privacidad</FormLabel>
                        <FormDescription>
                          Autorizo el tratamiento de mis datos según la <a href="#" className="text-primary underline">política de privacidad</a>
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-green-900">¿Qué sigue?</p>
                      <ul className="text-xs text-green-700 mt-1 space-y-1">
                        <li>• Revisaremos tu solicitud en 24-48 horas</li>
                        <li>• Te contactaremos para verificar credenciales</li>
                        <li>• Una vez aprobado, tu perfil será visible en el directorio</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 1 ? 'Cancelar' : 'Anterior'}
            </Button>
            
            {step < totalSteps ? (
              <Button type="button" onClick={handleNext}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Enviar solicitud
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
