package com.bd.mindexa.controllers.test;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTORegistroAnalisisTest;
import com.bd.mindexa.models.usuario.paciente.AnalisisTest;
import com.bd.mindexa.orquestador.OrquestadorAnalisisTest;
import com.bd.mindexa.services.usuario.paciente.test_respuestas.ServicioAnalisisTest;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/api/analisis-test")
@RequiredArgsConstructor
@Validated
public class AnalisisTestController {

    private final OrquestadorAnalisisTest orquestadorAnalisisTest;
    private final ServicioAnalisisTest servicioAnalisisTest;



    @GetMapping("")
    public ResponseEntity<Map<String,String>> getAnalisisTests(int id_analisis_test){
        AnalisisTest analisisTest = servicioAnalisisTest.obtenerAnalisisTest(id_analisis_test);
        return ResponseEntity.ok(Map.of("message", "Análisis de tests obtenidos correctamente"));
    }

    @PostMapping("/crear/analisis-test")
    public ResponseEntity<Map<String,String>> createAnalisisTest(@RequestBody DTORegistroAnalisisTest request){
        // Implementation for creating an analysis test
        orquestadorAnalisisTest.realizarAnalisisTest(request.id_respuesta_test, request.resultado, request.observacion_clinica, request.id_historial_paciente);
        return ResponseEntity.ok(Map.of("message", "Análisis de test creado correctamente"));
    }
}
