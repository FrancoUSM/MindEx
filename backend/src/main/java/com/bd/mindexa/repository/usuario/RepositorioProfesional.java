package com.bd.mindexa.repository.usuario;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.Profesional;

public interface RepositorioProfesional extends JpaRepository<Profesional, Integer> {
Optional<Profesional> findById(int id_profesional);
Optional<Profesional> findByUsuario_Id_usuario(int id_usuario);
}
