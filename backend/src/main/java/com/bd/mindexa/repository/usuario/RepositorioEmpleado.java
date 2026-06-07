package com.bd.mindexa.repository.usuario;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.Empleado;

public interface RepositorioEmpleado extends JpaRepository<Empleado, Integer> {
Optional<Empleado> findById(int id_empleado);

}
