package com.bd.mindexa.controllers.atencion;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.models.usuario.paciente.CalificacionProfesional;
import com.bd.mindexa.services.usuario.paciente.ServicioCalificacionProfesional;

@RestController
@RequestMapping("/api/calificacion-profesional")
@RequiredArgsConstructor
@Validated
public class CalificacionProfesionalController {

    private final ServicioCalificacionProfesional servicioCalificacionProfesional;
    
    @PostMapping("/calificar")
    public ResponseEntity<Map<String, Object>> calificarProfesional(
           @RequestParam(required = false) Integer id_sesion_urgencia,
           @RequestParam(required = false) Integer id_sesion_clinica,
           @RequestParam int id_paciente,
           @RequestParam int puntaje,
           @RequestParam String observacion) {
        CalificacionProfesional calificacionProfesional = servicioCalificacionProfesional.crearCalificacionProfesional(id_sesion_urgencia, id_sesion_clinica, id_paciente, puntaje, observacion);

        Map<String, Object> response = new HashMap<>();
        response.put("calificacion", calificacionProfesional);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalificacionProfesional> obtenerCalificacionProfesional(@PathVariable int id) {
        CalificacionProfesional calificacionProfesional = servicioCalificacionProfesional.obtenerCalificacionProfesional(id);
        return ResponseEntity.ok(calificacionProfesional);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCalificacionProfesional(@PathVariable int id) {
        CalificacionProfesional calificacionProfesional = servicioCalificacionProfesional.obtenerCalificacionProfesional(id);
        servicioCalificacionProfesional.eliminarCalificacionProfesional(calificacionProfesional);
        return ResponseEntity.noContent().build();
    }

}
