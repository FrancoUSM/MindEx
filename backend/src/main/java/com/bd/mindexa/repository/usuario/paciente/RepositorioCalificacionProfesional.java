package com.bd.mindexa.repository.usuario.paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.CalificacionProfesional;

public interface RepositorioCalificacionProfesional extends JpaRepository<CalificacionProfesional,Integer> {
Optional<CalificacionProfesional> findById(int id_calificacion_profesional);
}
