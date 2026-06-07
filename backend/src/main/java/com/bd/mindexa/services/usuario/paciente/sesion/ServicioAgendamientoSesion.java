package com.bd.mindexa.services.usuario.paciente.sesion;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.atencion.DisponibilidadAtencion;
import com.bd.mindexa.models.atencion.AgendamientoAtencion.EstadoAgendamiento;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.repository.atencion.RepositorioAgendamientoAtencion;
import com.bd.mindexa.repository.atencion.RepositorioDisponibilidadAtencion;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioAgendamientoSesion {

    private final RepositorioAgendamientoAtencion repositorioAgendamientoAtencion;
    private final RepositorioPaciente repositorioPaciente;
    private final RepositorioDisponibilidadAtencion repositorioDisponibilidadAtencion;

public AgendamientoAtencion crearAgendamientoAtencion(int id_paciente, int id_disponibilidad_atencion, LocalDateTime fecha_atencion, String razon_atencion, String modalidad, String estado){

    AgendamientoAtencion agendamientoAtencion = new AgendamientoAtencion();

    Paciente paciente = repositorioPaciente.findById(id_paciente).
        orElseThrow(() -> new RuntimeException("Paciente no encontrado/a"));

     DisponibilidadAtencion disponibilidadAtencion = repositorioDisponibilidadAtencion.findById(id_disponibilidad_atencion).
        orElseThrow(() -> new RuntimeException("Disponibilidad de atención no encontrada"));

    agendamientoAtencion.setDisponibilidadAtencion(disponibilidadAtencion);
    agendamientoAtencion.setPaciente(paciente);
    agendamientoAtencion.setEstado(EstadoAgendamiento.valueOf(estado));
    agendamientoAtencion.setRazon_atencion(razon_atencion);
    agendamientoAtencion.setModalidad(modalidad);
    agendamientoAtencion.setFecha_atencion(fecha_atencion);
    agendamientoAtencion.setCreado_en(LocalDateTime.now());
    agendamientoAtencion.setActualizado_en(LocalDateTime.now());

    return repositorioAgendamientoAtencion.save(agendamientoAtencion);
    
}

public void desactivarAgendamientoAtencion(AgendamientoAtencion agendamientoAtencion){
    agendamientoAtencion.setDesactivado_en(LocalDateTime.now());
    repositorioAgendamientoAtencion.save(agendamientoAtencion);
}

public void eliminarAgendamientoAtencion(@NonNull AgendamientoAtencion agendamientoAtencion){
    repositorioAgendamientoAtencion.delete(agendamientoAtencion);
}



}
