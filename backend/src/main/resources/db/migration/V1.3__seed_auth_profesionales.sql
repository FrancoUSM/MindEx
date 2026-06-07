-- Credenciales de prueba para los 5 profesionales del seed
-- Contraseña para todos: mindexa123
-- Hash argon2i generado con: time_cost=2, memory_cost=65536, parallelism=1

INSERT INTO autenticacion_usuario (id_usuario, contrasena_hash, estado, creado_en, actualizado_en)
SELECT id_usuario,
       '$argon2i$v=19$m=65536,t=2,p=1$bWluZGV4YV9zYWx0XzAxIQ$H8f0T2R23+dAImp7VpTPGaRyEpQkJmnW2f0HeYW3+UE',
       'ACTIVO',
       now(),
       now()
FROM usuario
WHERE correo IN (
    'ana1@mail.com',
    'luis2@mail.com',
    'carla3@mail.com',
    'pedro4@mail.com',
    'maria5@mail.com'
)
AND NOT EXISTS (
    SELECT 1 FROM autenticacion_usuario au WHERE au.id_usuario = usuario.id_usuario
);
