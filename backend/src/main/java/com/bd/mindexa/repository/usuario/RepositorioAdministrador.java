package com.bd.mindexa.repository.usuario;

import java.util.Optional;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RepositorioAdministrador extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findById(int id_administrador);
    
    // Este funciona bien porque pasa el objeto completo
    Optional<Administrador> findByUsuario(Usuario usuario);

    // Solución para buscar por el ID del usuario usando una consulta explícita
    @Query("SELECT a FROM Administrador a WHERE a.usuario.id_usuario = :idUsuario")
    Optional<Administrador> findByUsuarioIdUsuario(@Param("idUsuario") int idUsuario);

}