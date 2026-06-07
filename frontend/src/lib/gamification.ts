// Sistema de Gamificación MINDEXA
// Puntos, rachas, insignias y mensajes

export interface UserProgress {
  points: number;
  streak: number;
  lastCheckinDate: string | null;
  badges: Badge[];
  totalCheckins: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// Configuración de puntos
export const POINTS_CONFIG = {
  DAILY_CHECKIN: 10,
  STREAK_3_DAYS: 10,
  STREAK_5_DAYS: 20,
  STREAK_7_DAYS: 30,
  RETURN_AFTER_PAUSE: 15,
};

// Insignias disponibles
export const BADGES: Record<string, Omit<Badge, 'unlockedAt'>> = {
  FIRST_CHECKIN: {
    id: 'first_checkin',
    name: 'Primer registro',
    description: 'Comenzar también cuenta',
    icon: '🌱',
  },
  STREAK_3: {
    id: 'streak_3',
    name: '3 días cuidándote',
    description: 'Buen inicio',
    icon: '🌿',
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Semana de cuidado',
    description: '7 días de constancia',
    icon: '🌳',
  },
  STREAK_14: {
    id: 'streak_14',
    name: 'Constancia sostenida',
    description: '14 días de cuidado',
    icon: '🏆',
  },
  RETURN: {
    id: 'return',
    name: 'Volver a registrarte',
    description: 'Retomar también es avanzar',
    icon: '🔄',
  },
  MONTHLY: {
    id: 'monthly',
    name: 'Constancia mensual',
    description: 'Seguimiento sostenido',
    icon: '⭐',
  },
};

// Niveles de resultado según puntaje
export type ResultLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface ResultConfig {
  level: ResultLevel;
  color: string;
  bgColor: string;
  borderColor: string;
  title: string;
  message: string;
  microReinforce: string;
  implicitMessage: string;
  showSupport: boolean;
  urgent: boolean;
}

// Rangos fijos RHI según documentación IDSM-MINDEXA Plus (rango 8-48)
export const getResultLevel = (score: number, _maxScore: number): ResultLevel => {
  if (score <= 22) return 'green';
  if (score <= 30) return 'yellow';
  if (score <= 38) return 'orange';
  return 'red';
};

export interface IDSMFlags {
  somnolenciaCritica: boolean;   // P4 >= 5
  estresDesregulado: boolean;    // P2 >= 5 AND P7 <= 2
  convergenciaCritica: boolean;  // P2 >= 5 AND P4 >= 5
}

export const evaluateFlags = (p2: number, p4: number, p7: number): IDSMFlags => ({
  somnolenciaCritica: p4 >= 5,
  estresDesregulado: p2 >= 5 && p7 <= 2,
  convergenciaCritica: p2 >= 5 && p4 >= 5,
});

export const applyFlags = (baseLevel: ResultLevel, flags: IDSMFlags): ResultLevel => {
  if (flags.convergenciaCritica) return 'red';
  if (flags.somnolenciaCritica && (baseLevel === 'green' || baseLevel === 'yellow')) return 'orange';
  return baseLevel;
};

export const RESULT_CONFIGS: Record<ResultLevel, ResultConfig> = {
  green: {
    level: 'green',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    title: 'Estabilidad Adecuada',
    message: 'Hoy tu estado se mantiene estable. Seguir registrándote ayuda a sostener este equilibrio.',
    microReinforce: 'Buen hábito. Sigue así.',
    implicitMessage: 'Vas bien, no te relajes del cuidado',
    showSupport: false,
    urgent: false,
  },
  yellow: {
    level: 'yellow',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    title: 'Señales de Carga',
    message: 'Hoy aparecen señales de cansancio o carga. Estar atento a esto a tiempo también es prevención.',
    microReinforce: 'Gracias por registrarlo hoy.',
    implicitMessage: 'No es grave, pero es importante mirarlo',
    showSupport: false,
    urgent: false,
  },
  orange: {
    level: 'orange',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    title: 'Alerta de Sobrecarga',
    message: 'Hoy tu estado está más exigido de lo habitual. No tienes que manejarlo solo/a.',
    microReinforce: 'Podemos acompañarte si lo necesitas.',
    implicitMessage: 'Esto importa, y hay ayuda disponible',
    showSupport: true,
    urgent: false,
  },
  red: {
    level: 'red',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    title: 'Alerta Alta',
    message: 'Hoy detectamos una carga importante. Creemos que es importante apoyarte ahora.',
    microReinforce: 'Un profesional puede contactarte de forma confidencial.',
    implicitMessage: 'No estás solo/a, esto es cuidado',
    showSupport: true,
    urgent: true,
  },
};

// Mensajes de racha
export const STREAK_MESSAGES: Record<number, { title: string; message: string; micro: string }> = {
  3: {
    title: 'Buen comienzo',
    message: 'Te has detenido a observar cómo estás durante 3 días seguidos.',
    micro: 'La constancia hace la diferencia.',
  },
  5: {
    title: 'Vas creando un buen hábito',
    message: '5 días registrando tu estado.',
    micro: 'Cuidarte también es parte del trabajo.',
  },
  7: {
    title: 'Constancia real',
    message: 'Una semana completa cuidando tu estado.',
    micro: 'Esto fortalece tu estabilidad en el tiempo.',
  },
  14: {
    title: 'Buen ritmo sostenido',
    message: 'Dos semanas observándote con atención.',
    micro: 'MINDEXA acompaña este proceso contigo.',
  },
};

// Calcula el progreso de la barra (0-100)
export const calculateProgressBar = (totalCheckins: number, streak: number): number => {
  // La barra se llena de forma progresiva
  // Cada check-in suma aproximadamente 1-2%
  // La racha actual da un boost adicional
  const baseProgress = Math.min(totalCheckins * 1.5, 70);
  const streakBonus = Math.min(streak * 3, 30);
  return Math.min(baseProgress + streakBonus, 100);
};

// Obtiene los puntos ganados en una sesión
export const calculateSessionPoints = (
  isFirstCheckin: boolean,
  currentStreak: number,
  daysAbsent: number
): { basePoints: number; bonusPoints: number; bonusReason: string | null } => {
  let basePoints = POINTS_CONFIG.DAILY_CHECKIN;
  let bonusPoints = 0;
  let bonusReason: string | null = null;

  // Bonus por retornar después de ausencia
  if (daysAbsent >= 3) {
    bonusPoints = POINTS_CONFIG.RETURN_AFTER_PAUSE;
    bonusReason = 'Volver también es cuidarte';
  }
  // Bonus por racha
  else if (currentStreak === 3) {
    bonusPoints = POINTS_CONFIG.STREAK_3_DAYS;
    bonusReason = '3 días seguidos';
  } else if (currentStreak === 5) {
    bonusPoints = POINTS_CONFIG.STREAK_5_DAYS;
    bonusReason = '5 días seguidos';
  } else if (currentStreak === 7) {
    bonusPoints = POINTS_CONFIG.STREAK_7_DAYS;
    bonusReason = '7 días seguidos';
  }

  return { basePoints, bonusPoints, bonusReason };
};
