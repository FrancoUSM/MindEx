package com.bd.mindexa.repository.usuario.profesional;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.ProfesionalIdioma;

public interface RepositorioIdiomaProfesional extends JpaRepository<ProfesionalIdioma, Integer> {
List<ProfesionalIdioma> findByUsuarioProfesional(Profesional usuarioProfesional);
}
