package com.bd.mindexa.services.sesion_usuario;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.sesion_usuario.SesionUsuario;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.repository.sesion_usuario.RepositorioSesionUsuario;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;
@Slf4j
@RequiredArgsConstructor
@Service
public class ServicioSesionUsuario {

    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioSesionUsuario repositorioSesionUsuario;
    
    public SesionUsuario abrirSesionUsuario(int id_usuario, String estado_sesion){
        SesionUsuario sesionUsuario = new SesionUsuario();

        Usuario usuario = repositorioUsuario.findById(id_usuario).
        orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        sesionUsuario.setUsuario(usuario);
        sesionUsuario.setEstado_sesion(estado_sesion);
        sesionUsuario.setSesion_abierta_en(LocalDateTime.now());

        return repositorioSesionUsuario.save(sesionUsuario);

    }

    public SesionUsuario cerrarSesionUsuario(SesionUsuario sesionUsuario, String estado_sesion){

        if (!"CERRADA".equals(sesionUsuario.getEstado_sesion())){
            sesionUsuario.setEstado_sesion(estado_sesion);
            sesionUsuario.setSesion_cerrada_en(LocalDateTime.now());
            repositorioSesionUsuario.save(sesionUsuario);
        }

        return sesionUsuario;
    }



}
