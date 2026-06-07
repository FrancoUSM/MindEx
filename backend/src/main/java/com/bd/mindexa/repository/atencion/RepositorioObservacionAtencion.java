package com.bd.mindexa.repository.atencion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.atencion.ObservacionAtencion;

public interface RepositorioObservacionAtencion extends JpaRepository<ObservacionAtencion, Integer> {
Optional<ObservacionAtencion> findById(int id_observacion_atencion);
@org.springframework.data.jpa.repository.Query("SELECT o FROM ObservacionAtencion o WHERE o.sesionClinica.id_atencion_agendada = :id")
Optional<ObservacionAtencion> findByIdSesionClinica(@org.springframework.data.repository.query.Param("id") int id);
}
