package com.bd.mindexa.services.usuario.paciente.analisis;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.paciente.AlertasRiesgo;
import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo.EstadoRiesgo;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAnalisisRiesgo;
import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialPaciente;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioAnalisisRiesgo {

    private final RepositorioAnalisisRiesgo repositorioAnalisisRiesgo;
    private final RepositorioHistorialPaciente repositorioHistorialPaciente;

    public AnalisisRiesgo crearAnalisisRiesgo(int id_historial_paciente, String contenido, String estado_riesgo, LocalDate fecha_analisis){
        AnalisisRiesgo analisisRiesgo = new AnalisisRiesgo();

        HistorialPaciente historialPaciente = repositorioHistorialPaciente.findById(id_historial_paciente).
            orElseThrow(() -> new RuntimeException("Historial del paciente no encontrado"));

        
        analisisRiesgo.setHistorialPaciente(historialPaciente);
        analisisRiesgo.setContenido_analisis(contenido);
        analisisRiesgo.setEstado_riesgo(EstadoRiesgo.valueOf(estado_riesgo));
        analisisRiesgo.setCreado_en(LocalDateTime.now());
        analisisRiesgo.setActualizado_en(LocalDateTime.now());
        
        return repositorioAnalisisRiesgo.save(analisisRiesgo);
    }

    public void actualizarAnalisisRiesgo(AnalisisRiesgo analisisRiesgo, String contenido, String estado_riesgo){
        if (contenido.equals(analisisRiesgo.getContenido_analisis())) {
            analisisRiesgo.setContenido_analisis(contenido);
        }    
        if (EstadoRiesgo.valueOf(estado_riesgo).equals(EstadoRiesgo.RIESGO_ALTO)) {
            analisisRiesgo.setEstado_riesgo(EstadoRiesgo.RIESGO_ALTO);
        }else if (EstadoRiesgo.valueOf(estado_riesgo).equals(EstadoRiesgo.RIESGO_MEDIANO)) {
            analisisRiesgo.setEstado_riesgo(EstadoRiesgo.RIESGO_MEDIANO);
        } else if (EstadoRiesgo.valueOf(estado_riesgo).equals(EstadoRiesgo.RIESGO_BAJO)) {
            analisisRiesgo.setEstado_riesgo(EstadoRiesgo.RIESGO_BAJO);
        }
        analisisRiesgo.setActualizado_en(LocalDateTime.now());
        repositorioAnalisisRiesgo.save(analisisRiesgo);
    }

    public void desactivarAnalisisRiesgo(AnalisisRiesgo analisisRiesgo){
        analisisRiesgo.setDesactivado_en(LocalDateTime.now());
        repositorioAnalisisRiesgo.save(analisisRiesgo);
    }

    public void eliminarAnalisisRiesgo(@NonNull AnalisisRiesgo analisisRiesgo){
        repositorioAnalisisRiesgo.delete(analisisRiesgo);
    }


}
