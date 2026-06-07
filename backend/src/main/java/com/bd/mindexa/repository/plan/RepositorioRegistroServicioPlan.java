package com.bd.mindexa.repository.plan;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.plan.RegistroServiciosPlan;

public interface RepositorioRegistroServicioPlan extends JpaRepository<RegistroServiciosPlan,Integer>{
Optional<RegistroServiciosPlan> findById(int id_registro_servicios_plan);
}
