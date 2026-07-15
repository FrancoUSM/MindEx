package com.bd.mindexa.controllers.test;
import com.bd.mindexa.orquestador.OrquestadorTest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTORegistroTestyPreguntas;
import com.bd.mindexa.models.test.Test;
import com.bd.mindexa.services.test.ServicioTest;

import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Validated
public class TestController {

    private final OrquestadorTest orquestadorTest;
    private final ServicioTest servicioTest;


    @GetMapping("")
    public ResponseEntity<List<Test>> getTests(){
        return ResponseEntity.ok(servicioTest.getTests());
    }

    @PostMapping("/crear")
    public ResponseEntity<Map<String,String>> crearTest(@RequestBody DTORegistroTestyPreguntas request){
        orquestadorTest.registroCompletoTest(request);
        return ResponseEntity.ok(Map.of("message", "Test creado correctamente"));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Map<String,String>> actualizarTest(@PathVariable int id, @RequestBody DTORegistroTestyPreguntas  request){
        Test test = servicioTest.getTestById(id);
        servicioTest.actualizarTest(test, request.nombre_test, request.descripcion);
        return ResponseEntity.ok(Map.of("message", "Test actualizado correctamente"));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Map<String,String>> eliminarTest(@PathVariable int id){
        Test test = servicioTest.getTestById(id);
        servicioTest.eliminarTest(test);
        return ResponseEntity.ok(Map.of("message", "Test eliminado correctamente"));
    }




}
