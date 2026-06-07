package com.bd.mindexa.services.test;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.test.PreguntaTest;
import com.bd.mindexa.models.test.Test;
import com.bd.mindexa.repository.test.RepositorioPreguntaTest;
import com.bd.mindexa.repository.test.RepositorioTest;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioPreguntasTest {

    private final RepositorioPreguntaTest repositorioPreguntaTest;
    private final RepositorioTest repositorioTest;
    
    
    public PreguntaTest crearPreguntasTest(int id_test, String pregunta, int orden_pregunta){
        PreguntaTest preguntaTest = new PreguntaTest();
        Test test = repositorioTest.findById(id_test). 
        orElseThrow(() -> new RuntimeException("Test no encontrado"));

        preguntaTest.setOrden_pregunta(orden_pregunta);
        preguntaTest.setPregunta(pregunta);
        preguntaTest.setTest(test);
        
        return repositorioPreguntaTest.save(preguntaTest);
    }

    public void actualizarPreguntasTest(PreguntaTest preguntaTest, String pregunta, int orden_pregunta){
        if (!pregunta.equals(preguntaTest.getPregunta())) {
        preguntaTest.setPregunta(pregunta);
        }

        if (orden_pregunta != preguntaTest.getOrden_pregunta()) {
            preguntaTest.setOrden_pregunta(orden_pregunta);
        }

        repositorioPreguntaTest.save(preguntaTest);
        
    }

    public void eliminarPreguntasTest(@NonNull PreguntaTest preguntaTest){
        repositorioPreguntaTest.delete(preguntaTest);
    }

    public PreguntaTest obtenerPreguntaTest(int id_pregunta_test) {
       PreguntaTest preguntaTest = repositorioPreguntaTest.findById(id_pregunta_test)
                .orElseThrow(() -> new RuntimeException("Pregunta de test no encontrada"));
        return preguntaTest;
    
    }
}
