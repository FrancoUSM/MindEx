package com.bd.mindexa.models.usuario.paciente;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.atencion.SesionClinica;

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
@Table(name = "historial_sesion_clinica")
@Setter
@Getter
public class HistorialSesionClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_sesion_clinica")
    private int id_historial_sesion_clinica;

    @ManyToOne
    @JoinColumn(name = "id_historial_paciente")
    private HistorialPaciente historial_paciente;

    @ManyToOne
    @JoinColumn(name = "id_sesion_clinica")
    private SesionClinica sesion_clinica;

    private LocalDate fecha_resultado;
    private LocalDateTime creado_en;
    private LocalDateTime desactivado_en; 
}
