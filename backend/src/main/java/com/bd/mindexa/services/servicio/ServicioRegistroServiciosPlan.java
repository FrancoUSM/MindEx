package com.bd.mindexa.services.servicio;

import java.time.LocalDateTime;

import com.bd.mindexa.models.plan.Plan;
import com.bd.mindexa.models.plan.RegistroServiciosPlan;
import com.bd.mindexa.models.servicio.Servicio;
import com.bd.mindexa.repository.plan.RepositorioPlan;
import com.bd.mindexa.repository.plan.RepositorioRegistroServicioPlan;
import com.bd.mindexa.repository.servicio.RepositorioServicio;

import io.micrometer.common.lang.NonNull;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioRegistroServiciosPlan {

    private final RepositorioRegistroServicioPlan repositorioRegistroServicioPlan;
    private final RepositorioServicio repositorioServicio;
    private final RepositorioPlan repositorioPlan;
    
    public RegistroServiciosPlan crearRegistroServiciosPlan(int id_servicio, int id_servicios_plan){
        
        RegistroServiciosPlan registroServiciosPlan = new RegistroServiciosPlan();
        
        Plan plan = repositorioPlan.findById(id_servicios_plan).
                orElseThrow(() -> new RuntimeException("Plan de servicios no encontrado"));

        Servicio servicio = repositorioServicio.findById(id_servicio).
        orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        registroServiciosPlan.setServicio(servicio);
        registroServiciosPlan.setPlan(plan);
        registroServiciosPlan.setCreado_en(LocalDateTime.now());
        registroServiciosPlan.setActualizado_en(LocalDateTime.now());

        return repositorioRegistroServicioPlan.save(registroServiciosPlan);
    }


    public void desactivarRegistroServiciosPlan(RegistroServiciosPlan registroServiciosPlan){
        registroServiciosPlan.setDesactivado_en(LocalDateTime.now());
        repositorioRegistroServicioPlan.save(registroServiciosPlan);
    }

    public void eliminarRegistroServiciosPlan(@NonNull RegistroServiciosPlan registroServiciosPlan){
        repositorioRegistroServicioPlan.delete(registroServiciosPlan);
    }

}
