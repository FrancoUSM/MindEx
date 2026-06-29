package com.bd.mindexa.dto.admin;
import com.bd.mindexa.models.usuario.Usuario.Rol;

public record DTOPacienteEmpresa(
        int id_paciente, 
        int id_empleado,
        String nombre,
        String apellido,
        String correo,
        Rol rol,
        String cargo,
        String turno,
        String faena) {

}
