package com.bd.mindexa.models.test;
import jakarta.persistence.GeneratedValue;

import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Paciente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "test_paciente")

public class TestPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_test_paciente")
    private int id_test_paciente;

    @ManyToOne
    @JoinColumn(name = "id_test")
    private Test test;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;
    
    private String estado; // Ejemplo: "en progreso", "completado"
    private LocalDateTime iniciado_en;
    private LocalDateTime completado_en;

}
