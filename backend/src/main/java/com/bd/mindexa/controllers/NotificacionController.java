package com.bd.mindexa.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bd.mindexa.dto.registros.DTONotificacion;
import com.bd.mindexa.services.usuario.paciente.ServicioNotificacion;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notificaciones")
@Validated
public class NotificacionController {

    private final ServicioNotificacion servicioNotificacion;

    @GetMapping("/{id_usuario}")
    public ResponseEntity<List<DTONotificacion>> getNotificaciones(@PathVariable int id_usuario) {
        List<DTONotificacion> lista = servicioNotificacion.getNotificacionesPendientes(id_usuario)
                .stream().map(DTONotificacion::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/leer/{id}")
    public ResponseEntity<Map<String, String>> marcarLeida(@PathVariable int id) {
        servicioNotificacion.marcarLeida(id);
        return ResponseEntity.ok(Map.of("message", "Notificación marcada como leída"));
    }
}
