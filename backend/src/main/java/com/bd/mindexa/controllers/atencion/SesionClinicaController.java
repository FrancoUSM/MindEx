package com.bd.mindexa.controllers.atencion;
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

import com.bd.mindexa.models.atencion.DisponibilidadAtencion;
import com.bd.mindexa.models.atencion.SesionClinica;
import com.bd.mindexa.models.servicio.Servicio;
import com.bd.mindexa.services.atencion.ServicioDisponibilidadAtencion;
import com.bd.mindexa.services.atencion.ServicioSesionClinica;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sesion-clinica")
@RequiredArgsConstructor
@Validated

public class SesionClinicaController {

    private final ServicioDisponibilidadAtencion servicioDisponibilidadAtencion;
    private final ServicioSesionClinica servicioSesionClinica;

    @GetMapping("/{id_sesion_clinica}")
    public ResponseEntity<Map<String, Object>> obtenerSesionClinica(@PathVariable int id_sesion_clinica) {
        SesionClinica sesionClinica = servicioSesionClinica.getSesionClinicaById(id_sesion_clinica);

        return ResponseEntity.ok(Map.of("message", "Sesión clínica obtenida exitosamente"));
    }

    @PostMapping("/crear")
    public ResponseEntity<Map<String, Object>> crearSesionClinica(@RequestParam int id_agendamiento_atencion,
                                                                 @RequestParam int id_servicio_profesional,
                                                                 @RequestParam LocalDate fecha_atencion) {
        SesionClinica sesionClinica = servicioSesionClinica.crearSesionClinica(id_agendamiento_atencion, id_servicio_profesional, fecha_atencion);

        return ResponseEntity.ok(Map.of("message", "Sesión clínica creada exitosamente"));
    }

    @PutMapping("/terminar/{id_sesion_clinica}")
    public ResponseEntity<Map<String, Object>> terminarSesionClinica(@PathVariable int id_sesion_clinica) {
        SesionClinica sesionClinica = servicioSesionClinica.getSesionClinicaById(id_sesion_clinica);
        servicioSesionClinica.terminarSesionClinica(sesionClinica, java.time.LocalDateTime.now());

        return ResponseEntity.ok(Map.of("message", "Sesión clínica terminada exitosamente"));
    }

    @DeleteMapping("/eliminar/{id_sesion_clinica}")
    public ResponseEntity<Map<String, Object>> eliminarSesionClinica(@PathVariable int id_sesion_clinica) {
        SesionClinica sesionClinica = servicioSesionClinica.getSesionClinicaById(id_sesion_clinica);
        servicioSesionClinica.eliminarSesionClinica(sesionClinica);

        return ResponseEntity.ok(Map.of("message", "Sesión clínica eliminada exitosamente"));
    }

}
