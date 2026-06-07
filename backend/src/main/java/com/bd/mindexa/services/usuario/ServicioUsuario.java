package com.bd.mindexa.services.usuario;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import io.micrometer.common.lang.NonNull;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.autenticacion.Autenticacion;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.Usuario.Estado;
import com.bd.mindexa.models.usuario.Usuario.Rol;
import com.bd.mindexa.repository.autenticacion.RepositorioAutenticacion;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

@Transactional
public class ServicioUsuario {

    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioAutenticacion repositorioAutenticacion;

    public Usuario crearUsuario(String nombre, String apellido, String correo, String telefono, String rol, String estado, String contrasena){
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre.trim());
        usuario.setApellido(apellido.trim());
        usuario.setCorreo(correo.trim());
        usuario.setTelefono(telefono != null ? telefono.trim() : "");
        usuario.setRol(Usuario.Rol.USER);
        usuario.setEstado(Usuario.Estado.valueOf(estado != null ? estado.toUpperCase() : "ACTIVO"));
        usuario.setCreado_en(LocalDateTime.now());
        usuario.setActualizado_en(LocalDateTime.now());

        Usuario usuarioGuardado = repositorioUsuario.save(usuario);
        Argon2 argon2 = Argon2Factory.create();
        String hash = argon2.hash(2, 65536, 1, contrasena);
        Autenticacion autenticacion = new Autenticacion();
        autenticacion.setUsuario(usuarioGuardado);
        autenticacion.setContrasena_hash(hash);
        autenticacion.setEstado(com.bd.mindexa.models.autenticacion.Autenticacion.Estado.ACTIVO);
        autenticacion.setCreado_en(LocalDateTime.now());
        autenticacion.setActualizado_en(LocalDateTime.now());
        repositorioAutenticacion.save(autenticacion);

        return usuarioGuardado;
    }

    public Usuario registrarUsuarioPublico(String nombre, String apellido, String correo, String telefono, String contrasena) {
        if (repositorioUsuario.findByCorreo(correo.trim()).isPresent()) {
            throw new RuntimeException("Ya existe una cuenta con ese correo electrónico");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre.trim());
        usuario.setApellido(apellido != null ? apellido.trim() : "");
        usuario.setCorreo(correo.trim());
        usuario.setTelefono(telefono != null ? telefono.trim() : "");
        usuario.setRol(Usuario.Rol.USER);
        usuario.setEstado(Usuario.Estado.ACTIVO);
        usuario.setCreado_en(LocalDateTime.now());
        usuario.setActualizado_en(LocalDateTime.now());

        Usuario usuarioGuardado = repositorioUsuario.save(usuario);
        Argon2 argon2 = Argon2Factory.create();
        String hash = argon2.hash(2, 65536, 1, contrasena);
        Autenticacion autenticacion = new Autenticacion();
        autenticacion.setUsuario(usuarioGuardado);
        autenticacion.setContrasena_hash(hash);
        autenticacion.setEstado(com.bd.mindexa.models.autenticacion.Autenticacion.Estado.ACTIVO);
        autenticacion.setCreado_en(LocalDateTime.now());
        autenticacion.setActualizado_en(LocalDateTime.now());
        repositorioAutenticacion.save(autenticacion);

        return usuarioGuardado;
    }

    public Usuario getUsuarioByCorreo(String correo) {
        return repositorioUsuario.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado por correo"));
    }
    
    public void actualizarUsuario(Usuario usuario, String nombre, String apellido, String correo, String telefono, String rol, String estado, String contrasena){
        if (!nombre.equals(usuario.getNombre())) {
        usuario.setNombre(nombre.trim());    
        }
         if (!apellido.equals(usuario.getApellido())) {
        usuario.setApellido(apellido.trim());    
        }
        if (!correo.equals(usuario.getCorreo())) {
        usuario.setCorreo(correo.trim());    
        }
        if (!telefono.equals(usuario.getTelefono())) {
        usuario.setTelefono(telefono.trim());    
        }
        usuario.setRol(Rol.valueOf(rol.toUpperCase()));
        usuario.setEstado(Estado.valueOf(estado.toUpperCase()));
        
        usuario.setActualizado_en(LocalDateTime.now());
        repositorioUsuario.save(usuario);
}

public void desactivarUsuario(Usuario usuario){
    usuario.setDesactivado_en(LocalDateTime.now());
    repositorioUsuario.save(usuario);
}

public void eliminarUsuario(@NonNull Usuario usuario){
    repositorioUsuario.delete(usuario);
}

public Usuario getUsuarioById(int id_usuario) {
        return repositorioUsuario.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado por ID"));
    }

}