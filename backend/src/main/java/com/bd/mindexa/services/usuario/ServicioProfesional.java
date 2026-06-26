package com.bd.mindexa.services.usuario;

import com.bd.mindexa.repository.usuario.RepositorioProfesional;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.dto.registros.DTORegistroUsuarioProfesionalRequest;
import com.bd.mindexa.models.usuario.Profesional;
import jakarta.transaction.Transactional;



@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioProfesional {

private final RepositorioProfesional repositorioUsuarioProfesional;
private final ServicioUsuario servicioUsuario;

    @Transactional
    public Profesional registrarProfesional(DTORegistroUsuarioProfesionalRequest request) {
        //CREAR USUARIO
        Usuario usuario = servicioUsuario.registrarUsuarioPublico(request.nombre, request.apellido, request.correo, request.telefono, request.rol, request.estado, request.contrasena);


        //RELACIÓN CON USUARIOPROFESIONAL
        Profesional usuarioProfesional = new Profesional();
        usuarioProfesional.setUsuario(usuario);
        usuarioProfesional.setBiografia_profesional(request.biografia_profesional);
        usuarioProfesional.setDescripcion_formacion_academica(request.descripcion_formacion_academica);
        usuarioProfesional.setAnos_experiencia(request.anios_experiencia);
        usuarioProfesional.setNumero_registro_salud(request.numero_registro_salud);
        usuarioProfesional.setAcepta_empleados_mindexa(request.acepta_empleados_mindexa);
        
        

        return repositorioUsuarioProfesional.save(usuarioProfesional);
    }

    //
    public Profesional actualizarUsuarioProfesional(Profesional usuario) {
        @SuppressWarnings("unused")
        Profesional usuarioExistente = repositorioUsuarioProfesional.findById(usuario.getId_profesional())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para actualizar"));


        Profesional usuarioActualizado = repositorioUsuarioProfesional.save(usuario);
        log.info("Usuario con id {} actualizado correctamente", usuarioActualizado.getId_profesional());
        return usuarioActualizado;
    }
    //
    public void eliminarUsuario(int id) {
        if (repositorioUsuarioProfesional.existsById(id)) {
            repositorioUsuarioProfesional.deleteById(id);
            log.info("Usuario con id {} eliminado correctamente", id);
        } else {
            log.warn("Intento de eliminar usuario con id {} que no existe", id);
        }
    }

        public Profesional getUsuarioById(int id) {
        return repositorioUsuarioProfesional.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<Profesional> getUsuarios() {
        return repositorioUsuarioProfesional.findAll();
    }


    public Profesional actualizarUsuario(Profesional usuario) {
        @SuppressWarnings("unused")
        Profesional usuarioExistente = repositorioUsuarioProfesional.findById(usuario.getId_profesional())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para actualizar"));


        Profesional usuarioActualizado = repositorioUsuarioProfesional.save(usuario);
        log.info("Usuario con id {} actualizado correctamente", usuarioActualizado.getId_profesional());
        return usuarioActualizado;
    }


}
