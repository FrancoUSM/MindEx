package com.bd.mindexa.repository.suscripcion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.suscripcion.EstadoSuscripcion;

public interface RepositorioEstadoSuscripcion extends JpaRepository<EstadoSuscripcion,Integer>{
Optional<EstadoSuscripcion> findById(int id_estado_suscripcion);
}
