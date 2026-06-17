package com.bd.mindexa.controllers.usuario;

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
import com.bd.mindexa.dto.registros.DTOProfesionalResponse;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.orquestador.OrquestadorProfesional;
import com.bd.mindexa.dto.registros.DTORegistroProfesional;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;
import com.bd.mindexa.repository.usuario.RepositorioProfesional;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;
import com.bd.mindexa.repository.usuario.profesional.RepositorioEspecialidadProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioIdiomaProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioServicioProfesional;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAnalisisRiesgo;
import com.bd.mindexa.services.usuario.ServicioUsuario;
import com.bd.mindexa.services.usuario.ServicioProfesional;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profesional")
@RequiredArgsConstructor
@Validated
public class ProfesionalController {

    private final OrquestadorProfesional orquestadorUsuarioProfesional;
    private final ServicioUsuario servicioUsuario;
    private final ServicioProfesional servicioUsuarioProfesional;
    private final RepositorioEspecialidadProfesional repositorioEspecialidad;
    private final RepositorioIdiomaProfesional repositorioIdioma;
    private final RepositorioServicioProfesional repositorioServicio;
    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioProfesional repositorioProfesional;
    private final RepositorioAnalisisRiesgo repositorioAnalisisRiesgo;
    // 🔹 Obtener todos (raw)
    @GetMapping
    public ResponseEntity<List<Profesional>> getUsuarios(){
        return ResponseEntity.ok(servicioUsuarioProfesional.getUsuarios());
    }

    // 🔹 Obtener lista completa para el directorio frontend
    @GetMapping("/lista")
    public ResponseEntity<List<DTOProfesionalResponse>> getLista() {
        List<Profesional> profesionales = servicioUsuarioProfesional.getUsuarios();
        List<DTOProfesionalResponse> lista = profesionales.stream()
                .map(p -> new DTOProfesionalResponse(
                        p,
                        repositorioEspecialidad.findByUsuarioProfesional(p),
                        repositorioIdioma.findByUsuarioProfesional(p),
                        repositorioServicio.findByProfesional(p)))
                .toList();
        return ResponseEntity.ok(lista);
    } 


    // 🔹 Obtener por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Profesional> getUsuarioById(@PathVariable int id){
        return ResponseEntity.ok(servicioUsuarioProfesional.getUsuarioById(id));
    }

    // 🔹 Obtener por correo (FIX ruta)
    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> getUsuarioByCorreo(@PathVariable String correo){
       
        return ResponseEntity.ok(servicioUsuario.getUsuarioByCorreo(correo));
    }

    // REGISTRO REAL
    @PostMapping("/crear-profesional")
public ResponseEntity<Map<String,String>> crearUsuarioCompleto(
        @RequestBody DTORegistroProfesional request) {

    if (request == null) {
        return ResponseEntity.badRequest().build();
    }else{
        orquestadorUsuarioProfesional.registroCompleto(
        request.usuarioProfesional,
        request.certificacionesProfesionales,
        request.servicioProfesional);
        System.out.println(request.usuarioProfesional);
        System.out.println(request.certificacionesProfesionales);
        System.out.println(request.servicioProfesional);
        return ResponseEntity.ok(Map.of("message", "Usuario creado correctamente"));
    }

    
}

    // 🔹 Perfil propio del profesional (por id_usuario, no por id_usuario_profesional)
    @GetMapping("/mi-perfil/{id_usuario}")
    public ResponseEntity<DTOProfesionalResponse> getMiPerfil(@PathVariable int id_usuario) {
        Profesional p = repositorioProfesional.findByUsuario_Id_usuario(id_usuario)
                .orElseThrow(() -> new RuntimeException("Perfil profesional no encontrado"));
        return ResponseEntity.ok(new DTOProfesionalResponse(
                p,
                repositorioEspecialidad.findByUsuarioProfesional(p),
                repositorioIdioma.findByUsuarioProfesional(p),
                repositorioServicio.findByProfesional(p)));
    }

    // 🔹 Conteo de análisis de riesgo alto en el sistema
    @GetMapping("/alertas-alto")
    public ResponseEntity<Map<String, Long>> getAlertasAlto() {
        long count = repositorioAnalisisRiesgo.findAll().stream()
                .filter(a -> a.getEstado_riesgo() != null &&
                             a.getEstado_riesgo() == AnalisisRiesgo.EstadoRiesgo.RIESGO_ALTO &&
                             a.getDesactivado_en() == null)
                .count();
        return ResponseEntity.ok(Map.of("total", count));
    }

    // 🔹 Actualizar
    @PutMapping
    public ResponseEntity<Profesional> actualizarUsuario(@RequestBody Profesional usuario){
        return ResponseEntity.ok(servicioUsuarioProfesional.actualizarUsuario(usuario));
    }

    // 🔹 Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id){
        servicioUsuarioProfesional.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}


