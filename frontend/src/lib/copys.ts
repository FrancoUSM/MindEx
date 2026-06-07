// Banco de 100 Copys - MINDEXA
// Mensajes rotativos para diferentes situaciones

// A. POST CHECK-IN (CIERRE DIARIO) - validan la acción, generan alivio y cierre
export const POST_CHECKIN_COPYS = [
  "Listo. Hoy te diste un momento para ti.",
  "Hecho. Detenerte también es cuidarte.",
  "Gracias por registrar cómo estás hoy.",
  "Un minuto para ti hace la diferencia.",
  "Cumplido. Hoy te ocupaste de ti.",
  "Registro completado. Buen paso.",
  "Hoy elegiste cuidarte. Eso suma.",
  "Hecho por hoy. Sigue a tu ritmo.",
  "Gracias por estar presente contigo.",
  "Listo. Tu cuidado también cuenta.",
  "Un pequeño gesto, buen impacto.",
  "Registrar también es avanzar.",
  "Hoy sumaste cuidado a tu día.",
  "Hecho. Sin juicio, sin presión.",
  "Buen momento para detenerte.",
  "Hoy te escuchaste. Eso importa.",
  "Registro listo. Seguimos mañana.",
  "Gracias por decir cómo estás.",
  "Un paso más en tu cuidado diario.",
  "Hecho. Aquí seguimos contigo.",
];

// B. PUNTOS / MICRO-RECOMPENSA - dopamina suave, progreso sin competencia
export const POINTS_COPYS = [
  "+10 puntos por cuidar tu estado hoy.",
  "Sumaste puntos por estar presente.",
  "Tu cuidado sigue sumando.",
  "Cada registro cuenta.",
  "Hoy también avanzaste.",
  "Puntos que reflejan constancia.",
  "Buen hábito en construcción.",
  "Tu compromiso suma.",
  "Cuidarte deja huella.",
  "Avance registrado.",
  "Puntos por cuidarte, nada más.",
  "Hoy aportaste a tu estabilidad.",
  "Constancia que se acumula.",
  "Paso a paso, se nota.",
  "Hoy sumaste cuidado.",
];

// C. BARRA DE PROGRESO / CONSTANCIA - sensación de continuidad
export const PROGRESS_COPYS = [
  "Tu constancia se construye día a día.",
  "El cuidado sostenido marca la diferencia.",
  "Vas creando un buen ritmo.",
  "Pequeños pasos, proceso real.",
  "Tu seguimiento sigue activo.",
  "La continuidad también protege.",
  "Cuidarte es un proceso, no un evento.",
  "Buen avance en tu constancia.",
  "Tu ritmo se mantiene.",
  "Esto se construye con tiempo.",
  "Cada día suma estabilidad.",
  "Sigues presente contigo.",
  "Progreso silencioso, pero real.",
  "Buen hábito en marcha.",
  "La constancia se nota.",
];

// D. RACHA / HITOS - identidad, sin euforia
export const STREAK_COPYS = [
  "Buen inicio, sigue a tu ritmo.",
  "Vas tomando el hábito.",
  "Constancia real.",
  "Estás sosteniendo el cuidado.",
  "Buen ritmo sostenido.",
  "Cuidarte ya es parte del día.",
  "Semana completa registrando tu estado.",
  "Buen compromiso contigo.",
  "La regularidad importa.",
  "Sigues presente, sin apuro.",
  "Este hábito te acompaña.",
  "Mantener también es cuidarse.",
  "Buen proceso en marcha.",
  "Lo estás sosteniendo.",
  "Tu constancia habla por ti.",
];

// E. RESULTADO VERDE - estabilidad sin complacencia
export const GREEN_RESULT_COPYS = [
  "Hoy tu estado se mantiene estable.",
  "Buen equilibrio para esta jornada.",
  "Mantener también es cuidarse.",
  "Tu estado está dentro de un buen rango.",
  "Sigue observándote con calma.",
  "Buen punto de estabilidad hoy.",
  "El equilibrio también se construye.",
  "Hoy hay buen sostén.",
  "Registrar ayuda a mantener.",
  "Buen momento para seguir atento.",
];

// F. RESULTADO AMARILLO - prevención sin alarma
export const YELLOW_RESULT_COPYS = [
  "Hoy aparecen señales de carga.",
  "Estar atento ya es prevención.",
  "Registrar esto es importante.",
  "Gracias por notarlo a tiempo.",
  "Hoy el día se siente más pesado.",
  "Observarlo ayuda a cuidarte.",
  "La carga también se puede regular.",
  "Buen momento para escucharte.",
  "Esto merece atención, sin apuro.",
  "Seguir registrando es clave.",
];

// G. RESULTADO NARANJA / ROJO - contención y apoyo, no miedo
export const ALERT_RESULT_COPYS = [
  "Hoy el día está más exigente.",
  "No tienes que manejarlo solo/a.",
  "Detenerte aquí es importante.",
  "Pedir apoyo también es cuidarte.",
  "Estamos aquí para acompañarte.",
  "Gracias por decir cómo estás.",
  "Buscar ayuda es una buena decisión.",
  "Tu bienestar importa ahora.",
  "Podemos apoyarte si lo necesitas.",
  "Esto no tienes que cargarlo solo/a.",
];

// H. RETORNO / AUSENCIA / PUSH SUAVE - sin culpa
export const RETURN_COPYS = [
  "Aquí seguimos, a tu ritmo.",
  "Cuando quieras, retomamos.",
  "Qué bueno verte de nuevo.",
  "Retomar también es avanzar.",
  "MINDEXA está aquí para ti.",
];

// Mensajes de notificación push
export const PUSH_MESSAGES = {
  DAILY_REMINDER: "¿Te tomas un minuto para ver cómo estás hoy?",
  SOFT_REMINDER: "Cuando quieras, MINDEXA está aquí.",
  CONTINUITY_PUSH: "Cuidarte no es una obligación. Es un apoyo.",
  POSITIVE_STREAK: "Buen hábito. Hoy puedes continuar tu registro.",
};

// Mensaje de cierre universal (siempre aparece después del check-in)
export const CLOSING_MESSAGE = {
  main: "Listo. Gracias por detenerte un momento.",
  secondary: "Registrar cómo estás también es una forma de cuidarte.",
  cta: "Ver mi estado de hoy",
};

// Función para obtener un copy aleatorio de una categoría
export const getRandomCopy = (category: string[]): string => {
  const randomIndex = Math.floor(Math.random() * category.length);
  return category[randomIndex];
};

// Función para obtener copy según el nivel de resultado
export const getResultCopy = (level: 'green' | 'yellow' | 'orange' | 'red'): string => {
  switch (level) {
    case 'green':
      return getRandomCopy(GREEN_RESULT_COPYS);
    case 'yellow':
      return getRandomCopy(YELLOW_RESULT_COPYS);
    case 'orange':
    case 'red':
      return getRandomCopy(ALERT_RESULT_COPYS);
    default:
      return getRandomCopy(POST_CHECKIN_COPYS);
  }
};
