package com.bd.mindexa.repository.atencion;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.atencion.DisponibilidadAtencion;

public interface RepositorioDisponibilidadAtencion extends JpaRepository<DisponibilidadAtencion,Integer> {
Optional<DisponibilidadAtencion> findById(int id_disponibilidad_atencion);

List<DisponibilidadAtencion> findByProfesional(com.bd.mindexa.models.usuario.Profesional profesional);

}
