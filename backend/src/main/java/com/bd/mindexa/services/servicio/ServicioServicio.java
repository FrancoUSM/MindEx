package com.bd.mindexa.services.servicio;

import io.micrometer.common.lang.NonNull;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.servicio.Servicio;
import com.bd.mindexa.repository.servicio.RepositorioServicio;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioServicio {

    private final RepositorioServicio repositorioServicio;


    public Servicio crearServicio(String nombre_servicio, String descripcion_servicio, String tipo_servicio){
        Servicio servicio = new Servicio();

        servicio.setNombreServicio(nombre_servicio);
        servicio.setTipo_servicio(descripcion_servicio);
        servicio.setTipo_servicio(tipo_servicio);
        servicio.setCreado_en(LocalDateTime.now());
        servicio.setActualizado_en(LocalDateTime.now());
        
        return repositorioServicio.save(servicio);
    }

    public void actualizarServicio(Servicio servicio, String nombre_servicio, String descripcion_servicio, String tipo_servicio){
        if (nombre_servicio.equals(servicio.getNombreServicio())) {
            servicio.setNombreServicio(nombre_servicio);
        }if (descripcion_servicio.equals(tipo_servicio)) {
            servicio.setDescripcion(descripcion_servicio);
        }if (tipo_servicio.equals(servicio.getTipo_servicio())) {
            servicio.setTipo_servicio(tipo_servicio);
        }
        servicio.setActualizado_en(LocalDateTime.now());
        repositorioServicio.save(servicio);
    }

    public void desactivarServicio(Servicio servicio){
        servicio.setDesactivado_en(LocalDateTime.now());
        repositorioServicio.save(servicio);
    }
    public void eliminarServicio(@NonNull Servicio servicio){
        repositorioServicio.delete(servicio);
    }

    public Servicio getServicioById(int id){
        return repositorioServicio.findById(id).orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

}
