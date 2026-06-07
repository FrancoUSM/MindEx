package com.bd.mindexa.services.usuario.profesional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTORegistroServicioProfesional;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;
//import com.bd.mindexa.repository.usuario.RepositorioUsuarioProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioServicioProfesional;

import io.micrometer.common.lang.NonNull;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioServicioProfesional {

    private final RepositorioServicioProfesional repositorioServicioProfesional;


    public ServicioProfesional crearServicioProfesional(Profesional profesional, DTORegistroServicioProfesional servicio){


        ServicioProfesional servicioProfesional = new ServicioProfesional();
        servicioProfesional.setNombreServicio(servicio.nombreServicio);
        servicioProfesional.setDescripcion_servicio(servicio.descripcion_servicio);
        servicioProfesional.setDuracion_servicio(servicio.duracion_servicio);
        servicioProfesional.setPrecio_servicio(servicio.precio_servicio);
        servicioProfesional.setProfesional(profesional);
        servicioProfesional.setCreado_en(LocalDateTime.now());
        servicioProfesional.setActualizado_en(LocalDateTime.now());

        return repositorioServicioProfesional.save(servicioProfesional);

    }

    public void actualizarServicioProfesional(ServicioProfesional servicioProfesional, String nombre_servicio, String descripcion_servicio, Integer duracion_servicio, Integer precio_servicio){
        
        if (!nombre_servicio.equals(servicioProfesional.getNombreServicio())) {
            servicioProfesional.setNombreServicio(nombre_servicio);
        }
        if (!descripcion_servicio.equals(servicioProfesional.getDescripcion_servicio())){
            servicioProfesional.setDescripcion_servicio(descripcion_servicio);
        }
        if (!duracion_servicio.equals(servicioProfesional.getDuracion_servicio())) {
            servicioProfesional.setDuracion_servicio(duracion_servicio);
        }
        if (!precio_servicio.equals(servicioProfesional.getPrecio_servicio())) {
            servicioProfesional.setPrecio_servicio(precio_servicio);
        }
        servicioProfesional.setActualizado_en(LocalDateTime.now());

    }

    public void desactivarServicioProfesional(ServicioProfesional servicioProfesional){
        servicioProfesional.setDesactivado_en(LocalDateTime.now());
        repositorioServicioProfesional.save(servicioProfesional);
    }

    public void eliminarServicioProfesional(@NonNull ServicioProfesional servicioProfesional){
        repositorioServicioProfesional.delete(servicioProfesional);
    }
}
