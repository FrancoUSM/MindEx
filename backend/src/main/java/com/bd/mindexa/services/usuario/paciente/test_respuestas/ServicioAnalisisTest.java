package com.bd.mindexa.services.usuario.paciente.test_respuestas;

import java.time.LocalDateTime;
import java.util.List;

import com.bd.mindexa.models.test.MedicionRespuestaTest;
import com.bd.mindexa.models.usuario.paciente.AnalisisTest;
import com.bd.mindexa.repository.test.RepositorioMedicionRespuestaTest;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAnalisisTest;

import jakarta.annotation.Nonnull;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioAnalisisTest {

    private final RepositorioAnalisisTest repositorioAnalisisTest;
    private final RepositorioMedicionRespuestaTest repositorioMedicionRespuestaTest;

    public AnalisisTest crearAnalisisTest(List<Integer> id_medicion_respuestas, String resultado, String observacion_clinica){

        AnalisisTest analisisTest = new AnalisisTest();

        List<MedicionRespuestaTest> medicionRespuestaTests = repositorioMedicionRespuestaTest.findAllById(id_medicion_respuestas);

        
        analisisTest.setMedicion_respuesta_test(medicionRespuestaTests);
        analisisTest.setObservacion_clinica(observacion_clinica);
        analisisTest.setCreado_en(LocalDateTime.now());
        analisisTest.setResultado(resultado);   

        return repositorioAnalisisTest.save(analisisTest);
    }

    public void desactivarAnalisisTest(AnalisisTest analisisTest){
        analisisTest.setDesactivado_en(LocalDateTime.now());
        repositorioAnalisisTest.save(analisisTest);
    }

    public void eliminarAnalisisTest(@Nonnull AnalisisTest analisisTest){
        repositorioAnalisisTest.delete(analisisTest);
    }

    public AnalisisTest actualizarAnalisisTest(int id_analisis_test, List<Integer> id_medicion_respuestas, String resultado, String observacion_clinica){
        AnalisisTest analisisTest = repositorioAnalisisTest.findById(id_analisis_test).
        orElseThrow(() -> new RuntimeException("Análisis de test no encontrado"));

        List<MedicionRespuestaTest> medicionRespuestaTests = repositorioMedicionRespuestaTest.findAllById(id_medicion_respuestas);

        analisisTest.setMedicion_respuesta_test(medicionRespuestaTests);
        analisisTest.setObservacion_clinica(observacion_clinica);
        analisisTest.setActualizado_en(LocalDateTime.now());
        analisisTest.setResultado(resultado);   

        return repositorioAnalisisTest.save(analisisTest);
    }

    public AnalisisTest obtenerAnalisisTest(int id_analisis_test){
        return repositorioAnalisisTest.findById(id_analisis_test).
        orElseThrow(() -> new RuntimeException("Análisis de test no encontrado"));
    }


}
