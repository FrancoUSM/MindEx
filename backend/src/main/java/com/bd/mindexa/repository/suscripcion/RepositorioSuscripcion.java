package com.bd.mindexa.repository.suscripcion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.suscripcion.Suscripcion;

public interface RepositorioSuscripcion extends JpaRepository<Suscripcion,Integer>{
Optional<Suscripcion> findById(int id_suscripcion);
}
