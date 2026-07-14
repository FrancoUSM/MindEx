CREATE TABLE administrador (
    id_administrador SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP,
    desactivado_en TIMESTAMP
    
);


INSERT INTO USUARIO(id_usuario, nombre, apellido, correo, telefono, creado_en, 
actualizado_en, rol, estado) 
VALUES 
(900, 
'Admin', 
'Admin', 
'admin900@gmail.com', 
'1234567890', 
NOW(), 
NOW(), 
'ADMINISTRADOR', 
'ACTIVO');
INSERT INTO administrador(id_usuario, creado_en, actualizado_en) VALUES (900, NOW(), NOW());


SELECT * FROM administrador;