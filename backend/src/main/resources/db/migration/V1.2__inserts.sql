INSERT INTO usuario (nombre, apellido, rol, correo, telefono, creado_en, actualizado_en, estado)
VALUES
('Ana', 'Pérez', 'PROFESIONAL', 'ana1@mail.com', '111111111', now(), now(), 'ACTIVO'),
('Luis', 'Gómez', 'PROFESIONAL', 'luis2@mail.com', '222222222', now(), now(), 'ACTIVO'),
('Carla', 'Soto', 'PROFESIONAL', 'carla3@mail.com', '333333333', now(), now(), 'ACTIVO'),
('Pedro', 'Rojas', 'PROFESIONAL', 'pedro4@mail.com', '444444444', now(), now(), 'ACTIVO'),
('María', 'Díaz', 'PROFESIONAL', 'maria5@mail.com', '555555555', now(), now(), 'ACTIVO');


INSERT INTO especialidad (nombre_especialidad)
VALUES
  ('Ansiedad'),
  ('Depresión'),
  ('Estrés laboral'),
  ('Burnout'),
  ('Trauma'),
  ('Trastornos del sueño'),
  ('Adicciones'),
  ('Relaciones'),
  ('Duelo'),
  ('TDAH'),
  ('TOC'),
  ('Fobias'),
  ('Crisis'),
  ('Salud ocupacional');


INSERT INTO enfoque_terapeutico (nombre_enfoque)
VALUES
  ('Terapia Cognitivo-Conductual (TCC)'),
  ('Psicoanálisis'),
  ('Terapia Humanista'),
  ('Terapia Sistémica'),
  ('Mindfulness'),
  ('EMDR'),
  ('ACT (Aceptación y Compromiso)'),
  ('Terapia Breve'),
  ('Gestalt'),
  ('Psicodinámica');


INSERT INTO profesional (
    id_usuario,
    titulo_profesional,
    biografia_profesional,
    descripcion_formacion_academica,
    numero_registro_salud,
    acepta_empleados_mindexa,
    anos_experiencia
)
VALUES
(1, 'Psicóloga', 'Especialista en ansiedad', 'Universidad A', 1001, true, 5),
(2, 'Psicólogo', 'Especialista en trauma', 'Universidad B', 1002, true, 8),
(3, 'Terapeuta', 'Enfoque cognitivo', 'Universidad C', 1003, true, 3),
(4, 'Psicóloga', 'Salud ocupacional', 'Universidad D', 1004, false, 10),
(5, 'Psicólogo', 'Terapia sistémica', 'Universidad E', 1005, true, 7);


INSERT INTO especialidad_profesional (id_especialidad, id_profesional)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);


INSERT INTO enfoque_terapeutico_principal (id_enfoque_terapeutico, id_profesional)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO certificaciones (
    id_profesional,
    tipo_certificacion,
    nombre_certificacion,
    fecha_obtencion,
    fecha_expiracion,
    institucion_emisora
)
VALUES
(1, 'Diplomado', 'TCC Avanzada', '2022-01-10', '2027-01-10', 'Universidad A'),
(2, 'Magíster', 'Trauma Clínico', '2021-06-15', '2026-06-15', 'Universidad B'),
(3, 'Curso', 'Mindfulness Aplicado', '2023-03-20', NULL, 'Instituto C'),
(4, 'Diplomado', 'Salud Ocupacional', '2020-09-01', '2025-09-01', 'Instituto D'),
(5, 'Magíster', 'Terapia Sistémica', '2019-11-11', '2024-11-11', 'Universidad E');


INSERT INTO idioma (idioma)
VALUES
('Español'),
('Inglés'),
('Portugués'),
('Francés'),
('Italiano');


INSERT INTO profesional_idioma (id_profesional, id_idioma, nivel_habilidad)
VALUES
(1, 1, 'NATIVO'),
(1, 2, 'AVANZADO'),
(2, 1, 'NATIVO'),
(3, 1, 'NATIVO'),
(4, 3, 'INTERMEDIO');

INSERT INTO servicio_profesional (
    id_profesional,
    nombre_servicio,
    precio_servicio,
    descripcion_servicio,
    duracion_servicio
)VALUES
(1, 'Terapia Individual', 30000, 'Sesión individual', 60),
(2, 'Terapia Trauma', 45000, 'Tratamiento trauma', 60),
(3, 'Mindfulness', 25000, 'Sesiones de mindfulness', 45),
(4, 'Salud laboral', 40000, 'Consultoría empresas', 60),
(5, 'Terapia Familiar', 50000, 'Sesión familiar', 90);


INSERT INTO EMPRESA 
(razon_social, 
nombre_comercial, 
correo, 
sitio_web, 
telefono, 
direccion
)VALUES
('Empresa', 'Empresa', 'empresa@gmail.com', 'www.empresa.com', '99999999', 'Empresa direccion'),
('Empresa1', 'Empresa1', 'empresa1@gmail.com', 'www.empresa1.com', '99999991', 'Empresa1 direccion');
