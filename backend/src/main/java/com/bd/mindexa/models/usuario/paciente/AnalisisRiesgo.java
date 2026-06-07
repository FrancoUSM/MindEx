package com.bd.mindexa.models.usuario.paciente;
import java.time.LocalDateTime;


import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "analisis_riesgo")
@Setter
@Getter
public class AnalisisRiesgo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_analisis_riesgo")
    private int id_analisis_riesgo;

    @ManyToOne
    @JoinColumn(name = "id_historial_paciente")
    private HistorialPaciente historialPaciente;

    private String contenido_analisis;
    public enum EstadoRiesgo{RIESGO_ALTO, RIESGO_BAJO, RIESGO_MEDIANO}
    @Enumerated(EnumType.STRING)
    public EstadoRiesgo estado_riesgo;
    private LocalDateTime fecha_analisis;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

    // Campos IDSM-Plus
    private Integer p1;
    private Integer p2;
    private Integer p3;
    private Integer p4;
    private Integer p5;
    private Integer p6;
    private Integer p7;
    private Integer p8;
    private Integer id_score;
    private Integer ir_score;
    private Integer rhi_score;
    private String color_base;
    private String color_final;
    private Boolean flag_convergencia_critica;
    private Boolean flag_somnolencia_critica;
    private Boolean flag_estres_desregulado;
}
