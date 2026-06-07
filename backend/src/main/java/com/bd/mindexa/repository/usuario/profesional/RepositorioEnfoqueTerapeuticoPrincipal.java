package com.bd.mindexa.repository.usuario.profesional;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.usuario.profesional.EnfoqueTerapeuticoPrincipal;

public interface RepositorioEnfoqueTerapeuticoPrincipal extends JpaRepository <EnfoqueTerapeuticoPrincipal, Integer> {
Optional<EnfoqueTerapeuticoPrincipal> findById(int id_enfoque_terapeutico_principal);
}
