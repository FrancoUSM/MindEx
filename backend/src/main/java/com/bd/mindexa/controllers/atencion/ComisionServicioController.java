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

import com.bd.mindexa.models.servicio.Comision;
import com.bd.mindexa.services.servicio.ServicioComision;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comision-servicio")
@RequiredArgsConstructor
@Validated
public class ComisionServicioController {

    private final ServicioComision servicioComision;

    @GetMapping("/calificacion-profesional/{id}")
    public ResponseEntity<Comision> obtenerCalificacionProfesional(@PathVariable int id) {
        Comision comision = servicioComision.obtenerComision(id);
        return ResponseEntity.ok(comision);
    }

    @PostMapping("/crear")
    public ResponseEntity<Comision> crearComision(@RequestParam(required = false) Integer id_agendamiento_sesion, @RequestParam(required = false) Integer id_sesion_urgencia) {
        Comision comision = servicioComision.crearComision(id_agendamiento_sesion, id_sesion_urgencia);
        return ResponseEntity.ok(comision);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarComision(@PathVariable int id) {
        Comision comision = servicioComision.obtenerComision(id);
        servicioComision.eliminarComision(comision);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Comision> actualizarComision(@PathVariable int id, @RequestParam(required = false) Integer id_agendamiento_sesion, @RequestParam(required = false) Integer id_sesion_urgencia) {
        Comision comision = servicioComision.obtenerComision(id);
        servicioComision.eliminarComision(comision);
        Comision comisionActualizada = servicioComision.crearComision(id_agendamiento_sesion, id_sesion_urgencia);
        return ResponseEntity.ok(comisionActualizada);
    }

}
