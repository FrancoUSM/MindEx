package com.bd.mindexa.repository.usuario.paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;

public interface RepositorioHistorialPaciente extends JpaRepository<HistorialPaciente, Integer>{
Optional<HistorialPaciente> findById(int id_historial_paciente);
Optional<HistorialPaciente> findByPaciente(com.bd.mindexa.models.usuario.Paciente paciente);
}
