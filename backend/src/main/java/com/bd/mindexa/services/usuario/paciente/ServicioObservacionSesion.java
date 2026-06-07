package com.bd.mindexa.services.usuario.paciente;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.ObservacionAtencion;
import com.bd.mindexa.models.atencion.SesionClinica;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.repository.atencion.RepositorioObservacionAtencion;
import com.bd.mindexa.repository.atencion.RepositorioSesionClinica;
import com.bd.mindexa.repository.usuario.RepositorioProfesional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioObservacionSesion {

    private final RepositorioSesionClinica repositorioSesionClinica;
    private final RepositorioProfesional repositorioProfesional;
    private final RepositorioObservacionAtencion repositorioObservacionAtencion;

    public ObservacionAtencion crearObservacionAtencion(int id_profesional, int id_sesion_clinica, String observacion){
        ObservacionAtencion observacionAtencion = new ObservacionAtencion();

        Profesional profesional = repositorioProfesional.findById(id_profesional).
            orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        SesionClinica sesionClinica = repositorioSesionClinica.findById(id_sesion_clinica).
            orElseThrow(() -> new RuntimeException("Sesion clinica no encontrado"));
        
        observacionAtencion.setSesionClinica(sesionClinica);
        observacionAtencion.setProfesional(profesional);
        observacionAtencion.setObservacion(observacion);
        observacionAtencion.setCreado_en(LocalDateTime.now());
        observacionAtencion.setActualizado_en(LocalDateTime.now());

        return repositorioObservacionAtencion.save(observacionAtencion);
    }

    public String getObservacionSesion(int id_sesion_clinica){
        ObservacionAtencion observacionAtencion = repositorioObservacionAtencion.findByIdSesionClinica(id_sesion_clinica).
            orElseThrow(() -> new RuntimeException("Observacion de atencion no encontrada"));

        return observacionAtencion.getObservacion();
    }

    public ObservacionAtencion actualizarObservacionAtencion(int id_observacion, String nuevaObservacion) {
        ObservacionAtencion observacionAtencion = repositorioObservacionAtencion.findById(id_observacion)
            .orElseThrow(() -> new RuntimeException("Observación de atención no encontrada"));

        observacionAtencion.setObservacion(nuevaObservacion);
        observacionAtencion.setActualizado_en(LocalDateTime.now());

        return repositorioObservacionAtencion.save(observacionAtencion);
    }


    public void eliminarObservacionAtencion(int id_observacion) {
        ObservacionAtencion observacionAtencion = repositorioObservacionAtencion.findById(id_observacion)
            .orElseThrow(() -> new RuntimeException("Observación de atención no encontrada"));

        repositorioObservacionAtencion.delete(observacionAtencion);
    }

}
