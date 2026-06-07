// Tipos y datos mock para el Portal de Profesionales MINDEXA

export interface Professional {
  id: string;
  backendId?: number;
  name: string;
  title: string; // Psicólogo, Psiquiatra
  specialties: string[];
  approach: string; // TCC, Psicoanálisis, etc.
  bio: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  price: number;
  currency: string;
  sessionDuration: number; // minutos
  location: string;
  languages: string[];
  experience: number; // años
  education: string[];
  certifications: string[];
  availability: AvailabilitySlot[];
  verified: boolean;
  acceptsMindexa: boolean; // Acepta trabajadores de empresas mineras
  matchScore?: number; // Score de compatibilidad IA
  alertsData?: ProfessionalAlertsData;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6
  startTime: string; // "09:00"
  endTime: string; // "18:00"
}

export interface ProfessionalAlertsData {
  pendingAlerts: number;
  redAlerts: number;
  orangeAlerts: number;
  patientsAtRisk: number;
}

export interface Appointment {
  id: string;
  professionalId: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'presencial' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
  checkinData?: PatientCheckinData;
}

export interface PatientCheckinData {
  lastScore: number;
  trend: 'improving' | 'stable' | 'declining';
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  streak: number;
  lastCheckin: string;
  alerts: string[];
}

export interface ClinicalNote {
  id: string;
  appointmentId: string;
  professionalId: string;
  patientId: string;
  date: string;
  content: string;
  aiSummary?: string;
  aiTranscript?: string;
  mood?: string;
  planFollowUp?: string;
}

// Especialidades disponibles
export const SPECIALTIES = [
  'Ansiedad',
  'Depresión',
  'Estrés laboral',
  'Burnout',
  'Trauma',
  'Trastornos del sueño',
  'Adicciones',
  'Relaciones',
  'Duelo',
  'TDAH',
  'TOC',
  'Fobias',
  'Crisis',
  'Salud ocupacional',
];

// Enfoques terapéuticos
export const APPROACHES = [
  'Terapia Cognitivo-Conductual (TCC)',
  'Psicoanálisis',
  'Terapia Humanista',
  'Terapia Sistémica',
  'Mindfulness',
  'EMDR',
  'ACT (Aceptación y Compromiso)',
  'Terapia Breve',
  'Gestalt',
  'Psicodinámica',
];

// Mock de profesionales
export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-001',
    name: 'Dra. María González Ruiz',
    title: 'Psicóloga Clínica',
    specialties: ['Estrés laboral', 'Burnout', 'Ansiedad', 'Salud ocupacional'],
    approach: 'Terapia Cognitivo-Conductual (TCC)',
    bio: 'Especialista en salud mental ocupacional con 12 años de experiencia en la industria minera. Mi enfoque integra técnicas basadas en evidencia para abordar el estrés laboral y prevenir el burnout.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    rating: 4.9,
    reviewsCount: 127,
    price: 45000,
    currency: 'CLP',
    sessionDuration: 50,
    location: 'Santiago, Chile',
    languages: ['Español', 'Inglés'],
    experience: 12,
    education: ['Psicología, Universidad de Chile', 'Magíster en Psicología Clínica, PUC'],
    certifications: ['Especialista en Salud Ocupacional', 'Certificación TCC'],
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '14:00' },
    ],
    verified: true,
    acceptsMindexa: true,
    matchScore: 95,
    alertsData: {
      pendingAlerts: 3,
      redAlerts: 1,
      orangeAlerts: 2,
      patientsAtRisk: 4,
    },
  },
  {
    id: 'prof-002',
    name: 'Dr. Carlos Mendoza Pérez',
    title: 'Psiquiatra',
    specialties: ['Depresión', 'Ansiedad', 'Trastornos del sueño', 'Crisis'],
    approach: 'Psicofarmacología + Psicoterapia',
    bio: 'Psiquiatra con enfoque integral que combina tratamiento farmacológico con psicoterapia. Experiencia en atención de crisis y trastornos del ánimo en contextos de alta demanda.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    rating: 4.8,
    reviewsCount: 89,
    price: 65000,
    currency: 'CLP',
    sessionDuration: 45,
    location: 'Antofagasta, Chile',
    languages: ['Español'],
    experience: 15,
    education: ['Medicina, Universidad de Antofagasta', 'Especialidad en Psiquiatría, Universidad de Chile'],
    certifications: ['Psiquiatra certificado CONACEM', 'Especialista en Medicina del Sueño'],
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '19:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '19:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '15:00' },
    ],
    verified: true,
    acceptsMindexa: true,
    matchScore: 88,
    alertsData: {
      pendingAlerts: 5,
      redAlerts: 2,
      orangeAlerts: 3,
      patientsAtRisk: 6,
    },
  },
  {
    id: 'prof-003',
    name: 'Ps. Andrea Soto Fuentes',
    title: 'Psicóloga Organizacional',
    specialties: ['Burnout', 'Estrés laboral', 'Relaciones', 'TDAH'],
    approach: 'ACT (Aceptación y Compromiso)',
    bio: 'Psicóloga especializada en bienestar organizacional y desarrollo personal. Trabajo con profesionales en roles de alta presión para construir resiliencia y equilibrio vida-trabajo.',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
    rating: 4.7,
    reviewsCount: 64,
    price: 38000,
    currency: 'CLP',
    sessionDuration: 60,
    location: 'Copiapó, Chile',
    languages: ['Español', 'Portugués'],
    experience: 8,
    education: ['Psicología, Universidad de La Serena', 'Diplomado en Psicología Organizacional'],
    certifications: ['Certificación ACT', 'Coach Certificada ICF'],
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' },
    ],
    verified: true,
    acceptsMindexa: true,
    matchScore: 82,
  },
  {
    id: 'prof-004',
    name: 'Dr. Roberto Vásquez Lagos',
    title: 'Psicólogo Clínico',
    specialties: ['Trauma', 'EMDR', 'Ansiedad', 'Fobias'],
    approach: 'EMDR',
    bio: 'Especialista en trauma y EMDR. He trabajado con equipos de emergencia y personal expuesto a situaciones de alto riesgo. Mi objetivo es ayudarte a procesar experiencias difíciles.',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face',
    rating: 4.9,
    reviewsCount: 112,
    price: 50000,
    currency: 'CLP',
    sessionDuration: 60,
    location: 'Calama, Chile',
    languages: ['Español', 'Inglés'],
    experience: 10,
    education: ['Psicología, Universidad Diego Portales', 'Magíster en Trauma, Universidad Alberto Hurtado'],
    certifications: ['EMDR Europe', 'Especialista en Trauma Complejo'],
    availability: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
    ],
    verified: true,
    acceptsMindexa: true,
    matchScore: 91,
  },
  {
    id: 'prof-005',
    name: 'Ps. Valentina Herrera Campos',
    title: 'Psicóloga Clínica',
    specialties: ['Depresión', 'Duelo', 'Relaciones', 'Adicciones'],
    approach: 'Terapia Humanista',
    bio: 'Creo en un enfoque cálido y centrado en la persona. Acompaño procesos de duelo, transiciones de vida y dificultades emocionales con empatía y respeto por tu ritmo.',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=face',
    rating: 4.6,
    reviewsCount: 45,
    price: 35000,
    currency: 'CLP',
    sessionDuration: 50,
    location: 'Iquique, Chile',
    languages: ['Español'],
    experience: 6,
    education: ['Psicología, Universidad Católica del Norte'],
    certifications: ['Terapia Gestalt', 'Counseling Humanista'],
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
    ],
    verified: true,
    acceptsMindexa: false,
    matchScore: 76,
  },
];

// Mock de citas para el profesional
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    professionalId: 'prof-001',
    patientName: 'Juan Pérez M.',
    patientId: 'patient-001',
    date: '2026-01-21',
    time: '10:00',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    checkinData: {
      lastScore: 28,
      trend: 'declining',
      riskLevel: 'orange',
      streak: 3,
      lastCheckin: '2026-01-20',
      alerts: ['Score descendiendo 15% última semana', 'Reporta problemas de sueño'],
    },
  },
  {
    id: 'apt-002',
    professionalId: 'prof-001',
    patientName: 'María López S.',
    patientId: 'patient-002',
    date: '2026-01-21',
    time: '11:00',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    checkinData: {
      lastScore: 42,
      trend: 'stable',
      riskLevel: 'green',
      streak: 12,
      lastCheckin: '2026-01-21',
      alerts: [],
    },
  },
  {
    id: 'apt-003',
    professionalId: 'prof-001',
    patientName: 'Carlos Gutiérrez R.',
    patientId: 'patient-003',
    date: '2026-01-21',
    time: '14:00',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    checkinData: {
      lastScore: 18,
      trend: 'declining',
      riskLevel: 'red',
      streak: 0,
      lastCheckin: '2026-01-18',
      alerts: ['ALERTA ROJA: Score crítico', 'Sin check-in hace 3 días', 'Ideación pasiva detectada'],
    },
  },
  {
    id: 'apt-004',
    professionalId: 'prof-001',
    patientName: 'Ana Fernández P.',
    patientId: 'patient-004',
    date: '2026-01-22',
    time: '09:00',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    checkinData: {
      lastScore: 32,
      trend: 'improving',
      riskLevel: 'yellow',
      streak: 7,
      lastCheckin: '2026-01-21',
      alerts: ['Mejorando desde última sesión'],
    },
  },
];

// Mock de notas clínicas
export const MOCK_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'note-001',
    appointmentId: 'apt-prev-001',
    professionalId: 'prof-001',
    patientId: 'patient-001',
    date: '2026-01-14',
    content: 'Paciente reporta aumento de estrés debido a cambio de turno. Dificultad para dormir. Se trabajó técnicas de higiene del sueño y respiración.',
    aiSummary: 'Estrés por cambio turno + insomnio. Plan: técnicas sueño + seguimiento próxima semana.',
    mood: 'Ansioso pero colaborador',
    planFollowUp: 'Evaluar calidad de sueño en próxima sesión',
  },
];

// Adaptador: convierte respuesta del backend al tipo Professional
interface BackendProfesional {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  biografia: string | null;
  formacion_academica: string | null;
  anos_experiencia: number;
  acepta_mindexa: boolean;
  especialidades: string[];
  idiomas: string[];
  precio: number | null;
  duracion: number | null;
  tipo_servicio: string | null;
}

export const adaptBackendProfesional = (b: BackendProfesional): Professional => ({
  id: `prof-${b.id}`,
  backendId: b.id,
  name: `${b.nombre} ${b.apellido}`,
  title: b.especialidades.length > 0 ? b.especialidades[0] : 'Profesional de Salud Mental',
  specialties: b.especialidades,
  approach: b.tipo_servicio ?? 'Terapia Integrativa',
  bio: b.biografia ?? '',
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.nombre + ' ' + b.apellido)}&background=random&size=200`,
  rating: 0,
  reviewsCount: 0,
  price: b.precio ?? 0,
  currency: 'CLP',
  sessionDuration: b.duracion ?? 50,
  location: 'Chile',
  languages: b.idiomas.length > 0 ? b.idiomas : ['Español'],
  experience: b.anos_experiencia,
  education: b.formacion_academica ? [b.formacion_academica] : [],
  certifications: [],
  availability: [],
  verified: true,
  acceptsMindexa: b.acepta_mindexa,
  matchScore: 70,
});

export const fetchProfesionales = async (): Promise<Professional[]> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profesional/lista`);
    if (!res.ok) throw new Error('API error');
    const data: BackendProfesional[] = await res.json();
    if (data.length === 0) return MOCK_PROFESSIONALS;
    return data.map(adaptBackendProfesional);
  } catch {
    return MOCK_PROFESSIONALS;
  }
};

// Función para formatear precio
export const formatPrice = (price: number, currency: string): string => {
  if (currency === 'CLP') {
    return `$${price.toLocaleString('es-CL')}`;
  }
  return `${currency} ${price}`;
};

// Función para calcular match score basado en necesidades del usuario
export const calculateMatchScore = (professional: Professional, userNeeds: string[]): number => {
  let score = 50; // Base score
  
  // Match de especialidades
  const matchingSpecialties = professional.specialties.filter(s => 
    userNeeds.some(need => s.toLowerCase().includes(need.toLowerCase()))
  );
  score += matchingSpecialties.length * 10;
  
  // Bonus por rating
  score += (professional.rating - 4) * 10;
  
  // Bonus por verificación
  if (professional.verified) score += 5;
  
  // Bonus por experiencia
  score += Math.min(professional.experience, 10);
  
  return Math.min(Math.round(score), 100);
};
