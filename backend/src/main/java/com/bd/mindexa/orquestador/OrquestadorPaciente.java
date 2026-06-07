package com.bd.mindexa.orquestador;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTORegistroPaciente;
import com.bd.mindexa.models.servicio.Servicio;
import com.bd.mindexa.models.suscripcion.PacienteSuscrito;
import com.bd.mindexa.models.suscripcion.Suscripcion;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.services.suscripcion.ServicioPacienteSuscrito;
import com.bd.mindexa.services.suscripcion.ServicioSuscripcion;
import com.bd.mindexa.services.usuario.ServicioPaciente;
import com.bd.mindexa.services.usuario.paciente.historial.ServicioHistorialPaciente;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service

public class OrquestadorPaciente {

    private final ServicioPaciente servicioPaciente;
    private final ServicioPacienteSuscrito servicioPacienteSuscrito;
    private final ServicioSuscripcion servicioSuscripcion;
    private final ServicioHistorialPaciente servicioHistorialPaciente;

    @Transactional
    public void crearPacienteYAsignarSuscripcion(DTORegistroPaciente request){
        //Crear paciente
        Paciente paciente = servicioPaciente.crearPaciente(request.id_usuario);
        Suscripcion suscripcion = servicioSuscripcion.getSuscripcionById(request.id_suscripcion);
        
        PacienteSuscrito pacienteSuscrito = servicioPacienteSuscrito.crearPacienteSuscrito(paciente.getId_paciente(), suscripcion.getId_suscripcion());
        HistorialPaciente historialPaciente = servicioHistorialPaciente.crearHistorialPaciente(paciente.getId_paciente());

        
    }

}
