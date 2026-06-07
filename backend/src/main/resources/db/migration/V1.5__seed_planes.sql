-- Planes de suscripción para empresas
INSERT INTO plan (
    nombre_plan, 
    descripcion_plan, 
    tipo_plan, 
    precio_por_usuario, 
    duracion_meses, 
    creado_en, 
    actualizado_en)
SELECT * FROM (VALUES
    ('Plan Básico',
     'Acceso al check-in diario IDSM para todos tus empleados. Incluye historial de registros y alertas automáticas de riesgo alto.',
     'BASICO', 5.0, 1.0, now(), now()),
    ('Plan Profesional',
     'Todo lo del Plan Básico más evaluaciones clínicas validadas (PHQ-9, GAD-7, DASS-21, CEAL-SM), reportes mensuales y acceso al portal de profesionales.',
     'PROFESIONAL', 12.0, 3.0, now(), now()),
    ('Plan Enterprise',
     'Solución completa para empresas grandes. Incluye todos los módulos, soporte prioritario 24/7, integración con RRHH y dashboard ejecutivo personalizado.',
     'ENTERPRISE', 20.0, 12.0, now(), now())
) AS v(
    nombre_plan, 
    descripcion_plan, 
    tipo_plan, 
    precio_por_usuario, 
    duracion_meses, 
    creado_en, 
    actualizado_en)
WHERE NOT EXISTS (SELECT 1 FROM plan WHERE tipo_plan = v.tipo_plan);
