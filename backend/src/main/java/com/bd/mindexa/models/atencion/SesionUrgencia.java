package com.bd.mindexa.models.atencion;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "sesion_urgencia")
public class SesionUrgencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion_urgencia")
    private int id_sesion_urgencia;

    @ManyToOne
    @JoinColumn(name = "id_servicio_profesional")
    private ServicioProfesional servicio_profesional;

    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    private String contenido;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
}   
