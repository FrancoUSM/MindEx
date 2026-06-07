package com.bd.mindexa.controllers.checkin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTOCheckinHistorialResponse;
import com.bd.mindexa.dto.registros.DTOCheckinIDSM;
import com.bd.mindexa.dto.registros.DTOEvaluacionRequest;
import com.bd.mindexa.services.checkin.ServicioCheckinIDSM;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
@Validated
public class CheckinController {

    private final ServicioCheckinIDSM servicioCheckinIDSM;

    @PostMapping("/idsm")
    public ResponseEntity<Map<String, String>> registrarCheckinIDSM(@RequestBody DTOCheckinIDSM request) {
        servicioCheckinIDSM.guardarCheckin(request);
        return ResponseEntity.ok(Map.of("message", "Check-in guardado correctamente"));
    }

    @PostMapping("/evaluacion")
    public ResponseEntity<Map<String, String>> registrarEvaluacion(@RequestBody DTOEvaluacionRequest request) {
        servicioCheckinIDSM.guardarEvaluacion(
                request.id_usuario, request.tipo, request.score, request.max_score, request.severidad);
        return ResponseEntity.ok(Map.of("message", "Evaluación guardada correctamente"));
    }

    @GetMapping("/idsm/historial/{id_usuario}")
    public ResponseEntity<List<DTOCheckinHistorialResponse>> getHistorial(@PathVariable int id_usuario) {
        return ResponseEntity.ok(servicioCheckinIDSM.getHistorial(id_usuario));
    }
}
