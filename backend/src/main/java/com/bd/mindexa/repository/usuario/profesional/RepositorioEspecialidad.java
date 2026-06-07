package com.bd.mindexa.repository.usuario.profesional;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.profesional.Especialidad;

public interface RepositorioEspecialidad extends JpaRepository<Especialidad, Integer>{
    Optional<Especialidad> findByNombreEspecialidad(String nombreEspecialidad);
}
