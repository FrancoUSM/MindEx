package com.bd.mindexa.repository.autenticacion;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.autenticacion.Autenticacion;
import com.bd.mindexa.models.usuario.Usuario;

public interface RepositorioAutenticacion extends JpaRepository<Autenticacion, Integer> {
    Optional<Autenticacion> findByUsuario(Usuario usuario);
}
