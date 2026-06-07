package com.bd.mindexa.repository.usuario.profesional;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;

public interface RepositorioServicioProfesional extends JpaRepository<ServicioProfesional, Integer>{
Optional<ServicioProfesional> findByNombreServicio(String nombreServicio);
Optional<ServicioProfesional> findById(int id_servicio_profesional);

@Query("SELECT s FROM ServicioProfesional s WHERE s.profesional = :profesional")
List<ServicioProfesional> findByProfesional(@Param("profesional") Profesional profesional);
}
