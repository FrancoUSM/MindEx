package com.bd.mindexa.controllers.usuario;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.services.usuario.ServicioAdministrador;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/administrador")
@RequiredArgsConstructor
@Validated
public class AdministradorController {

    private final ServicioAdministrador servicioAdministrador;

    @PostMapping("/crear")
    public ResponseEntity<Map<String, Object>> crearAdministrador(@RequestBody String nombre, @RequestBody String apellido, @RequestBody String correo, @RequestBody String telefono) {
        // Lógica para crear un administrador
        servicioAdministrador.crearAdministrador(nombre, apellido, correo, telefono);

        return ResponseEntity.ok(Map.of("message", "Administrador creado exitosamente"));

    }

   @GetMapping("/{id}")
   public ResponseEntity<Map<String, Object>> getMethodName(@RequestParam int id) {
         servicioAdministrador.getAdministradorById(id);
       return ResponseEntity.ok(Map.of("message", "Administrador encontrado"));
   }

   @GetMapping("/usuario/{idUsuario}")
   public ResponseEntity<Map<String, Object>> getAdministradorByUsuarioId(@PathVariable int idUsuario) {
       servicioAdministrador.getAdministradorByUsuarioId(idUsuario);
       return ResponseEntity.ok(Map.of("message", "Administrador encontrado para el usuario con ID: " + idUsuario));
   }

   @GetMapping("/all")
   public ResponseEntity<Map<String, Object>> getAllAdministradores() {
       servicioAdministrador.getAdministradores();
       return ResponseEntity.ok(Map.of("message", "Lista de administradores obtenida"));
   }

}
