package com.bd.mindexa.repository.usuario.profesional;
import com.bd.mindexa.models.usuario.profesional.Idioma;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioIdioma extends JpaRepository<Idioma, Integer>{

Optional<Idioma> findByIdiomaIgnoreCase(String idioma);


}
