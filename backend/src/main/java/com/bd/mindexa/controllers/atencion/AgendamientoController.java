package com.bd.mindexa.controllers.atencion;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTOAgendamientoRequest;
import com.bd.mindexa.dto.registros.DTOAgendamientoResponse;
import com.bd.mindexa.repository.atencion.RepositorioAgendamientoAtencion;
import com.bd.mindexa.services.atencion.ServicioAgendamiento;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agendamiento")
@RequiredArgsConstructor
@Validated
public class AgendamientoController {

    private final ServicioAgendamiento servicioAgendamiento;
    private final RepositorioAgendamientoAtencion repositorioAgendamiento;

    @PostMapping("/solicitar")
    public ResponseEntity<DTOAgendamientoResponse> solicitarCita(@RequestBody DTOAgendamientoRequest request) {
        return ResponseEntity.ok(servicioAgendamiento.crearAgendamiento(request));
    }

    @GetMapping("/mis-citas/{id_usuario}")
    public ResponseEntity<List<DTOAgendamientoResponse>> getMisCitas(@PathVariable int id_usuario) {
        return ResponseEntity.ok(servicioAgendamiento.getMisCitas(id_usuario));
    }

    @DeleteMapping("/cancelar/{id_agendamiento}")
    public ResponseEntity<Map<String, String>> cancelar(@PathVariable int id_agendamiento) {
        servicioAgendamiento.cancelarAgendamiento(id_agendamiento);
        return ResponseEntity.ok(Map.of("message", "Cita cancelada correctamente"));
    }

    @GetMapping("/citas-profesional/{id_profesional}")
    public ResponseEntity<List<DTOAgendamientoResponse>> getCitasProfesional(@PathVariable int id_profesional) {
        List<DTOAgendamientoResponse> lista = repositorioAgendamiento
                .findByIdProfesional(id_profesional)
                .stream().map(DTOAgendamientoResponse::new).toList();
        return ResponseEntity.ok(lista);
    }
}
