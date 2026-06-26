package com.bd.mindexa.dto.admin;

public record DTOPacienteEmpresa(
        int id_paciente, 
        int id_empleado,
        String nombre,
        String apellido,
        String correo,
        String rol,
        String cargo,
        String turno,
        String faena) {

}
