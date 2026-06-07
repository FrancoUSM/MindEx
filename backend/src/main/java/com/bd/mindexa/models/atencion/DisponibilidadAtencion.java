package com.bd.mindexa.models.atencion;


import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Profesional;

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
@Table(name = "disponibilidad_atencion")
public class DisponibilidadAtencion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_disponibilidad_atencion")
    private int id_disponibilidad_atencion;
    
    @ManyToOne
    @JoinColumn(name = "id_profesional")
    private Profesional profesional;

    private LocalDate dia;
    private LocalDateTime hora_inicio;
    private LocalDateTime hora_fin;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    

}
