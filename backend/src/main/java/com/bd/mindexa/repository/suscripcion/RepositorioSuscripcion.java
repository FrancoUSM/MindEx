package com.bd.mindexa.repository.suscripcion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.models.suscripcion.Suscripcion;

public interface RepositorioSuscripcion extends JpaRepository<Suscripcion,Integer>{
Optional<Suscripcion> findById(int id_suscripcion);
@Query("SELECT s FROM Suscripcion s JOIN s.empresa e WHERE e.idEmpresa = :idEmpresa")
Optional<Suscripcion> obtenerPorEmpresaId(@Param("idEmpresa") int idEmpresa);


}
