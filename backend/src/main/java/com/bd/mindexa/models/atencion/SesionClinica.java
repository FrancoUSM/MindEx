package com.bd.mindexa.models.atencion;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "sesion_clinica")
public class SesionClinica {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id_sesion_clinica")
    private int id_atencion_agendada;

    @ManyToOne
    @JoinColumn(name = "id_servicio_profesional")
    private ServicioProfesional servicio_profesional;

    @ManyToOne
    @JoinColumn(name = "id_agendamiento_atencion")
    private AgendamientoAtencion agendamiento_atencion;

    private LocalDate fecha_atencion;
    private LocalDateTime empezada_en;
    private LocalDateTime terminada_en;
    @Enumerated(EnumType.STRING)
    private Estado estado;
    public enum Estado{ACTIVO, INACTIVO}
    private LocalDateTime creado_en;
    



}
