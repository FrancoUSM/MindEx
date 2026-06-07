package com.bd.mindexa.repository.sesion_usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.sesion_usuario.SesionUsuario;

public interface RepositorioSesionUsuario extends JpaRepository<SesionUsuario,Integer>{
Optional<SesionUsuario> findById(int id_sesion_usuario);

}
