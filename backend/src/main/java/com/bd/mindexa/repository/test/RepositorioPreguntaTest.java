package com.bd.mindexa.repository.test;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.test.PreguntaTest;

public interface RepositorioPreguntaTest extends JpaRepository<PreguntaTest,Integer>{
Optional<PreguntaTest> findById(int id_pregunta_test);
}
