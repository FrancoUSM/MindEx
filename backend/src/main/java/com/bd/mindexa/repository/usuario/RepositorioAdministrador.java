package com.bd.mindexa.repository.usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.Administrador;

public interface RepositorioAdministrador extends JpaRepository<Administrador, Integer> {

Optional<Administrador> findById(int id_administrador);
Optional<Administrador> findByUsuario_IdUsuario(int id_usuario);

}
