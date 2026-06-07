package com.bd.mindexa.models.usuario.paciente;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;

import com.bd.mindexa.models.atencion.SesionClinica;
import com.bd.mindexa.models.atencion.SesionUrgencia;
import com.bd.mindexa.models.usuario.Paciente;

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
@Table(name = "calificacion_profesional")
@Setter
@Getter
public class CalificacionProfesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calificacion_profesional")
    private int id_calificacion_profesional;

    @OneToOne
    @JoinColumn(name = "id_sesion_clinica")
    private SesionClinica sesion_clinica;

    @OneToOne
    @JoinColumn(name = "id_sesion_urgencia")
    private SesionUrgencia sesion_urgencia;

    @OneToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    private int puntaje;
    private String observacion;
    private LocalDateTime creado_en;
    

}
