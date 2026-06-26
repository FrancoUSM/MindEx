package com.bd.mindexa.controllers.atencion;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.services.atencion.ServicioAgendamientoAtencion;

@RestController
@RequestMapping("/api/agendamiento-atencion")
@RequiredArgsConstructor
@Validated
public class AgendamientoAtencionController {
private final ServicioAgendamientoAtencion servicioAgendamientoAtencion;
    @GetMapping("/agendamientos")
    public ResponseEntity<List<AgendamientoAtencion>> obtenerAgendamientosAtencion(@RequestParam int id_profesional) {
        return ResponseEntity.ok(servicioAgendamientoAtencion.getAllAgendamientoAtencion(id_profesional));
    }

    @PostMapping("/crear")
    public ResponseEntity<AgendamientoAtencion> crearAgendamientoAtencion(@RequestParam int id_paciente, @RequestParam int id_disponibilidad_atencion, @RequestParam String razon_atencion, @RequestParam LocalDateTime fecha_atencion) {
        return ResponseEntity.ok(servicioAgendamientoAtencion.crearAgendamientoAtencion(id_paciente, id_disponibilidad_atencion, fecha_atencion, razon_atencion));
    }

    @PutMapping("/actualizar")
    public ResponseEntity<AgendamientoAtencion> actualizarAgendamientoAtencion(@RequestParam int id_agendamiento_atencion, @RequestParam LocalDateTime fecha_nueva) {
        AgendamientoAtencion agendamientoAtencion = servicioAgendamientoAtencion.getAgendamientoById(id_agendamiento_atencion);
        return ResponseEntity.ok(servicioAgendamientoAtencion.actualizarAgendamientoAtencion(agendamientoAtencion, fecha_nueva));
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<Void> eliminarAgendamientoAtencion(@RequestParam int id_agendamiento_atencion) {
        AgendamientoAtencion agendamientoAtencion = servicioAgendamientoAtencion.getAgendamientoById(id_agendamiento_atencion);
        servicioAgendamientoAtencion.eliminarAgendamientoAtencion(agendamientoAtencion);
        return ResponseEntity.noContent().build();
}

}