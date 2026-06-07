package com.bd.mindexa.services.suscripcion;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.suscripcion.PacienteSuscrito;
import com.bd.mindexa.repository.suscripcion.RepositorioPacienteSuscrito;
import com.bd.mindexa.repository.suscripcion.RepositorioSuscripcion;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioPacienteSuscrito {
private final RepositorioPacienteSuscrito repositorioPacienteSuscrito;
private final RepositorioPaciente repositorioPaciente;
private final RepositorioSuscripcion repositorioSuscripcion;

public PacienteSuscrito crearPacienteSuscrito(int id_paciente, int id_suscripcion){
    PacienteSuscrito pacienteSuscrito = new PacienteSuscrito();
    
    repositorioPaciente.findById(id_paciente).
            orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

    repositorioSuscripcion.findById(id_suscripcion).
            orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
    
    pacienteSuscrito.setPaciente(repositorioPaciente.findById(id_paciente).get());
    pacienteSuscrito.setSuscripcion(repositorioSuscripcion.findById(id_suscripcion).get());

    return repositorioPacienteSuscrito.save(pacienteSuscrito);
}

public void eliminarPacienteSuscrito(@NonNull PacienteSuscrito pacienteSuscrito){
    repositorioPacienteSuscrito.delete(pacienteSuscrito);
}

public void actualizarPacienteSuscrito(PacienteSuscrito pacienteSuscrito, int id_paciente, int id_suscripcion){
    repositorioPaciente.findById(id_paciente).
            orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
}

public void desactivarPacienteSuscrito(int id){
    PacienteSuscrito pacienteSuscrito = repositorioPacienteSuscrito.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente Suscrito no encontrado"));
    pacienteSuscrito.setDesactivado_en(LocalDateTime.now());
    repositorioPacienteSuscrito.save(pacienteSuscrito);
}

}
