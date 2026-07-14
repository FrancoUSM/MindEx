package com.bd.mindexa.controllers.usuario;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;
import com.bd.mindexa.services.usuario.ServicioAdministrativo;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;


@RestController
@RequestMapping("/api/administrativo")
@RequiredArgsConstructor
@Validated
public class AdministrativoController {

    private final ServicioAdministrativo servicioAdministrativo;


    @PostMapping("/crear-administrativo")
    public ResponseEntity<String> crearAdministrativo(@RequestBody Map<String, String> request) {
        int id = Integer.parseInt(request.get("id"));
        String nombre = request.get("nombre");
        String apellido = request.get("apellido");
        String correo = request.get("correo");
        String telefono = request.get("telefono");
        String contrasena = request.get("contrasena");


        servicioAdministrativo.crearAdministrativo(nombre, apellido, correo, telefono, contrasena);
        return ResponseEntity.ok("Administrativo creado exitosamente");
    }

    @GetMapping("/all-administrativos")
    public ResponseEntity<Map<String, Object>> getAllAdministrativos() {
        servicioAdministrativo.getAdministrativos();
        return ResponseEntity.ok(Map.of("message", "Lista de administrativos obtenida"));
    }

    @GetMapping("/administrativo")
    public ResponseEntity<Map<String, Object>> getAdministrativoById(@RequestParam int id) {
        servicioAdministrativo.getAdministrativoById(id);
        return ResponseEntity.ok(Map.of("message", "Administrativo encontrado"));
    }

    @PutMapping("/actualizar-administrativo")
    public ResponseEntity<Map<String, Object>> actualizarAdministrativo(@RequestBody Map<String, String> request) {
        int id = Integer.parseInt(request.get("id"));
        String nombre = request.get("nombre");
        String apellido = request.get("apellido");
        String correo = request.get("correo");
        String telefono = request.get("telefono");
        String contrasena = request.get("contrasena");

        servicioAdministrativo.actualizarAdministrativo(id, nombre, apellido, correo, telefono, contrasena);
        return ResponseEntity.ok(Map.of("message", "Administrativo actualizado exitosamente"));
    }

}
