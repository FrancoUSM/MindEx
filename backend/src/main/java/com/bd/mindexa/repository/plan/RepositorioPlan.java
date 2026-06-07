package com.bd.mindexa.repository.plan;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bd.mindexa.models.plan.Plan;

public interface RepositorioPlan extends JpaRepository<Plan,Integer>{
Optional<Plan> findById(int id_plan);
}
