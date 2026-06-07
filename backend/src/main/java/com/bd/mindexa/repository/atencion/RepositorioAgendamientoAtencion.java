package com.bd.mindexa.repository.atencion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.usuario.Paciente;

public interface RepositorioAgendamientoAtencion extends JpaRepository<AgendamientoAtencion, Integer>{
Optional<AgendamientoAtencion> findById(int id_agendamiento_atencion);

@Query("SELECT a FROM AgendamientoAtencion a WHERE a.paciente = :paciente ORDER BY a.fecha_atencion ASC")
List<AgendamientoAtencion> findByPaciente(@Param("paciente") Paciente paciente);

@Query("SELECT a FROM AgendamientoAtencion a WHERE a.disponibilidadAtencion.profesional.id_profesional = :id ORDER BY a.fecha_atencion ASC")
List<AgendamientoAtencion> findByIdProfesional(@Param("id") int id_profesional);
}
