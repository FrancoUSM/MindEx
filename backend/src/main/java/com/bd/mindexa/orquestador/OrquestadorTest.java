package com.bd.mindexa.orquestador;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTORegistroTestyPreguntas;
import com.bd.mindexa.services.test.ServicioPreguntasTest;
import com.bd.mindexa.services.test.ServicioTest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrquestadorTest {

    private final ServicioTest servicioTest;
    private final ServicioPreguntasTest servicioPreguntasTest;
    
    @Transactional
    public void registroCompletoTest(DTORegistroTestyPreguntas request){
        //Crear test
        servicioTest.crearTest(request.id_servicio, request.nombre_test, request.descripcion);
        //Crear preguntas del test
        request.preguntas.forEach((pregunta, orden) -> {
            int id_test = servicioTest.getTestById(request.id_servicio).getId_test();
            servicioPreguntasTest.crearPreguntasTest(id_test, pregunta, orden);
        });
        
    }


}
