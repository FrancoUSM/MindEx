package com.bd.mindexa.orquestador;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.test.MedicionRespuestaTest;
import com.bd.mindexa.models.test.PreguntaTest;
import com.bd.mindexa.models.test.TestPaciente;
import com.bd.mindexa.models.usuario.paciente.AnalisisTest;
import com.bd.mindexa.models.usuario.paciente.RespuestaPacienteTest;
import com.bd.mindexa.services.test.ServicioPreguntasTest;
import com.bd.mindexa.services.test.ServicioTest;
import com.bd.mindexa.services.test.ServicioTestPaciente;
import com.bd.mindexa.services.usuario.paciente.historial.ServicioHistorialTests;
import com.bd.mindexa.services.usuario.paciente.test_respuestas.ServicioAnalisisTest;
import com.bd.mindexa.services.usuario.paciente.test_respuestas.ServicioMedicionRespuestaTest;
import com.bd.mindexa.services.usuario.paciente.test_respuestas.ServicioRespuestaPacienteTest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrquestadorTestPaciente {

    private final ServicioRespuestaPacienteTest servicioRespuestaPacienteTest;
    private final ServicioMedicionRespuestaTest servicioMedicionRespuestaTest;
    private final ServicioTestPaciente servicioTestPaciente;
    private final ServicioPreguntasTest servicioPreguntasTest;

    public void realizarTestPaciente(int id_paciente, int id_test, int id_pregunta_test, int respuesta, String resultado , String observacion_clinica) {
        // Iniciar el test para el paciente
        TestPaciente testPaciente = servicioTestPaciente.iniciarTestPaciente(id_paciente, id_test);
        PreguntaTest preguntaTest = servicioPreguntasTest.obtenerPreguntaTest(id_pregunta_test);
        RespuestaPacienteTest respuestaPacienteTest = servicioRespuestaPacienteTest.crearRespuestaPacienteTest(testPaciente.getId_test_paciente(), id_pregunta_test, respuesta);
        MedicionRespuestaTest medicionRespuestaTest = servicioMedicionRespuestaTest.crearMedicionRespuestaTest(respuestaPacienteTest.getId_respuesta_paciente_test(), respuesta);

    }


}
