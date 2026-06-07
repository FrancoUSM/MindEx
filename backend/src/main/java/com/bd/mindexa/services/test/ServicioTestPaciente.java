package com.bd.mindexa.services.test;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.test.Test;
import com.bd.mindexa.models.test.TestPaciente;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.repository.test.RepositorioTest;
import com.bd.mindexa.repository.test.RepositorioTestPaciente;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioTestPaciente {

    private final RepositorioTestPaciente repositorioTestPaciente;
    private final RepositorioTest repositorioTest;
    private final RepositorioPaciente repositorioPaciente;

    public TestPaciente iniciarTestPaciente(int id_paciente, int id_test) {
        // Lógica para iniciar el test para el paciente
        TestPaciente testPaciente = new TestPaciente();

        Paciente paciente = repositorioPaciente.findById(id_paciente).
        orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        
        Test test = repositorioTest.findById(id_test).
        orElseThrow(() -> new RuntimeException("Test no encontrado"));

        testPaciente.setPaciente(paciente);
        testPaciente.setTest(test);
        testPaciente.setEstado("en progreso");
        testPaciente.setIniciado_en(LocalDateTime.now());
        return repositorioTestPaciente.save(testPaciente);
    }

    

}
