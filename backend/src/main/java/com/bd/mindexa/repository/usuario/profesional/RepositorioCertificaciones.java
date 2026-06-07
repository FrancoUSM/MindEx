package com.bd.mindexa.repository.usuario.profesional;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.profesional.Certificaciones;

public interface RepositorioCertificaciones extends JpaRepository<Certificaciones, Integer>{
Optional<Certificaciones> findById(int id_certificaciones);
}
