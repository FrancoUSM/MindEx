package com.bd.mindexa.services.atencion;
import java.time.LocalDateTime;
import com.bd.mindexa.models.atencion.ObservacionAtencion;
import com.bd.mindexa.repository.atencion.RepositorioSesionClinica;

import io.micrometer.common.lang.NonNull;

import com.bd.mindexa.repository.atencion.RepositorioObservacionAtencion;
import com.bd.mindexa.models.atencion.SesionClinica;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
@Slf4j
@RequiredArgsConstructor
@Service
public class ServicioObservacionAtencion {

    private final RepositorioObservacionAtencion repositorioObservacionAtencion;
    private final RepositorioSesionClinica repositorioSesionClinica;

    public ObservacionAtencion crearObservacionAtencion(int id_atencion_agendada, String observacion){
        ObservacionAtencion observacionAtencion = new ObservacionAtencion();

        SesionClinica sesionClinica = repositorioSesionClinica.findById(id_atencion_agendada)
        .orElseThrow(() -> new RuntimeException("Día disponible no encontrado"));

        observacionAtencion.setObservacion(observacion);
        observacionAtencion.setSesionClinica(sesionClinica);
        observacionAtencion.setCreado_en(LocalDateTime.now());
        observacionAtencion.setActualizado_en(LocalDateTime.now());
        log.info("Observación de atención creada");
        return repositorioObservacionAtencion.save(observacionAtencion);
    }

    public void actualizarObservacionAtencion(ObservacionAtencion observacionAtencion, String observacionNueva){
        observacionAtencion.setObservacion(observacionNueva);
        repositorioObservacionAtencion.save(observacionAtencion);
        log.info("Observación de atención actualizada");
    }

    public void eliminarObservacionAtencion(@NonNull ObservacionAtencion observacionAtencion){
        repositorioObservacionAtencion.delete(observacionAtencion);
        log.info("Observación de atención eliminada");
    }
}   
