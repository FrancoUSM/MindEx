package com.bd.mindexa.repository.usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bd.mindexa.dto.admin.DTOPacienteEmpresa;
import com.bd.mindexa.dto.admin.DTOPacientePanel;
import com.bd.mindexa.models.usuario.Paciente;

public interface RepositorioPaciente extends JpaRepository<Paciente,Integer>{
Optional<Paciente> findById(int id_paciente);
Optional<Paciente> findByUsuario(com.bd.mindexa.models.usuario.Usuario usuario);
@Query("""
SELECT new com.bd.mindexa.dto.admin.DTOPacientePanel(
    p.id_paciente,
    u.nombre,
    u.apellido,
    u.correo,
    e.cargo,
    e.turno,
    e.faena
)
FROM Paciente p
JOIN p.usuario u
JOIN Empleado e ON e.usuario = u
WHERE e.empresa.id_empresa = :id_empresa
""")
List<DTOPacientePanel> findPacientesByEmpresa(@Param("id_empresa") int id_empresa);


@Query("""
SELECT new com.bd.mindexa.dto.admin.DTOPacienteEmpresa(
    p.id_paciente,
    e.id_empleado,
    u.nombre,
    u.apellido,
    u.correo,
    u.rol,
    e.cargo,
    e.turno,
    e.faena
)
FROM Paciente p
JOIN p.usuario u
JOIN Empleado e ON e.usuario = u
WHERE e.empresa.id_empresa = :id_empresa""")
List<DTOPacienteEmpresa> findPacientesByEmpresa(
        @Param("id_empresa") Integer id_empresa
);



}

