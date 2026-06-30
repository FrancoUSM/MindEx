package com.bd.mindexa.services.atencion;
import java.util.List;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTOAgendamientoRequest;
import com.bd.mindexa.dto.registros.DTOAgendamientoResponse;
import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.repository.atencion.RepositorioAgendamientoAtencion;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
import com.bd.mindexa.repository.usuario.RepositorioProfesional;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;
import com.bd.mindexa.repository.usuario.profesional.RepositorioServicioProfesional;
import com.bd.mindexa.services.usuario.ServicioPaciente;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicioAgendamiento {

    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioPaciente repositorioPaciente;
    private final RepositorioProfesional repositorioProfesional;
    private final RepositorioServicioProfesional repositorioServicioProfesional;
    private final RepositorioAgendamientoAtencion repositorioAgendamiento;
    private final ServicioPaciente servicioPaciente;

    @Transactional
    public DTOAgendamientoResponse crearAgendamiento(DTOAgendamientoRequest req) {
        Usuario usuario = repositorioUsuario.findById(req.id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Paciente paciente = repositorioPaciente.findByUsuario(usuario)
                .orElseGet(() -> servicioPaciente.crearPaciente(req.id_usuario));

        Profesional profesional = repositorioProfesional.findById(req.id_profesional)
        .orElse(null);

        

        AgendamientoAtencion cita = new AgendamientoAtencion();
        cita.setPaciente(paciente);
        cita.setFecha_atencion(LocalDateTime.parse(req.fecha + "T" + req.hora));
        cita.setRazon_atencion(req.motivo);
        cita.setModalidad(req.hora != null ? req.hora : "");
        cita.setEstado(AgendamientoAtencion.EstadoAgendamiento.ACTIVO);
        cita.setCreado_en(LocalDateTime.now());
        cita.setActualizado_en(LocalDateTime.now());

        return new DTOAgendamientoResponse(repositorioAgendamiento.save(cita));
    }

    public List<DTOAgendamientoResponse> getMisCitas(int id_usuario) {
        Usuario usuario = repositorioUsuario.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return repositorioPaciente.findByUsuario(usuario)
                .map(p -> repositorioAgendamiento
                        .findByPaciente(p)
                        .stream()
                        .map(DTOAgendamientoResponse::new)
                        .toList())
                .orElse(List.of());
    }

    @Transactional
    public void cancelarAgendamiento(int id_agendamiento) {
        AgendamientoAtencion cita = repositorioAgendamiento.findById(id_agendamiento)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        cita.setEstado(AgendamientoAtencion.EstadoAgendamiento.INACTIVO);
        cita.setActualizado_en(LocalDateTime.now());
        repositorioAgendamiento.save(cita);
    }
}
