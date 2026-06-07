-- Usuario regular de prueba
-- Email: test@mindexa.com | Contraseña: usuario123
-- Hash argon2i generado con: time_cost=2, memory_cost=65536, parallelism=1

INSERT INTO usuario (nombre, apellido, rol, correo, telefono, creado_en, actualizado_en, estado)
SELECT 'Usuario', 'Prueba', 'USER', 'test@mindexa.com', '999999999', now(), now(), 'ACTIVO'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo = 'test@mindexa.com');

INSERT INTO autenticacion_usuario (id_usuario, contrasena_hash, estado, creado_en, actualizado_en)
SELECT id_usuario,
       '$argon2i$v=19$m=65536,t=2,p=1$bWluZGV4YV9zYWx0XzAyIQ$mA4vzwo3VtHQox9qwNBIgcQsHdy+nD9cTMmeQAE6KNU',
       'ACTIVO',
       now(),
       now()
FROM usuario
WHERE correo = 'test@mindexa.com'
AND NOT EXISTS (
    SELECT 1 FROM autenticacion_usuario au WHERE au.id_usuario = usuario.id_usuario
);
