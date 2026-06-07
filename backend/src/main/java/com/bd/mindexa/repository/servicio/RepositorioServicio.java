package com.bd.mindexa.repository.servicio;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.servicio.Servicio;

public interface RepositorioServicio extends JpaRepository<Servicio, Integer>{
Optional<Servicio> findById(int id_servicio);
}
