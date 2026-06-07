package com.bd.mindexa.controllers.usuario;

import java.util.HashMap;
import java.util.List;
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

import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.dto.registros.DTORegistroUsuarioEmpresaRequest;
import com.bd.mindexa.models.usuario.Empleado;
import com.bd.mindexa.services.usuario.ServicioUsuario;
import com.bd.mindexa.services.usuario.ServicioEmpleado;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/empleado")
@RequiredArgsConstructor
@Validated
public class EmpleadoController {

    private final ServicioEmpleado servicioUsuarioEmpresa;
    private final ServicioUsuario servicioUsuario;
    // 🔹 Obtener todos
    @GetMapping
    public ResponseEntity<List<Empleado>> getUsuarios(){
        return ResponseEntity.ok(servicioUsuarioEmpresa.getUsuarios());
    }


    // 🔹 Obtener por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Empleado> getUsuarioById(@PathVariable int id){
        return ResponseEntity.ok(servicioUsuarioEmpresa.getUsuarioById(id));
    }

    // 🔹 Obtener por correo (FIX ruta)
    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> getUsuarioByCorreo(@PathVariable String correo){
       
        return ResponseEntity.ok(servicioUsuario.getUsuarioByCorreo(correo));
    }

    // REGISTRO REAL
    @PostMapping("/crear")
    public ResponseEntity<Map<String, Object>> crearUsuario(@RequestBody DTORegistroUsuarioEmpresaRequest request){
        try {
            com.bd.mindexa.models.usuario.Usuario usuario = servicioUsuarioEmpresa.registrarUsuarioEmpresa(request);
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

    // 🔹 Actualizar
    @PutMapping
    public ResponseEntity<Empleado> actualizarUsuario(@RequestBody Empleado usuario){
        return ResponseEntity.ok(servicioUsuarioEmpresa.actualizarUsuario(usuario));
    }

    // 🔹 Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id){
        servicioUsuarioEmpresa.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}