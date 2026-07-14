package com.bd.mindexa.services.usuario;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Administrador;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.Usuario.Rol;
import com.bd.mindexa.repository.usuario.RepositorioAdministrador;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioAdministrador {

private final RepositorioAdministrador repositorioAdministrador;
private final RepositorioUsuario repositorioUsuario;

public List<Administrador> getAdministradores() {
    return repositorioAdministrador.findAll();

}


public Administrador getAdministradorById(int id) {
    return repositorioAdministrador.findById(id)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));


}

public Administrador getAdministradorByUsuarioId(int idUsuario) {
    return repositorioAdministrador.findByUsuario_IdUsuario(idUsuario)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado para el usuario con ID: " + idUsuario));

}


public void crearAdministrador(String nombre, String apellido, String correo, String telefono) {

    Usuario usuario = new Usuario();
    usuario.setNombre("Admin");
    usuario.setApellido(apellido);
    usuario.setCorreo(correo);
    usuario.setTelefono(telefono);
    usuario.setCreado_en(LocalDateTime.now());
    usuario.setRol(Rol.ADMIN);
    usuario.setEstado(Usuario.Estado.ACTIVO);
    repositorioUsuario.save(usuario);
    Administrador administrador = new Administrador();
    administrador.setUsuario(usuario);
    administrador.setCreado_en(LocalDateTime.now());
    administrador.setActualizado_en(LocalDateTime.now());
    repositorioAdministrador.save(administrador);

}

public void eliminarAdministrador(int id) {
    Administrador administrador = repositorioAdministrador.findById(id)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    repositorioAdministrador.delete(administrador);
}

public void desactivarAdministrador(int id) {
    Administrador administrador = repositorioAdministrador.findById(id)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    Usuario usuario = administrador.getUsuario();
    usuario.setEstado(Usuario.Estado.INACTIVO);
    usuario.setDesactivado_en(LocalDateTime.now());
    repositorioUsuario.save(usuario);
}


public void actualizarAdministrador(int id, String nombre, String apellido, String correo, String telefono) {
    Administrador administrador = repositorioAdministrador.findById(id)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

    Usuario usuario = administrador.getUsuario();
    usuario.setNombre(nombre);
    usuario.setApellido(apellido);
    usuario.setCorreo(correo);
    usuario.setTelefono(telefono);
    usuario.setActualizado_en(LocalDateTime.now());
    repositorioUsuario.save(usuario);

}




}