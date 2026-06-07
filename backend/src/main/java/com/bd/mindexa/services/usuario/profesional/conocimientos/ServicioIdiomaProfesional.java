package com.bd.mindexa.services.usuario.profesional.conocimientos;

import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.Idioma;
import com.bd.mindexa.models.usuario.profesional.ProfesionalIdioma;
import com.bd.mindexa.repository.usuario.RepositorioProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioIdioma;
import com.bd.mindexa.repository.usuario.profesional.RepositorioIdiomaProfesional;

import io.micrometer.common.lang.NonNull;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioIdiomaProfesional {

    private final RepositorioIdiomaProfesional repositorioIdiomaProfesional;
    private final RepositorioIdioma repositorioIdioma;
    private final RepositorioProfesional repositorioUsuarioProfesional;
    

    public void crearIdiomaYProfesional(String idioma, int id_usuario_profesional, String nivelHabilidad){
        
        ProfesionalIdioma profesionalIdioma = new ProfesionalIdioma();
        
        Idioma buscarIdioma = repositorioIdioma.findByIdiomaIgnoreCase(idioma)
        .orElseThrow(() -> new RuntimeException("Idioma no encontrado"));
        
        Profesional profesional = repositorioUsuarioProfesional.findById(id_usuario_profesional)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        profesionalIdioma.setIdioma(buscarIdioma);
        profesionalIdioma.setId_profesional_idioma(profesional.getId_profesional());
        profesionalIdioma.setNivel_habilidad(ProfesionalIdioma.NivelHabilidad.valueOf(nivelHabilidad));

        repositorioIdiomaProfesional.save(profesionalIdioma);
      
    }

    public void eliminarIdiomaProfesional(@NonNull ProfesionalIdioma profesionalIdioma){
        repositorioIdiomaProfesional.delete(profesionalIdioma);
    }

}
