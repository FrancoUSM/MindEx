package com.bd.mindexa.services.usuario;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Administrativo;
import com.bd.mindexa.models.usuario.Usuario;

import com.bd.mindexa.repository.usuario.RepositorioAdministrativo;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ServicioAdministrativo {

    private final RepositorioAdministrativo repositorioAdministrativo;
    private final RepositorioUsuario repositorioUsuario;
    private final ServicioUsuario servicioUsuario;

    public void crearAdministrativo(String nombre, String apellido, String correo, String telefono, String contrasena){
        Administrativo administrativo = new Administrativo();
        Usuario usuario = servicioUsuario.registrarUsuarioPublico(nombre, apellido, correo, telefono, "ADMINISTRATIVO", contrasena);

        administrativo.setUsuario(usuario);
        administrativo.setCreado_en(LocalDateTime.now());
        administrativo.setActualizado_en(LocalDateTime.now());
        repositorioAdministrativo.save(administrativo);
    }


    public void actualizarAdministrativo(int id, String nombre, String apellido, String correo, String telefono, String contrasena){
        Administrativo administrativo = repositorioAdministrativo.findById(id).orElseThrow(() -> new RuntimeException("Administrativo no encontrado"));
        Usuario usuario = administrativo.getUsuario();
        servicioUsuario.actualizarUsuario(usuario, nombre, apellido, correo, telefono, "ADMINISTRATIVO", "ACTIVO", contrasena);
        administrativo.setActualizado_en(LocalDateTime.now());
        repositorioAdministrativo.save(administrativo);
    }


    public void eliminarAdministrativo(Administrativo administrativo){
        repositorioAdministrativo.delete(administrativo);
    }

    public void desactivarAdministrativo(Administrativo administrativo){
        administrativo.setDesactivado_en(LocalDateTime.now());
        repositorioAdministrativo.save(administrativo);
    }

    public Administrativo getAdministrativoById(int id){
        return repositorioAdministrativo.findById(id).orElseThrow(() -> new RuntimeException("Administrativo no encontrado"));
    }

    public List<Administrativo> getAdministrativos(){
        return repositorioAdministrativo.findAll();
    }




}
