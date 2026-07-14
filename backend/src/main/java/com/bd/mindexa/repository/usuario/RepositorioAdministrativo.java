package com.bd.mindexa.repository.usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.Administrativo;

public interface RepositorioAdministrativo extends JpaRepository<Administrativo, Integer> {

    Optional<Administrativo> findById(int id_administrativo);


}
