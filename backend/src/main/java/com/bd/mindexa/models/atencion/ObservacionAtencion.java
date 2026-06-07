package com.bd.mindexa.models.atencion;
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
@Table(name = "observacion_atencion")
public class ObservacionAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_observacion_atencion")
    private int id_observacion_atecion;

    @ManyToOne
    @JoinColumn(name = "id_sesion_clinica")
    private SesionClinica sesionClinica;

    @ManyToOne
    @JoinColumn(name = "id_profesional")
    private Profesional profesional;



    private String observacion;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;



}
