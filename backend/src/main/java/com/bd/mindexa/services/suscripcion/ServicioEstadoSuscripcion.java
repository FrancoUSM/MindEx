package com.bd.mindexa.services.suscripcion;


import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.SesionClinica.Estado;
import com.bd.mindexa.models.suscripcion.EstadoSuscripcion;
import com.bd.mindexa.models.suscripcion.Suscripcion;
import com.bd.mindexa.repository.suscripcion.RepositorioEstadoSuscripcion;
import com.bd.mindexa.repository.suscripcion.RepositorioSuscripcion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioEstadoSuscripcion {

    private final RepositorioEstadoSuscripcion repositorioEstadoSuscripcion;
    private final RepositorioSuscripcion repositorioSuscripcion;

    public EstadoSuscripcion crearEstadoSuscripcion(int id_suscripcion, String estado){
        EstadoSuscripcion estadoSuscripcion = new EstadoSuscripcion();

        Suscripcion suscripcion = repositorioSuscripcion.findById(id_suscripcion). 
            orElseThrow(() -> new RuntimeException("Suscripcion no encontrada"));

        estadoSuscripcion.setSuscripcionEmpresa(suscripcion);
        estadoSuscripcion.setEstado(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.valueOf(estado));
        estadoSuscripcion.setCreado_en(LocalDateTime.now());
        estadoSuscripcion.setActualizado_en(LocalDateTime.now());
        
        
        return repositorioEstadoSuscripcion.save(estadoSuscripcion);
    }

    public void actualizarEstadoSuscripcion(EstadoSuscripcion estadoSuscripcion, String estado){
        if (com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.valueOf(estado).equals(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.ACTIVA)){
            estadoSuscripcion.setEstado(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.ACTIVA);
        }
        else if (com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.valueOf(estado).equals(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.CANCELADA)){
            estadoSuscripcion.setEstado(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.CANCELADA);
            estadoSuscripcion.setDesactivado_en(LocalDateTime.now());
        }
         else if (com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.valueOf(estado).equals(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.SUSPENDIDA)){
            estadoSuscripcion.setEstado(com.bd.mindexa.models.suscripcion.EstadoSuscripcion.Estado.SUSPENDIDA);
        }
        estadoSuscripcion.setActualizado_en(LocalDateTime.now());
        repositorioEstadoSuscripcion.save(estadoSuscripcion);

    }


    

}
