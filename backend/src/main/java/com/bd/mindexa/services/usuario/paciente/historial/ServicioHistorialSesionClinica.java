package com.bd.mindexa.services.usuario.paciente.historial;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.atencion.SesionClinica;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.models.usuario.paciente.HistorialSesionClinica;
import com.bd.mindexa.repository.atencion.RepositorioSesionClinica;
import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialPaciente;
import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialSesionClinica;

import io.micrometer.common.lang.NonNull;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioHistorialSesionClinica {

    private final RepositorioHistorialSesionClinica repositorioHistorialSesionClinica;
    private final RepositorioHistorialPaciente repositorioHistorialPaciente;
    private final RepositorioSesionClinica repositorioSesionClinica;


    public HistorialSesionClinica crearHistorialSesionClinica(int id_historial_paciente, int id_sesion_clinica){
        HistorialSesionClinica historialSesionClinica = new HistorialSesionClinica();

        HistorialPaciente historialPaciente = repositorioHistorialPaciente.findById(id_historial_paciente).
        orElseThrow(() -> new RuntimeException("Historial de paciente no encontrado"));

        SesionClinica sesionClinica = repositorioSesionClinica.findById(id_sesion_clinica).
        orElseThrow(() -> new RuntimeException("Historial de paciente no encontrado"));

        historialSesionClinica.setHistorial_paciente(historialPaciente);
        historialSesionClinica.setSesion_clinica(sesionClinica);
        historialSesionClinica.setFecha_resultado(LocalDate.now());
        
        return repositorioHistorialSesionClinica.save(historialSesionClinica);
    }

    public void desactivarHistorialSesionClinica(HistorialSesionClinica historialSesionClinica){
        historialSesionClinica.setDesactivado_en(LocalDateTime.now());
        repositorioHistorialSesionClinica.save(historialSesionClinica);
    }
    public void eliminarHistorialSesionClinica(@NonNull HistorialSesionClinica historialSesionClinica){
        repositorioHistorialSesionClinica.delete(historialSesionClinica);
    }
}
