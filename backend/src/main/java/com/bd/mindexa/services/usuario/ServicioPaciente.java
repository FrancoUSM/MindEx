package com.bd.mindexa.services.usuario;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.admin.DTOPacientePanel;
import com.bd.mindexa.models.usuario.Empleado;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.repository.usuario.RepositorioEmpleado;
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
    private final RepositorioEmpleado repositorioEmpleado;

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

    public void eliminarPaciente(Paciente paciente){
        repositorioPaciente.delete(paciente);
    }

    public Paciente getPacienteById(int id){
        return repositorioPaciente.findById(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }

public List<DTOPacientePanel> getPacientesEmpresa(int id_usuario_admin) {

    Usuario admin = repositorioUsuario.findById(id_usuario_admin).orElseThrow();

    Empleado empleadoAdmin = repositorioEmpleado.findByUsuario(admin).orElseThrow();

    int id_empresa = empleadoAdmin.getEmpresa().getId_empresa();

    return repositorioPaciente.findPacientesByEmpresa(id_empresa);
}

}
