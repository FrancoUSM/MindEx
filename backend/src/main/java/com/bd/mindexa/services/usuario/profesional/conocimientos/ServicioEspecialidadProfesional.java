package com.bd.mindexa.services.usuario.profesional.conocimientos;

import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.Especialidad;
import com.bd.mindexa.models.usuario.profesional.EspecialidadProfesional;
//import com.bd.mindexa.repository.usuario.RepositorioUsuarioProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioEspecialidad;
import com.bd.mindexa.repository.usuario.profesional.RepositorioEspecialidadProfesional;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioEspecialidadProfesional {

private final RepositorioEspecialidadProfesional repositorioEspecialidadProfesional;
private final RepositorioEspecialidad repositorioEspecialidad;

    public void crearEspecialidadProfesional(Profesional profesional, String nombreEspecialidad){
        
        EspecialidadProfesional especialidadProfesional = new EspecialidadProfesional();
        

        Especialidad especialidad = repositorioEspecialidad.findByNombreEspecialidad(nombreEspecialidad)
        .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        especialidadProfesional.setUsuarioProfesional(profesional);
        especialidadProfesional.setEspecialidad(especialidad);

        repositorioEspecialidadProfesional.save(especialidadProfesional);

    }

    public void eliminarEspecialidadProfesional(@NonNull EspecialidadProfesional especialidadProfesional){
        
    repositorioEspecialidadProfesional.delete(especialidadProfesional);

    }

}
