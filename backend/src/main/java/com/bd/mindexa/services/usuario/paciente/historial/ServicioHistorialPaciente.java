package com.bd.mindexa.services.usuario.paciente.historial;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialPaciente;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioHistorialPaciente {

    private final RepositorioHistorialPaciente repositorioHistorialPaciente;
    private final RepositorioPaciente repositorioPaciente;

    public HistorialPaciente crearHistorialPaciente(int id_paciente){

        HistorialPaciente historialPaciente = new HistorialPaciente();
        Paciente paciente = repositorioPaciente.findById(id_paciente).
        orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        
        historialPaciente.setCreado_en(LocalDateTime.now());
        historialPaciente.setActualizado_en(LocalDateTime.now());
        historialPaciente.setPaciente(paciente);
        return repositorioHistorialPaciente.save(historialPaciente);
    }

    public void desactivarHistorialPaciente(HistorialPaciente historialPaciente){
        historialPaciente.setDesactivado_en(LocalDateTime.now());
        repositorioHistorialPaciente.save(historialPaciente);
    }

    public void eliminarHistorialPaciente(@NonNull HistorialPaciente historialPaciente){
        repositorioHistorialPaciente.delete(historialPaciente);
    }

    public HistorialPaciente actualizarHistorialPaciente(int id_historial_paciente, int id_paciente){
        HistorialPaciente historialPaciente = repositorioHistorialPaciente.findById(id_historial_paciente).
        orElseThrow(() -> new RuntimeException("Historial de paciente no encontrado"));

        Paciente paciente = repositorioPaciente.findById(id_paciente). 
        orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        historialPaciente.setPaciente(paciente);
        historialPaciente.setActualizado_en(LocalDateTime.now());
        return repositorioHistorialPaciente.save(historialPaciente);
    }

    public HistorialPaciente obtenerHistorialPaciente(int id_historial_paciente){
        return repositorioHistorialPaciente.findById(id_historial_paciente).
        orElseThrow(() -> new RuntimeException("Historial de paciente no encontrado"));
    }
}
