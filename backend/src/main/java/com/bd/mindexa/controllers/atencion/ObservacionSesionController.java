package com.bd.mindexa.controllers.atencion;

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

import com.bd.mindexa.services.usuario.ServicioProfesional;
import com.bd.mindexa.services.usuario.paciente.ServicioObservacionSesion;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/observacion-sesion")
@RequiredArgsConstructor
@Validated

public class ObservacionSesionController {
    
    private final ServicioObservacionSesion servicioObservacionSesion;
    private final ServicioProfesional servicioProfesional;

    @GetMapping("/obtener-observacion-sesion/{id_sesion}")
    public ResponseEntity<String> obtenerObservacionSesion(@PathVariable int id_sesion) {
        String observacion = servicioObservacionSesion.getObservacionSesion(id_sesion);
        return ResponseEntity.ok(observacion);
    }

    @PostMapping("/crear-observacion-sesion")
    public ResponseEntity<String> crearObservacionSesion(
        @RequestParam int id_profesional,
        @RequestParam int id_sesion_clinica,
        @RequestParam String observacion
    ) {
        servicioObservacionSesion.crearObservacionAtencion(id_profesional, id_sesion_clinica, observacion);
        return ResponseEntity.ok("Observación de sesión clínica creada exitosamente");
    }

    @PutMapping("/actualizar-observacion-sesion/{id_observacion}")
    public ResponseEntity<String> actualizarObservacionSesion(
        @PathVariable int id_observacion,
        @RequestParam String observacion
    ) {
        // Lógica para actualizar la observación de sesión clínica
        servicioObservacionSesion.actualizarObservacionAtencion(id_observacion, observacion);
        return ResponseEntity.ok("Observación de sesión clínica actualizada exitosamente");
    }

    @DeleteMapping("/eliminar-observacion-sesion/{id_observacion}")
    public ResponseEntity<String> eliminarObservacionSesion(@PathVariable int id_observacion) {
        // Lógica para eliminar la observación de sesión clínica
            servicioObservacionSesion.eliminarObservacionAtencion(id_observacion);
        return ResponseEntity.ok("Observación de sesión clínica eliminada exitosamente");
    }




}
