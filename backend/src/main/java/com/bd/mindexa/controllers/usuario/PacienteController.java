package com.bd.mindexa.controllers.usuario;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.panel.DTOPacientePanel;
import com.bd.mindexa.dto.registros.DTORegistroPaciente;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.orquestador.OrquestadorPaciente;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/paciente")
@RequiredArgsConstructor
@Validated
public class PacienteController {

    private final OrquestadorPaciente orquestadorPaciente;
    private final com.bd.mindexa.services.usuario.ServicioPaciente servicioPaciente;

    @PostMapping("/crear-paciente")
    public ResponseEntity<Map<String,String>> crearPacienteCompleto(
            @RequestBody com.bd.mindexa.dto.registros.DTORegistroPaciente request) {

        if (request == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Datos de paciente no proporcionados"));
        }

        orquestadorPaciente.crearPacienteYAsignarSuscripcion(request);
        return ResponseEntity.ok(Map.of("message", "Paciente creado y suscripción asignada correctamente"));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Paciente> getPacienteById(@PathVariable int id) {
        return ResponseEntity.ok(servicioPaciente.getPacienteById(id));
    }


    @GetMapping("/empresa/{id_usuario}")
    public ResponseEntity<List<DTOPacientePanel>> getPacientesEmpresa(@PathVariable int id_usuario){
        return ResponseEntity.ok(servicioPaciente.getPacientesEmpresa(id_usuario));
}

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Map<String,String>> eliminarPaciente(@PathVariable int id){
        Paciente paciente = servicioPaciente.getPacienteById(id);
        servicioPaciente.desactivarPaciente(paciente);
        return ResponseEntity.ok(Map.of("message", "Paciente eliminado correctamente"));
    }

}
