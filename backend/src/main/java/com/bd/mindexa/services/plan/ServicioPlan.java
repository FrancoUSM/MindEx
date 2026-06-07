package com.bd.mindexa.services.plan;
import java.time.LocalDateTime;
import java.util.List;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.plan.Plan;
import com.bd.mindexa.repository.plan.RepositorioPlan;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioPlan {

    private final RepositorioPlan repositorioPlan;
    
    public Plan crearPlan(String nombre_plan, String tipo_plan, String descripcion_plan, int precio_por_usuario, int duracion_meses){
        Plan plan = new Plan();

        plan.setNombre_plan(nombre_plan);
        plan.setTipo_plan(tipo_plan);
        plan.setPrecio_por_usuario(precio_por_usuario);
        plan.setDuracion_meses(duracion_meses);
        plan.setCreado_en(LocalDateTime.now());
        plan.setActualizado_en(LocalDateTime.now());


        return repositorioPlan.save(plan);

    }

    public void actualizarPlan(Plan plan, String nombre_plan, String tipo_plan, String descripcion_plan, int precio_por_usuario, int duracion_meses){    
    
        plan.setActualizado_en(LocalDateTime.now());
        if (!nombre_plan.equals(plan.getNombre_plan())){
            plan.setNombre_plan(nombre_plan);
        }if (!tipo_plan.equals(plan.getTipo_plan())) {
            plan.setTipo_plan(tipo_plan);
        }if(!descripcion_plan.equals(plan.getDescripcion_plan())){
            plan.setDescripcion_plan(descripcion_plan);
        }if(precio_por_usuario != plan.getPrecio_por_usuario()){
            plan.setPrecio_por_usuario(precio_por_usuario);
        }if (duracion_meses != plan.getDuracion_meses()){
            plan.setDuracion_meses(duracion_meses);
        }
        repositorioPlan.save(plan);
        log.info("Plan actualizado");
        
    }   

  
    public void eliminarPlan(int id){
        Plan plan = repositorioPlan.findById(id).
        orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        plan.setDesactivado_en(LocalDateTime.now());
        repositorioPlan.save(plan);
        log.info("Plan desactivado");
    }

    public List<Plan> getPlanes(){
        return repositorioPlan.findAll();
    }

    public Plan getPlanById(int id){
        return repositorioPlan.findById(id).
        orElseThrow(() -> new RuntimeException("Plan no encontrado"));

    }


}
