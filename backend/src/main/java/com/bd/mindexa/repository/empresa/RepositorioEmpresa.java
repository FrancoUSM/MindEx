package com.bd.mindexa.repository.empresa;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bd.mindexa.models.empresa.Empresa;


public interface RepositorioEmpresa extends JpaRepository<Empresa, Integer> {

    Optional<Empresa> findByRazonSocialIgnoreCase(String razonSocial);
}
