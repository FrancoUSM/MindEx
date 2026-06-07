package com.bd.mindexa.repository.test;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.paciente.RespuestaPacienteTest;

public interface RepositorioRespuestaPacienteTest extends JpaRepository<RespuestaPacienteTest,Integer>{
Optional<RespuestaPacienteTest> findById(int id_respuesta_paciente_test);
}
