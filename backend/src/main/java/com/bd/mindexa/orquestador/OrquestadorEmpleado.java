package com.bd.mindexa.orquestador;

import org.springframework.stereotype.Service;

import com.bd.mindexa.services.usuario.ServicioEmpleado;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor


public class OrquestadorEmpleado {
    private final ServicioEmpleado servicioEmpleado;

}
