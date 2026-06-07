package com.bd.mindexa.repository.usuario;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.Usuario;

public interface RepositorioUsuario extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findById(int id_usuario);

}
