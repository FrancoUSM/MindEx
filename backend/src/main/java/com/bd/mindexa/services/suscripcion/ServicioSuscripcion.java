package com.bd.mindexa.services.suscripcion;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.empresa.Empresa;
import com.bd.mindexa.models.plan.Plan;
import com.bd.mindexa.models.suscripcion.Suscripcion;
import com.bd.mindexa.repository.empresa.RepositorioEmpresa;
import com.bd.mindexa.repository.plan.RepositorioPlan;
import com.bd.mindexa.repository.suscripcion.RepositorioSuscripcion;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioSuscripcion {

    private final RepositorioSuscripcion repositorioSuscripcion;
    private final RepositorioEmpresa repositorioEmpresa;
    private final RepositorioPlan repositorioPlan;
    private final ServicioEstadoSuscripcion servicioEstadoSuscripcion;
    
    public Suscripcion crearSuscripcion(int id_empresa, int id_plan, LocalDate fecha_inicio, LocalDate fecha_fin){
        Suscripcion suscripcion = new Suscripcion();
        
        Empresa empresa = repositorioEmpresa.findById(id_empresa).
                orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        Plan plan = repositorioPlan.findById(id_plan).
                orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        
        suscripcion.setEmpresa(empresa);
        suscripcion.setPlan(plan);
        suscripcion.setFecha_inicio(fecha_inicio);
        suscripcion.setFecha_fin(fecha_fin);
        suscripcion.setCreado_en(LocalDateTime.now());
        suscripcion.setActualizado_en(LocalDateTime.now());
        Suscripcion saved = repositorioSuscripcion.save(suscripcion);
        servicioEstadoSuscripcion.crearEstadoSuscripcion(saved.getId_suscripcion(), "ACTIVA");
        return saved;

    }

    public void actualizarSuscripcion(Suscripcion suscripcion, LocalDate fecha_inicio, LocalDate fecha_fin){
        suscripcion.setFecha_inicio(fecha_inicio);
        suscripcion.setFecha_fin(fecha_fin);
        suscripcion.setActualizado_en(LocalDateTime.now());

        repositorioSuscripcion.save(suscripcion);
    }

    public void desactivarSuscripcion(int id){
        Suscripcion suscripcion = repositorioSuscripcion.findById(id)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
        suscripcion.setDesactivado_en(LocalDateTime.now());
        repositorioSuscripcion.save(suscripcion);
    }

    public void eliminarSuscripcion(@NonNull Suscripcion suscripcion){
        repositorioSuscripcion.delete(suscripcion);
    }

    public List<Suscripcion> getSuscripciones(){
        return repositorioSuscripcion.findAll();
    }

    public Suscripcion getSuscripcionById(int id){
        return repositorioSuscripcion.findById(id)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
    }

}
