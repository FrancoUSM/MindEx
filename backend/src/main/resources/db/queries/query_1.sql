

/*
select sum(p.precio_por_usuario) from plan p 
inner join suscripcion s on p.id_plan = s.id_plan 
inner join paciente_suscrito us on s.id_suscripcion = us.id_suscripcion 
inner join empresa e on s.id_empresa = e.id_empresa; */

--select * from servicio;
--insert into servicio (nombre_servicio, descripcion_servicio) values ('Servicio de examen', 'Este es un servicio de test');
--select * from administrador;
select * from usuario;
