package com.bd.mindexa.orquestador;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTORegistroTestyPreguntas;
import com.bd.mindexa.models.test.Test;
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
        Test createdTest = servicioTest.crearTest(request.id_servicio, request.nombre_test, request.descripcion);

        request.preguntas.forEach((pregunta, orden) -> {
            servicioPreguntasTest.crearPreguntasTest(createdTest.getId_test(), pregunta, orden);
        });
    }


}
