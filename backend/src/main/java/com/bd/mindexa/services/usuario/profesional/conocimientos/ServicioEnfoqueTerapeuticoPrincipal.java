package com.bd.mindexa.services.usuario.profesional.conocimientos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.EnfoqueTerapeutico;
import com.bd.mindexa.models.usuario.profesional.EnfoqueTerapeuticoPrincipal;
//import com.bd.mindexa.repository.usuario.RepositorioUsuarioProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioEnfoqueTerapeutico;
import com.bd.mindexa.repository.usuario.profesional.RepositorioEnfoqueTerapeuticoPrincipal;

import io.micrometer.common.lang.NonNull;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioEnfoqueTerapeuticoPrincipal {

    private final RepositorioEnfoqueTerapeutico repositorioEnfoqueTerapeutico;
    private final RepositorioEnfoqueTerapeuticoPrincipal repositorioEnfoqueTerapeuticoPrincipal;


    public EnfoqueTerapeuticoPrincipal crearEnfoqueTerapeuticoPrincipal(Profesional profesional, String enfoque_terapeutico){
        EnfoqueTerapeuticoPrincipal enfoqueTerapeuticoPrincipal = new EnfoqueTerapeuticoPrincipal();
        
        EnfoqueTerapeutico buscarEnfoqueTerapeutico = repositorioEnfoqueTerapeutico.findByNombreEnfoque(enfoque_terapeutico)
        .orElseThrow(() -> new RuntimeException("Enfoque terapéutico no encontrado"));

        enfoqueTerapeuticoPrincipal.setUsuario_profesional(profesional);
        enfoqueTerapeuticoPrincipal.setEnfoqueTerapeutico(buscarEnfoqueTerapeutico);

        return repositorioEnfoqueTerapeuticoPrincipal.save(enfoqueTerapeuticoPrincipal);

    }

    public void actualizarEnfoqueTerapeuticoPrincipal(EnfoqueTerapeuticoPrincipal enfoqueTerapeuticoPrincipal, String enfoque_terapeutico){

        EnfoqueTerapeutico enfoqueTerapeutico = repositorioEnfoqueTerapeutico.findByNombreEnfoque(enfoque_terapeutico)
        .orElseThrow(() -> new RuntimeException("Enfoque terapéutico no encontrado"));
        
        if (enfoqueTerapeutico.getId_enfoque_terapeutico() != enfoqueTerapeuticoPrincipal.getEnfoqueTerapeutico().getId_enfoque_terapeutico()){
            enfoqueTerapeuticoPrincipal.setEnfoqueTerapeutico(enfoqueTerapeutico);
        }

        repositorioEnfoqueTerapeuticoPrincipal.save(enfoqueTerapeuticoPrincipal);

    }

    public void eliminarEnfoqueTerapeuticoPrincipal(@NonNull EnfoqueTerapeuticoPrincipal enfoqueTerapeuticoPrincipal){
        repositorioEnfoqueTerapeuticoPrincipal.delete(enfoqueTerapeuticoPrincipal);
    }

}
