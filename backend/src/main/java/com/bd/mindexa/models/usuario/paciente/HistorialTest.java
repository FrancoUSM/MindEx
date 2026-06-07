package com.bd.mindexa.models.usuario.paciente;

import jakarta.persistence.GeneratedValue;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "historial_test")
public class HistorialTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id_historial_test")
    private int id_historial_test;

    @ManyToOne
    @JoinColumn(name = "id_historial_paciente")
    private HistorialPaciente historial_paciente;

    @ManyToOne
    @JoinColumn(name = "id_analisis_test")
    private AnalisisTest analisis_test;

    private LocalDate fecha_resultado;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;


}
