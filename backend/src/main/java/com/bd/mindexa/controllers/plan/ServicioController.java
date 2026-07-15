package com.bd.mindexa.controllers.plan;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTORegistroServicio;
import com.bd.mindexa.models.servicio.Servicio;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/servicio")
@RequiredArgsConstructor
@Validated

public class ServicioController {

    private final com.bd.mindexa.services.servicio.ServicioServicio servicioServicio;

    @GetMapping
    public ResponseEntity<List<Servicio>> getServicios(){
        return ResponseEntity.ok(servicioServicio.getServicios());
    }

    @PostMapping("/crear-servicio")
    public ResponseEntity<Map<String, Object>> crearServicio(@RequestBody DTORegistroServicio request){
         servicioServicio.crearServicio(request.nombre_servicio, request.descripcion_servicio, request.tipo_servicio);
        return ResponseEntity.ok(Map.of("message", "Servicio creado"));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Map<String, Object>> getServicioById(@PathVariable int id){
        servicioServicio.getServicioById(id);
        return ResponseEntity.ok(Map.of("message", "Servicio obtenido correctamente"));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Map<String, Object>> eliminarServicio(@PathVariable int id){
        Servicio servicio = servicioServicio.getServicioById(id);
        servicioServicio.eliminarServicio(servicio);
        return ResponseEntity.ok(Map.of("message", "Servicio eliminado correctamente"));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Map<String, Object>> actualizarServicio(@PathVariable int id, @RequestBody DTORegistroServicio request){
        Servicio servicio = servicioServicio.getServicioById(id);
        servicioServicio.actualizarServicio(servicio, request.nombre_servicio, request.descripcion_servicio, request.tipo_servicio);
        return ResponseEntity.ok(Map.of("message", "Servicio actualizado correctamente"));
    }

    @PutMapping("/desactivar/{id}")
    public ResponseEntity<Map<String, Object>> desactivarServicio(@PathVariable int id){
        Servicio servicio = servicioServicio.getServicioById(id);
        servicioServicio.desactivarServicio(servicio);
        return ResponseEntity.ok(Map.of("message", "Servicio desactivado correctamente"));
    }

}
