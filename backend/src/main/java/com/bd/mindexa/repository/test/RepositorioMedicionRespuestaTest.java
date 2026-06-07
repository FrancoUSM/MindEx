package com.bd.mindexa.repository.test;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.test.MedicionRespuestaTest;

public interface RepositorioMedicionRespuestaTest extends JpaRepository<MedicionRespuestaTest, Integer>{
Optional<MedicionRespuestaTest> findById(int id_medicion_respuesta_test);
}
