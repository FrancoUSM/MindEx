package com.bd.mindexa.models.usuario.paciente;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "alerta_riesgo")
@Setter
@Getter
public class AlertasRiesgo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alerta_riesgo")
    private int id_alerta_riesgo;

    @OneToOne
    @JoinColumn(name = "id_analisis_riesgo")
    private AnalisisRiesgo analisis_riesgo;

    private LocalDate fecha_alerta;
    private String contenido_alerta;
    private LocalDateTime creado_en;
}
