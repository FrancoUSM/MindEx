package com.bd.mindexa.controllers.autenticacion;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bd.mindexa.dto.login.LoginUsuarioEmpresa;
import com.bd.mindexa.dto.registros.DTORegistroPublicoRequest;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.security.JwtUtil;
import com.bd.mindexa.services.autenticacion.ServicioAutenticacion;
import com.bd.mindexa.services.sesion_usuario.ServicioSesionUsuario;
import com.bd.mindexa.services.usuario.ServicioUsuario;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuario")
@RequiredArgsConstructor
@Validated

public class AutenticacionController {

private final ServicioAutenticacion servicioAutenticacion;
private final ServicioSesionUsuario servicioSesionUsuario;
private final ServicioUsuario servicioUsuario;
private final JwtUtil jwtUtil;

    @PostMapping("/registro-publico")
    public ResponseEntity<Map<String, Object>> registroPublico(@RequestBody DTORegistroPublicoRequest request) {
        try {
            Usuario usuario = servicioUsuario.registrarUsuarioPublico(
                request.nombre, request.apellido, request.correo, request.telefono, request.contrasena
            );
            Map<String, Object> response = new HashMap<>();
            response.put("id_usuario", usuario.getIdUsuario());
            response.put("nombre", usuario.getNombre());
            response.put("correo", usuario.getCorreo());
            response.put("token", jwtUtil.generateToken(usuario.getIdUsuario(), "USER"));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<Map<String, Object>> actualizarPerfil(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {
        try {
            Usuario usuario = servicioUsuario.getUsuarioById(id);
            String nombre = body.getOrDefault("nombre", usuario.getNombre());
            String apellido = body.getOrDefault("apellido", usuario.getApellido());
            String telefono = body.getOrDefault("telefono", usuario.getTelefono());
            servicioUsuario.actualizarUsuario(usuario, nombre, apellido,
                    usuario.getCorreo(), telefono,
                    usuario.getRol().name(), usuario.getEstado().name(), null);
            Map<String, Object> response = new HashMap<>();
            response.put("id_usuario", usuario.getIdUsuario());
            response.put("nombre", usuario.getNombre());
            response.put("correo", usuario.getCorreo());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PutMapping("/contrasena/{id}")
    public ResponseEntity<Map<String, Object>> cambiarContrasena(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {
        try {
            servicioAutenticacion.cambiarContrasena(
                id,
                body.getOrDefault("contrasena_actual", ""),
                body.getOrDefault("contrasena_nueva", "")
            );
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contraseña actualizada correctamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginUsuarioEmpresa loginRequest) {
        try {
            Usuario usuario = servicioAutenticacion.login(loginRequest.getCorreo(), loginRequest.getContrasena());
            Map<String, Object> response = new HashMap<>();
            String rol = usuario.getRol() != null ? usuario.getRol().name() : "USER";
            response.put("id_usuario", usuario.getIdUsuario());
            response.put("nombre", usuario.getNombre());
            response.put("correo", usuario.getCorreo());
            response.put("rol", rol);
            response.put("token", jwtUtil.generateToken(usuario.getIdUsuario(), rol));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

}
