package com.bd.mindexa.services.usuario;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;

import io.micrometer.common.lang.NonNull;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional

public class ServicioPaciente {
    private final RepositorioPaciente repositorioPaciente;
    private final RepositorioUsuario repositorioUsuario;

    public Paciente crearPaciente(int id_usuario){
        
    Paciente paciente = new Paciente();
    Usuario usuario = repositorioUsuario.findById(id_usuario).
    orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
    paciente.setUsuario(usuario);
    paciente.setCreado_en(LocalDateTime.now());

    return repositorioPaciente.save(paciente);
    }

    public void desactivarPaciente(Paciente paciente){
        paciente.setDesactivado_en(LocalDateTime.now());
        repositorioPaciente.save(paciente);
    }

    public void eliminarPaciente(@NonNull Paciente paciente){
        repositorioPaciente.delete(paciente);
    }

    public Paciente getPacienteById(int id){
        return repositorioPaciente.findById(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }

}
