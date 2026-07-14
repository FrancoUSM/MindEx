

select u.id_usuario, u.correo, u.rol, au.contrasena_hash 
from usuario u inner join 
autenticacion_usuario au on 
u.id_usuario = au.id_usuario
where u.rol = 'ADMIN'
