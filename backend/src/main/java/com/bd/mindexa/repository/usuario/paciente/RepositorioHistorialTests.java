package com.bd.mindexa.repository.usuario.paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.HistorialTest;

public interface RepositorioHistorialTests extends JpaRepository<HistorialTest,Integer>{
Optional<HistorialTest> findById(int id_historial_test);
}
