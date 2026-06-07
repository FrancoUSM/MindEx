package com.bd.mindexa.repository.servicio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.servicio.Comision;

public interface RepositorioComision extends JpaRepository<Comision, Integer>{
Optional<Comision> findById(int id_comision);
}
