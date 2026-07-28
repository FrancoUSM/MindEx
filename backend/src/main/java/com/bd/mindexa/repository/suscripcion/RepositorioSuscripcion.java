package com.bd.mindexa.repository.suscripcion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.models.suscripcion.Suscripcion;

public interface RepositorioSuscripcion extends JpaRepository<Suscripcion,Integer>{
Optional<Suscripcion> findById(int id_suscripcion);
@Query("SELECT s FROM Suscripcion s WHERE s.id_empresa = :idEmpresa") // Cambia 'empresaId' por el nombre real de tu propiedad
Optional<Suscripcion> findByIdEmpresa(@Param("idEmpresa") int idEmpresa);

}
