package com.bd.mindexa.repository.usuario.profesional;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.profesional.EnfoqueTerapeutico;

public interface RepositorioEnfoqueTerapeutico extends JpaRepository<EnfoqueTerapeutico, Integer> {
Optional<EnfoqueTerapeutico> findByNombreEnfoque(String nombreEnfoque);
}
