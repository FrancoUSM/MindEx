package com.bd.mindexa.repository.test;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.test.TestPaciente;

public interface RepositorioTestPaciente extends JpaRepository<TestPaciente, Integer> {
    
} 


