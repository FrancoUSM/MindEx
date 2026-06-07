package com.bd.mindexa.orquestador;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.paciente.AnalisisTest;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.models.usuario.paciente.HistorialTest;
import com.bd.mindexa.services.usuario.paciente.historial.ServicioHistorialPaciente;
import com.bd.mindexa.services.usuario.paciente.historial.ServicioHistorialTests;
import com.bd.mindexa.services.usuario.paciente.test_respuestas.ServicioAnalisisTest;
import com.bd.mindexa.services.usuario.paciente.test_respuestas.ServicioMedicionRespuestaTest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class OrquestadorAnalisisTest {

    private final ServicioAnalisisTest servicioAnalisisTest;
    private final ServicioMedicionRespuestaTest servicioMedicionRespuestaTest;
    private final ServicioHistorialTests servicioHistorialTests;
    private final ServicioHistorialPaciente servicioHistorialPaciente;
    public void realizarAnalisisTest(List<Integer> id_respuesta_test, String resultado, String observacion_clinica, int id_historial_paciente) {

            AnalisisTest analisisTest = servicioAnalisisTest.crearAnalisisTest(id_respuesta_test, resultado, observacion_clinica);
            HistorialPaciente historialPaciente = servicioHistorialPaciente.obtenerHistorialPaciente(id_historial_paciente);
            HistorialTest historialTest = servicioHistorialTests.crearHistorialTest(historialPaciente.getId_historial_paciente(), analisisTest.getId_analisis_test());

}
}
