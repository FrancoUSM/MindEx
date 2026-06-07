package com.bd.mindexa.services.usuario.paciente;
import java.time.LocalDateTime;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.SesionClinica;
import com.bd.mindexa.models.atencion.SesionUrgencia;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.paciente.CalificacionProfesional;
import com.bd.mindexa.repository.atencion.RepositorioSesionClinica;
import com.bd.mindexa.repository.atencion.RepositorioSesionUrgencia;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
import com.bd.mindexa.repository.usuario.paciente.RepositorioCalificacionProfesional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioCalificacionProfesional {

    private final RepositorioCalificacionProfesional repositorioCalificacionProfesional;
    private final RepositorioSesionClinica repositorioSesionClinica;
    private final RepositorioSesionUrgencia repositorioSesionUrgencia;
    private final RepositorioPaciente repositorioPaciente;

    public CalificacionProfesional crearCalificacionProfesional(Integer id_sesion_urgencia, Integer id_sesion_clinica, int id_paciente, int puntaje, String observacion){
        CalificacionProfesional calificacionProfesional = new CalificacionProfesional();

        if (id_sesion_urgencia != null){ 
            SesionUrgencia sesionUrgencia = repositorioSesionUrgencia.findById(id_sesion_urgencia).
            orElseThrow(() -> new RuntimeException("Sesion de urgencia no encontrada"));
            calificacionProfesional.setSesion_urgencia(sesionUrgencia);
            
        }else if (id_sesion_clinica != null) {
         
            SesionClinica sesionClinica = repositorioSesionClinica.findById(id_sesion_clinica).
            orElseThrow(() -> new RuntimeException("Sesion clinica no encontrada"));
            calificacionProfesional.setSesion_clinica(sesionClinica);

        }else{
            throw new RuntimeException("Debe proporcionar un tipo de sesion de atencion");
        }
        Paciente paciente = repositorioPaciente.findById(id_paciente).
            orElseThrow(() -> new RuntimeException("Paciente no encontrado/a"));

        calificacionProfesional.setPaciente(paciente);
        calificacionProfesional.setPuntaje(puntaje);
        calificacionProfesional.setObservacion(observacion);
        calificacionProfesional.setCreado_en(LocalDateTime.now());

        return repositorioCalificacionProfesional.save(calificacionProfesional);
    }

    public void eliminarCalificacionProfesional(@NonNull CalificacionProfesional calificacionProfesional){
        repositorioCalificacionProfesional.delete(calificacionProfesional);
    }

    public CalificacionProfesional obtenerCalificacionProfesional(int id){
        return repositorioCalificacionProfesional.findById(id).
        orElseThrow(() -> new RuntimeException("Calificacion no encontrada"));
    }

    //

}
