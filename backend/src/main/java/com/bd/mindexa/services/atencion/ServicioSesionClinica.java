package com.bd.mindexa.services.atencion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.atencion.SesionClinica;
import com.bd.mindexa.models.atencion.SesionClinica.Estado;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;
import com.bd.mindexa.repository.atencion.RepositorioAgendamientoAtencion;
import com.bd.mindexa.repository.atencion.RepositorioSesionClinica;
import com.bd.mindexa.repository.usuario.profesional.RepositorioServicioProfesional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioSesionClinica {

    private final RepositorioSesionClinica repositorioSesionClinica;
    private final RepositorioServicioProfesional repositorioServicioProfesional;
    private final RepositorioAgendamientoAtencion repositorioAgendamientoAtencion;

    public SesionClinica crearSesionClinica(int id_agendamiento_atencion, int id_servicio_profesional, LocalDate fecha_atencion){
        SesionClinica sesionClinica = new SesionClinica();

        ServicioProfesional buscarServicioProfesional = repositorioServicioProfesional.findById(id_servicio_profesional)
        .orElseThrow(() -> new RuntimeException("Servicio profesional no encontrado"));

        AgendamientoAtencion  buscarAgendamientoAtencion = repositorioAgendamientoAtencion.findById(id_agendamiento_atencion)
        .orElseThrow(() -> new RuntimeException("Agendamiento de atención no encontrado"));

        sesionClinica.setServicio_profesional(buscarServicioProfesional);
        sesionClinica.setAgendamiento_atencion(buscarAgendamientoAtencion);
        sesionClinica.setFecha_atencion(fecha_atencion);
        sesionClinica.setEmpezada_en(LocalDateTime.now());
        sesionClinica.setCreado_en(LocalDateTime.now());
        sesionClinica.setEstado(SesionClinica.Estado.valueOf("ACTIVO"));

        log.info("Sesion clinica creada");
        return repositorioSesionClinica.save(sesionClinica);

    }

    public void terminarSesionClinica(SesionClinica sesionClinica, LocalDateTime terminada_en){
        sesionClinica.setTerminada_en(terminada_en);
        sesionClinica.setEstado(Estado.INACTIVO);
        repositorioSesionClinica.save(sesionClinica);
    }

    public SesionClinica getSesionClinicaById(int id_sesion_clinica){
        return repositorioSesionClinica.findById(id_sesion_clinica)
        .orElseThrow(() -> new RuntimeException("Sesión clínica no encontrada"));
    }

    public void eliminarSesionClinica(SesionClinica sesionClinica){
        repositorioSesionClinica.delete(sesionClinica);
    }


}
