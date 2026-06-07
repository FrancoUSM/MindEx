package com.bd.mindexa.services.servicio;



import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.atencion.SesionUrgencia;
import com.bd.mindexa.models.servicio.Comision;
import com.bd.mindexa.repository.atencion.RepositorioAgendamientoAtencion;
import com.bd.mindexa.repository.atencion.RepositorioSesionUrgencia;
import com.bd.mindexa.repository.servicio.RepositorioComision;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioComision {

    private final RepositorioAgendamientoAtencion repositorioAgendamientoAtencion;
    private final RepositorioSesionUrgencia repositorioSesionUrgencia;
    private final RepositorioComision repositorioComision;

    public Comision crearComision(Integer id_agendamiento_sesion, Integer id_sesion_urgencia){
        Comision comision = new Comision();

       if (id_agendamiento_sesion != null){
        AgendamientoAtencion agendamientoAtencion = repositorioAgendamientoAtencion.findById(id_agendamiento_sesion).
            orElseThrow(() -> new RuntimeException("Agendamiento del paciente no encontrado"));
        comision.setAgendamiento_atencion(agendamientoAtencion);


    }else if(id_sesion_urgencia != null){
        SesionUrgencia sesionUrgencia = repositorioSesionUrgencia.findById(id_sesion_urgencia).
            orElseThrow(() -> new RuntimeException("Sesion de urgencia no encontrada"));
        comision.setAtencion_urgencia(sesionUrgencia);
    }else{
        throw new RuntimeException("Debe proporcionar un ID");
    }
        comision.setCreado_en(LocalDateTime.now());

        return repositorioComision.save(comision);
    }


    public void eliminarComision(@NonNull Comision comision){
        repositorioComision.delete(comision);
    }

    public Comision obtenerComision(@NonNull int id){
        return repositorioComision.findById(id).
        orElseThrow(() -> new RuntimeException("Comision no encontrada"));

}

}