SET search_path TO public;

-- =========================
-- TABLAS
-- =========================

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    rol TEXT,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(50),
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP,
    estado TEXT DEFAULT 'ACTIVO'
);

CREATE TABLE empresa (
    id_empresa SERIAL PRIMARY KEY,
    razon_social VARCHAR(200),
    nombre_comercial VARCHAR(200),
    correo VARCHAR(150),
    sitio_web VARCHAR(200),
    telefono VARCHAR(50),
    direccion TEXT,
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table departamento_organizacion(
    id_departamento SERIAL PRIMARY KEY,
    id_empresa INT REFERENCES empresa(id_empresa),
    nombre_departamento VARCHAR(100)
);

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_empresa INT REFERENCES empresa(id_empresa),
    cargo VARCHAR(100),
    turno TEXT,
    faena VARCHAR(150),
    contratista VARCHAR(150),
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

CREATE TABLE profesional (
    id_profesional SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    titulo_profesional VARCHAR,
    biografia_profesional VARCHAR,
    descripcion_formacion_academica VARCHAR,
    numero_registro_salud INT,
    acepta_empleados_mindexa BOOLEAN,
    anos_experiencia INT,
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table paciente(
    id_paciente SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    fecha_nacimiento DATE,
    genero TEXT,
    ocupacion VARCHAR(100),
    estado_civil TEXT,
    direccion TEXT,
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table historial_paciente (
    id_historial_paciente SERIAL PRIMARY KEY,
    id_paciente INT REFERENCES paciente(id_paciente),
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table analisis_riesgo (
    id_analisis_riesgo SERIAL PRIMARY KEY,
    id_historial_paciente INT REFERENCES historial_paciente(id_historial_paciente),
    contenido TEXT,
    estado_riesgo TEXT,
    resultado_analisis TEXT,
    fecha_analisis TIMESTAMP DEFAULT now(),
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

CREATE TABLE autenticacion_usuario (
    id_autenticacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE REFERENCES usuario(id_usuario),
    contrasena_hash TEXT NOT NULL,
    estado_enum TEXT DEFAULT 'ACTIVO',
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP,
    estado TEXT DEFAULT 'ACTIVO'
);

CREATE TABLE especialidad (
    id_especialidad SERIAL PRIMARY KEY,
    nombre_especialidad VARCHAR
);

CREATE TABLE especialidad_profesional (
    id_especialidad_profesional SERIAL PRIMARY KEY,
    id_especialidad INT,
    id_profesional INT REFERENCES profesional(id_profesional)
);

CREATE TABLE enfoque_terapeutico (
    id_enfoque_terapeutico SERIAL PRIMARY KEY,
    nombre_enfoque VARCHAR
);

CREATE TABLE enfoque_terapeutico_principal (
    id_enfoque_terapeutico_principal SERIAL PRIMARY KEY,
    id_enfoque_terapeutico INT,
    id_profesional INT REFERENCES profesional(id_profesional)
);

CREATE TABLE certificaciones (
    id_certificacion SERIAL PRIMARY KEY,
    id_profesional INT REFERENCES profesional(id_profesional),
    tipo_certificacion VARCHAR,
    nombre_certificacion VARCHAR,
    fecha_obtencion DATE,
    fecha_expiracion DATE,
    institucion_emisora VARCHAR
);

CREATE TABLE idioma (
    id_idioma SERIAL PRIMARY KEY,
    idioma VARCHAR
);

CREATE TABLE profesional_idioma (
    id_profesional_idioma SERIAL PRIMARY KEY,
    id_profesional INT REFERENCES profesional(id_profesional),
    id_idioma INT,
    nivel_habilidad TEXT
);

CREATE TABLE servicio_profesional (
    id_servicio_profesional SERIAL PRIMARY KEY,
    id_profesional INT REFERENCES profesional(id_profesional),
    nombre_servicio VARCHAR,
    precio_servicio INT,
    descripcion_servicio VARCHAR,
    duracion_servicio INT
);

create table sesion_usuario (
    id_sesion_usuario SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    estado_sesion TEXT,
    sesion_abierta_en TIMESTAMP DEFAULT now(),
    sesion_cerrada_en TIMESTAMP
);




create table alerta_riesgo(
    id_alerta_riesgo SERIAL PRIMARY KEY,
    id_analisis_riesgo INT REFERENCES analisis_riesgo(id_analisis_riesgo),
    tipo_riesgo TEXT,
    descripcion_riesgo TEXT,
    fecha_alerta TIMESTAMP DEFAULT now(),
    estado_alerta TEXT DEFAULT 'ACTIVA'
);


create table notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_alerta_riesgo int references alerta_riesgo(id_alerta_riesgo),
    contenido_notificacion TEXT,
    categoria text,
    fecha_notificacion TIMESTAMP DEFAULT now(),
    leida BOOLEAN DEFAULT FALSE,
    estado_envio TEXT DEFAULT 'PENDIENTE',
    enviado_en TIMESTAMP default now()
);



create table antecedentes_paciente (
    id_antecedente SERIAL PRIMARY KEY,
    id_historial_paciente INT REFERENCES historial_paciente(id_historial_paciente),
    tipo_antecedente TEXT,
    descripcion_antecedente TEXT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);



create table disponibilidad_atencion(
    id_disponibilidad_atencion serial primary key, 
    id_profesional int references profesional(id_profesional),
    fecha_disponibilidad TIMESTAMP,
    hora_inicio TIME,
    hora_fin TIME,
    estado_disponibilidad TEXT DEFAULT 'DISPONIBLE',
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table sesion_urgencia(
    id_sesion_urgencia serial primary key,
    id_paciente int references paciente(id_paciente),
    id_servicio_profesional int references servicio_profesional(id_servicio_profesional),
    contenido_sesion TEXT,
    creado_en TIMESTAMP DEFAULT now()
);



create table agendamiento_atencion(
    id_agendamiento_atencion serial primary key, 
    id_paciente int references paciente(id_paciente),
    id_disponibilidad_atencion int references disponibilidad_atencion(id_disponibilidad_atencion),
    fecha_atencion TIMESTAMP,
    razon_atencion TEXT,
    estado TEXT DEFAULT 'PENDIENTE',
    modalidad text,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table sesion_clinica(
    id_sesion_clinica serial primary key, 
    id_servicio_profesional int references servicio_profesional(id_servicio_profesional),
    id_agendamiento_atencion int references agendamiento_atencion(id_agendamiento_atencion),
    fecha_sesion TIMESTAMP,
    empezada_en TIMESTAMP,
    terminada_en TIMESTAMP,
    estado_sesion TEXT DEFAULT 'PROGRAMADA',
    creado_en TIMESTAMP DEFAULT now()
);


create table observacion_sesion (
    id_observacion_sesion serial primary key, 
    id_sesion_clinica int references sesion_clinica(id_sesion_clinica),
    id_profesional int references profesional(id_profesional),
    observacion TEXT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);


create table comision_servicio(
    id_comision_servicio serial primary key, 
    id_agendamiento_sesion int references agendamiento_atencion(id_agendamiento_atencion),
    id_sesion_urgencia int references sesion_urgencia(id_sesion_urgencia),
    comision INT,
    creado_en TIMESTAMP DEFAULT now()
);

create table historial_sesion_clinica(
    id_historial_sesion serial primary key, 
    id_historial_paciente int  references historial_paciente(id_historial_paciente),
    id_sesion_clinica int references sesion_clinica(id_sesion_clinica),
    fecha_resultado TIMESTAMP DEFAULT now()
);

create table calificacion_profesional(
    id_calificacion_profesional serial primary key, 
    id_sesion_clinica int references sesion_clinica(id_sesion_clinica),
    id_sesion_urgencia int references sesion_urgencia(id_sesion_urgencia),
    id_paciente int references paciente(id_paciente),
    puntaje int,
    observacion text,
    creado_en TIMESTAMP DEFAULT now()
);

create table plan(
    id_plan serial primary key,
    nombre_plan VARCHAR(100),
    tipo_plan TEXT,
    descripcion_plan TEXT,
    precio_por_usuario INT,
    duracion_meses INT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table suscripcion(
    id_suscripcion serial primary key,
    id_empresa int references empresa(id_empresa),
    id_plan int references plan(id_plan),
    fecha_inicio TIMESTAMP DEFAULT now(),
    fecha_fin TIMESTAMP,
    cantidad_suscritos INT,
    precio_total INT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table estado_suscripcion(
    id_estado_suscripcion serial primary key,
    id_suscripcion int references suscripcion(id_suscripcion),
    estado text,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table paciente_suscrito(
    id_paciente_suscrito serial primary key,
    id_paciente int references paciente(id_paciente),
    id_suscripcion int references suscripcion(id_suscripcion),
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table servicio(
    id_servicio serial primary key,
    nombre_servicio VARCHAR(100),
    descripcion_servicio TEXT,
    tipo_servicio TEXT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table registro_servicios_plan(
    id_registro_servicios_plan serial primary key, 
    id_plan int references plan(id_plan),
    id_servicio int references servicio(id_servicio),
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table test(
    id_test serial primary key,
    id_servicio int references servicio(id_servicio),
    nombre_test VARCHAR(100),
    descripcion_test TEXT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
     desactivado_en TIMESTAMP
);

create table pregunta_test(
    id_pregunta_test serial primary key,
    id_test int references test(id_test),
    pregunta VARCHAR(200),
    tipo_pregunta TEXT,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
);

create table opciones_respuesta(
    id_opciones_respuesta serial primary key, 
    id_pregunta_test int references pregunta_test(id_pregunta_test),
    opcion1 VARCHAR(200),
    opcion2 VARCHAR(200),
    opcion3 VARCHAR(200),
    opcion4 VARCHAR(200)
);

create table test_paciente(
    id_test_paciente serial primary key,
    id_test int references test(id_test),
    id_paciente int references paciente(id_paciente),
    descripcion text,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP
    
);

create table respuesta_test_paciente(
    id_respuesta_test_paciente serial primary key,
    id_test_paciente int references test_paciente(id_test_paciente),
    id_pregunta_test int references pregunta_test(id_pregunta_test),
    respuesta text,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP
);

create table medicion_respuestas_test(
    id_medicion_respuestas_test serial primary key,
    id_respuesta_test_paciente int references respuesta_test_paciente(id_respuesta_test_paciente),
    puntaje_obtenido int,
    creado_en TIMESTAMP DEFAULT now()
);


create table analisis_test(
    id_analisis_test serial primary key,
    id_test_paciente int references test_paciente(id_test_paciente),
    id_respuesta_test_paciente int references respuesta_test_paciente(id_respuesta_test_paciente),
    analisis text,
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP
);

create table historial_test(
    id_historial_test serial primary key,
    id_historial_paciente int references historial_paciente(id_historial_paciente),
    id_analisis_test int references analisis_test(id_analisis_test),
    fecha_resultado TIMESTAMP DEFAULT now()
);


