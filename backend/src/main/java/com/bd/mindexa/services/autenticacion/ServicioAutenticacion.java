package com.bd.mindexa.services.autenticacion;

import com.bd.mindexa.models.autenticacion.Autenticacion;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.repository.autenticacion.RepositorioAutenticacion;
import com.bd.mindexa.repository.sesion_usuario.RepositorioSesionUsuario;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;
import com.bd.mindexa.services.sesion_usuario.ServicioSesionUsuario;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor


public class ServicioAutenticacion {
    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioAutenticacion repositorioAutenticacion;
    private final ServicioSesionUsuario servicioSesionUsuario;

    @SuppressWarnings("deprecation")
    public void cambiarContrasena(int id_usuario, String contrasena_actual, String contrasena_nueva){
        com.bd.mindexa.models.usuario.Usuario usuario = repositorioUsuario.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        com.bd.mindexa.models.autenticacion.Autenticacion autenticacion = repositorioAutenticacion.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Credenciales no encontradas"));
        Argon2 argon2 = Argon2Factory.create();
        if (!argon2.verify(autenticacion.getContrasena_hash(), contrasena_actual)) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        autenticacion.setContrasena_hash(argon2.hash(2, 65536, 1, contrasena_nueva));
        autenticacion.setActualizado_en(java.time.LocalDateTime.now());
        repositorioAutenticacion.save(autenticacion);
    }

    @SuppressWarnings("deprecation")
    public Usuario login(String correo, String contrasena){
        Usuario usuario = repositorioUsuario.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));

        Autenticacion autenticacion = repositorioAutenticacion.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Argon2 argon2 = Argon2Factory.create();
        if (!argon2.verify(autenticacion.getContrasena_hash(), contrasena)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        servicioSesionUsuario.abrirSesionUsuario(usuario.getIdUsuario(), "ABIERTA");
        return usuario;
    }

    

}
