package com.bd.mindexa.repository.usuario.paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.HistorialSesionClinica;

public interface RepositorioHistorialSesionClinica extends JpaRepository<HistorialSesionClinica,Integer> {
Optional<HistorialSesionClinica> findById(int id_historial_sesion_clinica);
}
