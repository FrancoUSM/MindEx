package com.bd.mindexa.repository.notificacion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.models.usuario.paciente.Notificaciones;

public interface RepositorioNotificacion extends JpaRepository<Notificaciones, Integer> {
    Optional<Notificaciones> findById(int id_notificacion);

    @Query("SELECT n FROM Notificaciones n WHERE n.usuario.idUsuario = :id AND n.estado_envio <> :estado ORDER BY n.creado_en DESC")
    List<Notificaciones> findPendientesByUsuario(@Param("id") int idUsuario, @Param("estado") Notificaciones.EstadoEnvio estado);
}
