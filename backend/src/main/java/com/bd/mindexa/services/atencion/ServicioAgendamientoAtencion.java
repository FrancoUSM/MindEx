package com.bd.mindexa.services.atencion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.atencion.DisponibilidadAtencion;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.repository.atencion.RepositorioAgendamientoAtencion;
import com.bd.mindexa.repository.atencion.RepositorioDisponibilidadAtencion;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioAgendamientoAtencion {

    private final RepositorioAgendamientoAtencion repositorioAgendamientoAtencion;
    private final RepositorioDisponibilidadAtencion repositorioDisponibilidadAtencion;
    private final RepositorioPaciente repositorioPaciente;

    public AgendamientoAtencion crearAgendamientoAtencion(int id_paciente, int id_disponibilidad_atencion, LocalDateTime fecha_atencion, String razon_atencion){
    
        DisponibilidadAtencion  disponibilidadAtencion = repositorioDisponibilidadAtencion.findById(id_disponibilidad_atencion)
        .orElseThrow(() -> new RuntimeException("Disponibilidad de atención no encontrada"));

        Paciente paciente = repositorioPaciente.findById(id_paciente)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrada"));
        
        AgendamientoAtencion agendamientoAtencion = new AgendamientoAtencion();
        agendamientoAtencion.setDisponibilidadAtencion(disponibilidadAtencion);
        agendamientoAtencion.setPaciente(paciente);
        agendamientoAtencion.setCreado_en(LocalDateTime.now());
        agendamientoAtencion.setActualizado_en(LocalDateTime.now());

        return repositorioAgendamientoAtencion.save(agendamientoAtencion);
        

    }

    public AgendamientoAtencion actualizarAgendamientoAtencion(AgendamientoAtencion agendamientoAtencion, LocalDateTime fecha_nueva){
        agendamientoAtencion.setFecha_atencion(fecha_nueva);
        agendamientoAtencion.setActualizado_en(LocalDateTime.now());

        return repositorioAgendamientoAtencion.save(agendamientoAtencion);
    }

    public void eliminarAgendamientoAtencion(@NonNull AgendamientoAtencion agendamientoAtencion){
        repositorioAgendamientoAtencion.delete(agendamientoAtencion);
    }

    public List<AgendamientoAtencion> getAllAgendamientoAtencion(int id_profesional) {
        return repositorioAgendamientoAtencion.findByIdProfesional(id_profesional);
    }

    public AgendamientoAtencion getAgendamientoById(int id) {
        return repositorioAgendamientoAtencion.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamiento de atención no encontrado"));
    }

}

