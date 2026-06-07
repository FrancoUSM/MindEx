package com.bd.mindexa.services.usuario;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.bd.mindexa.dto.registros.DTORegistroUsuarioEmpresaRequest;
import com.bd.mindexa.models.empresa.Empresa;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.Empleado;
import com.bd.mindexa.repository.empresa.RepositorioEmpresa;
import com.bd.mindexa.repository.usuario.RepositorioEmpleado;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioEmpleado {

    private final RepositorioEmpleado repositorioUsuarioEmpresa; // final aquí es correcto
    private final RepositorioEmpresa repositorioEmpresa;
    private final ServicioUsuario servicioUsuario;

    public List<Empleado> getUsuarios() {
        return repositorioUsuarioEmpresa.findAll();
    }

    public Empleado getUsuarioById(int id) {
        return repositorioUsuarioEmpresa.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }



    @Transactional
    public Usuario registrarUsuarioEmpresa(DTORegistroUsuarioEmpresaRequest request) {

    //🔹 1. Crear Usuario
    Usuario usuario = servicioUsuario.crearUsuario(request.nombre, request.apellido, request.correo, request.telefono, request.rol, request.estado, request.contrasena);

    // 🔹 2. Obtener Empresa
    Empresa empresa = repositorioEmpresa.findByRazonSocialIgnoreCase(request.razonSocial)
            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    log.info("Empresa {} encontrada para el nuevo usuario", empresa.getRazonSocial());
    // 🔹 3. Crear relación UsuarioEmpresa
    Empleado empleado = new Empleado();
    empleado.setUsuario(usuario);
    empleado.setEmpresa(empresa);
    empleado.setCargo(request.cargo);
    empleado.setTurno(request.turno);
    empleado.setFaena(request.faena);
    empleado.setContratista(request.contratista);
    empleado.setCreado_en(LocalDateTime.now());
    empleado.setActualizado_en(LocalDateTime.now());

    repositorioUsuarioEmpresa.save(empleado);
    log.info("Usuario {} registrado correctamente", request.correo);
    return usuario;
}


    public Empleado actualizarUsuario(Empleado usuario) {
        @SuppressWarnings("unused")
        Empleado usuarioExistente = repositorioUsuarioEmpresa.findById(usuario.getId_empleado())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para actualizar"));


        Empleado usuarioActualizado = repositorioUsuarioEmpresa.save(usuario);
        log.info("Usuario con id {} actualizado correctamente", usuarioActualizado.getId_empleado());
        return usuarioActualizado;
    }

    public void eliminarUsuario(int id) {
        if (repositorioUsuarioEmpresa.existsById(id)) {
            repositorioUsuarioEmpresa.deleteById(id);
            log.info("Usuario con id {} eliminado correctamente", id);
        } else {
            log.warn("Intento de eliminar usuario con id {} que no existe", id);
        }
    }
}



