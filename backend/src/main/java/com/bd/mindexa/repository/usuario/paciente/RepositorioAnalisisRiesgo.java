package com.bd.mindexa.repository.usuario.paciente;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;

public interface RepositorioAnalisisRiesgo extends JpaRepository<AnalisisRiesgo,Integer>{
Optional<AnalisisRiesgo> findById(int id_analisis_riesgo);

@Query("SELECT a FROM AnalisisRiesgo a WHERE a.historialPaciente.paciente.usuario.idUsuario = :idUsuario AND a.desactivado_en IS NULL ORDER BY a.creado_en DESC")
List<AnalisisRiesgo> findByIdUsuario(@Param("idUsuario") int idUsuario);
}
