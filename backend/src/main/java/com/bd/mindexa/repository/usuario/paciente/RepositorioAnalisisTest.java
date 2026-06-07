package com.bd.mindexa.repository.usuario.paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.AnalisisTest;

public interface RepositorioAnalisisTest extends JpaRepository<AnalisisTest,Integer>{
Optional<AnalisisTest> findById(int id_analisis_test);
}
