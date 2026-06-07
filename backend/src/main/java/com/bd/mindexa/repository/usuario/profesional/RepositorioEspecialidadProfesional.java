package com.bd.mindexa.repository.usuario.profesional;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.EspecialidadProfesional;

public interface RepositorioEspecialidadProfesional extends JpaRepository<EspecialidadProfesional, Integer> {
List<EspecialidadProfesional> findByUsuarioProfesional(Profesional usuarioProfesional);
}
