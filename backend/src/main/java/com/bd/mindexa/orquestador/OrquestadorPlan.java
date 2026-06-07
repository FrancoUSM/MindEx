package com.bd.mindexa.orquestador;
import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTORegistroPlan;
import com.bd.mindexa.models.plan.Plan;
import com.bd.mindexa.models.servicio.Servicio;
import com.bd.mindexa.services.servicio.ServicioRegistroServiciosPlan;
import com.bd.mindexa.services.servicio.ServicioServicio;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrquestadorPlan {

    private final ServicioServicio servicioServicio;
    private final ServicioRegistroServiciosPlan servicioRegistroServiciosPlan;
    private final com.bd.mindexa.services.plan.ServicioPlan servicioPlan;

    @Transactional
    public void crearRegistroPlan(DTORegistroPlan request){
        //Crear plan
        Plan plan = servicioPlan.crearPlan(request.nombre_plan, request.tipo_plan, request.descripcion_plan,request.precio_por_usuario, request.duracion_meses);
        //Asignar servicios al plan
        request.servicios.forEach(servicio -> {
            Servicio servicioEntity = servicioServicio.getServicioById(servicio.getId_servicio());
            servicioRegistroServiciosPlan.crearRegistroServiciosPlan(servicioEntity.getId_servicio(), plan.getId_plan());
        });
        

    }
}
