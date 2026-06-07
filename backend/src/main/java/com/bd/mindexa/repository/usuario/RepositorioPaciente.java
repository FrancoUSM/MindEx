package com.bd.mindexa.repository.usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.Paciente;

public interface RepositorioPaciente extends JpaRepository<Paciente,Integer>{
Optional<Paciente> findById(int id_paciente);
Optional<Paciente> findByUsuario(com.bd.mindexa.models.usuario.Usuario usuario);
}
