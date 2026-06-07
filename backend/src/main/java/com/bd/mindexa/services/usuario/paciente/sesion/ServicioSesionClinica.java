package com.bd.mindexa.services.usuario.paciente.sesion;

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

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
@Service("servicioSesionClinicaPaciente")
@Slf4j
@RequiredArgsConstructor
public class ServicioSesionClinica {

    private final RepositorioServicioProfesional repositorioServicioProfesional;
    private final RepositorioAgendamientoAtencion repositorioAgendamientoAtencion;
    private final RepositorioSesionClinica repositorioSesionClinica;

    public SesionClinica crearSesionClinica(int id_servicio_profesional, int id_agendamiento_atencion, LocalDate fecha_atencion, LocalDateTime empezada_en, LocalDateTime terminada_en, String estado){

    SesionClinica sesionClinica = new SesionClinica();

    ServicioProfesional servicioProfesional = repositorioServicioProfesional.findById(id_servicio_profesional).
            orElseThrow(() -> new RuntimeException("Servicio profesional no encontrado"));

    AgendamientoAtencion agendamientoAtencion = repositorioAgendamientoAtencion.findById(id_agendamiento_atencion).
                    orElseThrow(() -> new RuntimeException("Agendamiento de atención no encontrado"));

    sesionClinica.setAgendamiento_atencion(agendamientoAtencion);
    sesionClinica.setServicio_profesional(servicioProfesional);
    sesionClinica.setEmpezada_en(empezada_en);
    sesionClinica.setTerminada_en(terminada_en);
    sesionClinica.setFecha_atencion(fecha_atencion);
    sesionClinica.setEstado(Estado.valueOf(estado));
    sesionClinica.setCreado_en(LocalDateTime.now());
    
    
    return repositorioSesionClinica.save(sesionClinica);
}

    public void eliminarSesionClinica(@NonNull SesionClinica sesionClinica){
        repositorioSesionClinica.delete(sesionClinica);
    }

}