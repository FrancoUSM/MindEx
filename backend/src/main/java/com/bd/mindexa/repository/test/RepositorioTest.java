package com.bd.mindexa.repository.test;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.test.Test;

public interface RepositorioTest extends JpaRepository<Test,Integer>{
Optional<Test> findById(int id_test);

}
