package com.bd.mindexa.services.usuario.paciente.historial;

import com.bd.mindexa.models.usuario.paciente.AnalisisTest;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.models.usuario.paciente.HistorialTest;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAnalisisTest;
import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialPaciente;

import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialTests;

import io.micrometer.common.lang.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioHistorialTests {

    private final RepositorioHistorialTests repositorioHistorialTests;
    private final RepositorioHistorialPaciente repositorioHistorialPaciente;
    private final RepositorioAnalisisTest repositorioAnalisisTest;


    public HistorialTest crearHistorialTest(int id_historial_paciente, int id_analisis_test){
        HistorialTest historialTest = new HistorialTest();

        HistorialPaciente historialPaciente = repositorioHistorialPaciente.findById(id_historial_paciente).
        orElseThrow(() -> new RuntimeException("Historial de paciente no encontrado"));

        AnalisisTest analisisTest = repositorioAnalisisTest.findById(id_analisis_test).
        orElseThrow(() -> new RuntimeException("Historial de paciente no encontrado"));

        historialTest.setHistorial_paciente(historialPaciente);
        historialTest.setAnalisis_test(analisisTest);
        historialTest.setFecha_resultado(LocalDate.now());

        return repositorioHistorialTests.save(historialTest);
    }

    public void desactivarHistorialTests(HistorialTest historialTest){
        historialTest.setDesactivado_en(LocalDateTime.now());
        repositorioHistorialTests.save(historialTest);
    }
    public void eliminarHistorialTests(@NonNull HistorialTest historialTest){
        repositorioHistorialTests.delete(historialTest);
    }
}
