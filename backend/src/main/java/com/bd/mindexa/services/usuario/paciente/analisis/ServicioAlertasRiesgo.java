package com.bd.mindexa.services.usuario.paciente.analisis;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.bd.mindexa.models.usuario.paciente.AlertasRiesgo;
import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAlertasRiesgo;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAnalisisRiesgo;

import io.micrometer.common.lang.NonNull;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioAlertasRiesgo {

    private final RepositorioAnalisisRiesgo repositorioAnalisisRiesgo;
    private final RepositorioAlertasRiesgo repositorioAlertasRiesgo;

  
    //
    public AlertasRiesgo crearAlertasRiesgo(int id_analisis_riesgo, String contenido){
        AlertasRiesgo alertasRiesgo = new AlertasRiesgo();
        AnalisisRiesgo analisisRiesgo = repositorioAnalisisRiesgo.findById(id_analisis_riesgo).
            orElseThrow(() -> new RuntimeException("Analisis de riesgo del paciente no encontrado"));

        alertasRiesgo.setAnalisis_riesgo(analisisRiesgo);
        alertasRiesgo.setContenido_alerta(contenido);
        alertasRiesgo.setFecha_alerta(LocalDate.now());
        alertasRiesgo.setCreado_en(LocalDateTime.now());



        return repositorioAlertasRiesgo.save(alertasRiesgo);
    }

    public void actualizarAlertasRiesgo(AlertasRiesgo alertasRiesgo, String contenido){
        if (!contenido.equals(alertasRiesgo.getContenido_alerta())) {
            alertasRiesgo.setContenido_alerta(contenido);
        }
        repositorioAlertasRiesgo.save(alertasRiesgo);
    }


    public void eliminarAlertasRiesgo(@NonNull AlertasRiesgo alertasRiesgo){
        repositorioAlertasRiesgo.delete(alertasRiesgo);
    }

}
