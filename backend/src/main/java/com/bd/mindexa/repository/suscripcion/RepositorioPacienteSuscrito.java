package com.bd.mindexa.repository.suscripcion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.suscripcion.PacienteSuscrito;

public interface RepositorioPacienteSuscrito extends JpaRepository<PacienteSuscrito, Integer> {
    
}
