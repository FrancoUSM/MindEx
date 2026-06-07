package com.bd.mindexa.controllers.suscripcion;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTOSuscripcionRequest;
import com.bd.mindexa.models.suscripcion.Suscripcion;
import com.bd.mindexa.services.suscripcion.ServicioEstadoSuscripcion;
import com.bd.mindexa.services.suscripcion.ServicioSuscripcion;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/suscripcion")
@RequiredArgsConstructor
@Validated
public class SuscripcionController {


    private final ServicioSuscripcion servicioSuscripcion;
    private final ServicioEstadoSuscripcion servicioEstadoSuscripcion;

    @GetMapping
    public ResponseEntity<List<Suscripcion>> getSuscripciones(){
        return ResponseEntity.ok(servicioSuscripcion.getSuscripciones());
    }

    @PostMapping("/crear")
    public ResponseEntity<Map<String, Object>> crearSuscripcion(@RequestBody DTOSuscripcionRequest request) {
        try {
            var suscripcion = servicioSuscripcion.crearSuscripcion(
                request.id_empresa, request.id_plan, request.fecha_inicio, request.fecha_fin);
            return ResponseEntity.ok(Map.of(
                "message", "Suscripción creada correctamente",
                "id_suscripcion", suscripcion.getId_suscripcion()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Map<String, Object>> actualizarSuscripcion(@PathVariable int id, @RequestBody DTOSuscripcionRequest request) {
        try {
            Suscripcion suscripcion = servicioSuscripcion.getSuscripcionById(id);
            servicioSuscripcion.actualizarSuscripcion(suscripcion, request.fecha_inicio, request.fecha_fin);
            return ResponseEntity.ok(Map.of("message", "Suscripción actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Map<String,String>> eliminarSuscripcion(@PathVariable int id){
        servicioSuscripcion.desactivarSuscripcion(id);
        return ResponseEntity.ok(Map.of("message", "Suscripción desactivada correctamente"));
    }


}
