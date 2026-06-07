package com.bd.mindexa.controllers.atencion;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
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

import com.bd.mindexa.services.usuario.paciente.ServicioSesionUrgencia;
@RestController
@RequestMapping("/api/sesion-urgencia")
@RequiredArgsConstructor
@Validated
public class SesionUrgenciaController {

    private final ServicioSesionUrgencia servicioSesionUrgencia;

    @GetMapping("/{id_sesion_urgencia}")
    public ResponseEntity<com.bd.mindexa.models.atencion.SesionUrgencia> obtenerSesionUrgencia(@PathVariable int id_sesion_urgencia) {
        return ResponseEntity.ok(servicioSesionUrgencia.obtenerSesionUrgencia(id_sesion_urgencia));
    }


    @PostMapping("/crear")
    public ResponseEntity<Map<String, Object>> crearSesionUrgencia(@RequestParam int id_servicio_profesional,
                                                                   @RequestParam int id_paciente,
                                                                   @RequestParam String contenido) {
        servicioSesionUrgencia.crearSesionUrgencia(id_servicio_profesional, id_paciente, contenido);
        return ResponseEntity.ok(Map.of("message", "Sesión de urgencia creada exitosamente"));
    }

    @PutMapping("/actualizar/{id_sesion_urgencia}")
    public ResponseEntity<Map<String, Object>> actualizarSesionUrgencia(@PathVariable int id_sesion_urgencia,
                                                                       @RequestParam String contenido) {
        servicioSesionUrgencia.actualizarSesionUrgencia(id_sesion_urgencia, contenido);
        return ResponseEntity.ok(Map.of("message", "Sesión de urgencia actualizada exitosamente"));
    }

        
    @DeleteMapping("/eliminar/{id_sesion_urgencia}")
    public ResponseEntity<Map<String, Object>> eliminarSesionUrgencia(@PathVariable int id_sesion_urgencia) {
        servicioSesionUrgencia.eliminarSesionUrgencia(id_sesion_urgencia);
        return ResponseEntity.ok(Map.of("message", "Sesión de urgencia eliminada exitosamente"));
    }

}
