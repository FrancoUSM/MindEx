package com.bd.mindexa.services.usuario.paciente.test_respuestas;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.test.MedicionRespuestaTest;
import com.bd.mindexa.models.usuario.paciente.RespuestaPacienteTest;
import com.bd.mindexa.repository.test.RepositorioMedicionRespuestaTest;
import com.bd.mindexa.repository.test.RepositorioRespuestaPacienteTest;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioMedicionRespuestaTest {

    private final RepositorioRespuestaPacienteTest repositorioRespuestaPacienteTest;
    private final RepositorioMedicionRespuestaTest repositorioMedicionRespuestaTest;
    
    public MedicionRespuestaTest crearMedicionRespuestaTest(int id_respuesta_test, int puntaje_obtenido){
        MedicionRespuestaTest medicionRespuestaTest = new MedicionRespuestaTest();

        RespuestaPacienteTest respuestaPacienteTest = repositorioRespuestaPacienteTest.findById(id_respuesta_test).
        orElseThrow(() -> new RuntimeException("Respuesta de test no encontrada"));

        medicionRespuestaTest.setRespuesta_paciente_test(respuestaPacienteTest);
        medicionRespuestaTest.setPuntaje_obtenido(puntaje_obtenido);
        medicionRespuestaTest.setCreado_en(LocalDateTime.now());
        
        return repositorioMedicionRespuestaTest.save(medicionRespuestaTest);
    }

    public void desactivarMedicionRespuestaTest(MedicionRespuestaTest medicionRespuestaTest){
        medicionRespuestaTest.setDesactivado_en(LocalDateTime.now());
        repositorioMedicionRespuestaTest.save(medicionRespuestaTest);
    }

    public void eliminarMedicionRespuestaTest(@NonNull MedicionRespuestaTest medicionRespuestaTest){
        repositorioMedicionRespuestaTest.delete(medicionRespuestaTest);
    }


 

}
