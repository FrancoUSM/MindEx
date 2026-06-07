package com.bd.mindexa.controllers.atencion;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

import com.bd.mindexa.models.atencion.DisponibilidadAtencion;
import com.bd.mindexa.services.atencion.ServicioDisponibilidadAtencion;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/disponibilidad-atencion")
@RequiredArgsConstructor
@Validated
public class DisponibilidadAtencionController {

    private final ServicioDisponibilidadAtencion servicioDisponibilidadAtencion;

    @GetMapping("/disponibilidad")
    public ResponseEntity<List<DisponibilidadAtencion>> obtenerDisponibilidadAtencion(@RequestParam int id_profesional) {
        List<DisponibilidadAtencion> disponibilidades = servicioDisponibilidadAtencion.getAllDisponibilidadAtencion(id_profesional);
        return ResponseEntity.ok(disponibilidades);
    }

    @PostMapping("/crear-atencion")
    public ResponseEntity<DisponibilidadAtencion> crearDisponibilidadAtencion(
            @RequestParam int id_profesional,
            @RequestParam String dia,
            @RequestParam String hora_inicio,
            @RequestParam String hora_fin) {
        DisponibilidadAtencion nuevaDisponibilidad = servicioDisponibilidadAtencion.crearDisponibilidadAtencion(
                id_profesional, LocalDate.parse(dia), LocalDateTime.parse(hora_inicio), LocalDateTime.parse(hora_fin));
        return ResponseEntity.ok(nuevaDisponibilidad);

    }

    @DeleteMapping("/eliminar-atencion/{id_disponibilidad_atencion}")
    public ResponseEntity<Void> eliminarDisponibilidadAtencion(@PathVariable int id_disponibilidad_atencion) {
        servicioDisponibilidadAtencion.eliminarDisponibilidadAtencion(id_disponibilidad_atencion);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/actualizar-atencion/{id_disponibilidad_atencion}")
    public ResponseEntity<DisponibilidadAtencion> actualizarDisponibilidadAtencion(
            @PathVariable int id_disponibilidad_atencion,
            @RequestParam int id_profesional,
            @RequestParam String dia,
            @RequestParam String hora_inicio,
            @RequestParam String hora_fin) {
        // Implementa la lógica para actualizar la disponibilidad de atención
        // Puedes llamar a un método en el servicio para realizar la actualización
        return ResponseEntity.ok().build(); // Devuelve la disponibilidad actualizada

}
}
