package com.bd.mindexa.services.usuario.paciente.test_respuestas;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.test.PreguntaTest;
import com.bd.mindexa.models.test.Test;
import com.bd.mindexa.models.test.TestPaciente;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.paciente.RespuestaPacienteTest;
import com.bd.mindexa.repository.test.RepositorioPreguntaTest;
import com.bd.mindexa.repository.test.RepositorioRespuestaPacienteTest;
import com.bd.mindexa.repository.test.RepositorioTest;
import com.bd.mindexa.repository.test.RepositorioTestPaciente;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioRespuestaPacienteTest {
    private final RepositorioRespuestaPacienteTest repositorioRespuestaPacienteTest;
    private final RepositorioPreguntaTest repositorioPreguntaTest;
    private final RepositorioTestPaciente repositorioTestPaciente;

public RespuestaPacienteTest crearRespuestaPacienteTest(int id_test_paciente, int id_pregunta_test, int respuesta){
    RespuestaPacienteTest respuestaPacienteTest = new RespuestaPacienteTest();

    TestPaciente testPaciente = repositorioTestPaciente.findById(id_test_paciente).
    orElseThrow(() -> new RuntimeException("Test paciente no encontrado"));

    PreguntaTest preguntaTest = repositorioPreguntaTest.findById(id_pregunta_test).
    orElseThrow(() -> new RuntimeException("Pregunta de test no encontrada"));

    respuestaPacienteTest.setTestPaciente(testPaciente);
    respuestaPacienteTest.setPregunta_test(preguntaTest);
    respuestaPacienteTest.setRespuesta(respuesta);
    respuestaPacienteTest.setCreado_en(LocalDateTime.now());
    respuestaPacienteTest.setActualizado_en(LocalDateTime.now());


    return repositorioRespuestaPacienteTest.save(respuestaPacienteTest);
}


}
