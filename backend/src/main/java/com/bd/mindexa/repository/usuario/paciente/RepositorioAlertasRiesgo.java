package com.bd.mindexa.repository.usuario.paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.AlertasRiesgo;

public interface RepositorioAlertasRiesgo extends JpaRepository<AlertasRiesgo,Integer>{
Optional<AlertasRiesgo> findById(int id_alertas_riesgo);
}
