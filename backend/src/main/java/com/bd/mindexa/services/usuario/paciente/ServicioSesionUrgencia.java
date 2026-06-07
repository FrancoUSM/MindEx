package com.bd.mindexa.services.usuario.paciente;


import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.atencion.SesionUrgencia;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;
import com.bd.mindexa.repository.atencion.RepositorioSesionUrgencia;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
import com.bd.mindexa.repository.usuario.profesional.RepositorioServicioProfesional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioSesionUrgencia {

    private final RepositorioSesionUrgencia repositorioSesionUrgencia;
    private final RepositorioServicioProfesional repositorioServicioProfesional;
    private final RepositorioPaciente repositorioPaciente;

    public SesionUrgencia obtenerSesionUrgencia(int id_sesion_urgencia){
        return repositorioSesionUrgencia.findById(id_sesion_urgencia)
            .orElseThrow(() -> new RuntimeException("Sesión de urgencia no encontrada"));
    }

    public SesionUrgencia crearSesionUrgencia(int id_servicio_profesional, int id_paciente, String contenido){
        SesionUrgencia sesionUrgencia = new SesionUrgencia();
        
        Paciente paciente = repositorioPaciente.findById(id_paciente).
            orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        ServicioProfesional servicioProfesional = repositorioServicioProfesional.findById(id_servicio_profesional).
            orElseThrow(() -> new RuntimeException("Agendamiento del paciente no encontrado"));

        sesionUrgencia.setServicio_profesional(servicioProfesional);
        sesionUrgencia.setPaciente(paciente);
        sesionUrgencia.setContenido(contenido);
        sesionUrgencia.setCreado_en(LocalDateTime.now());
        

        return repositorioSesionUrgencia.save(sesionUrgencia);

    }

    public SesionUrgencia actualizarSesionUrgencia(int id_sesion_urgencia, String contenido){
        SesionUrgencia sesionUrgencia = repositorioSesionUrgencia.findById(id_sesion_urgencia).
            orElseThrow(() -> new RuntimeException("Sesión de urgencia no encontrada"));

        sesionUrgencia.setContenido(contenido);
        sesionUrgencia.setActualizado_en(LocalDateTime.now());

        return repositorioSesionUrgencia.save(sesionUrgencia);
    }

    public void eliminarSesionUrgencia(int id_sesion_urgencia){
        SesionUrgencia sesionUrgencia = repositorioSesionUrgencia.findById(id_sesion_urgencia).
            orElseThrow(() -> new RuntimeException("Sesión de urgencia no encontrada"));

        repositorioSesionUrgencia.delete(sesionUrgencia);
    }

}
