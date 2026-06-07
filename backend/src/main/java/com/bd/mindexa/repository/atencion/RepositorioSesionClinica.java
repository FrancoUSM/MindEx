package com.bd.mindexa.repository.atencion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.atencion.SesionClinica;

public interface RepositorioSesionClinica extends JpaRepository<SesionClinica, Integer> {
Optional<SesionClinica> findById(int id_atencion_agendada);


}
