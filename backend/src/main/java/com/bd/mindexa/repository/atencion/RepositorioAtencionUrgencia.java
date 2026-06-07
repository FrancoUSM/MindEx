package com.bd.mindexa.repository.atencion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.atencion.SesionUrgencia;

public interface RepositorioAtencionUrgencia extends JpaRepository<SesionUrgencia, Integer> {
Optional<SesionUrgencia> findById(int id_atencion_urgencia);
}
