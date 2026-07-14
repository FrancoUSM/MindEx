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

    private final RepositorioEmpleado repositorioEmpleado; // final aquí es correcto
    private final RepositorioEmpresa repositorioEmpresa;
    private final ServicioUsuario servicioUsuario;

    public List<Empleado> getUsuarios() {
        return repositorioEmpleado.findAll();
    }

    public Empleado getUsuarioById(int id) {
        return repositorioEmpleado.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }



    @Transactional
    public Usuario registrarEmpleado(DTORegistroUsuarioEmpresaRequest request) {

    //🔹 1. Crear Usuario
    log.info("Rol recibido desde frontend: {}", request.rol);
    Usuario usuario = servicioUsuario.registrarUsuarioPublico(request.nombre, request.apellido, request.correo, request.telefono, request.rol, request.contrasena);

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

    repositorioEmpleado.save(empleado);
    log.info("Usuario {} registrado correctamente", request.correo);
    return usuario;
}


    public Empleado actualizarEmpleado(Empleado empleado) {
        @SuppressWarnings("unused")
        Empleado empleadoExistente = repositorioEmpleado.findById(empleado.getId_empleado())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para actualizar"));


        Empleado empleadoActualizado = repositorioEmpleado.save(empleado);
        log.info("Usuario con id {} actualizado correctamente", empleadoActualizado.getId_empleado());
        return empleadoActualizado;
    }


    public Empleado actualizarDatosLaborales(int id_empleado, String cargo, String turno, String faena){

    Empleado empleado = repositorioEmpleado.findById(id_empleado)
    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

    empleado.setCargo(cargo);
    empleado.setTurno(turno);
    empleado.setFaena(faena);

    return repositorioEmpleado.save(empleado);
}

@Transactional
public void desactivarEmpleado(int idEmpleado) {

    Empleado empleado = repositorioEmpleado.findById(idEmpleado)
        .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

    servicioUsuario.desactivarUsuario(empleado.getUsuario());
}

    public void eliminarEmpleado(int id) {
        if (repositorioEmpleado.existsById(id)) {
            repositorioEmpleado.deleteById(id);
            log.info("Usuario con id {} eliminado correctamente", id);
        } else {
            log.warn("Intento de eliminar usuario con id {} que no existe", id);
        }
    }
}



