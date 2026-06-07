package com.bd.mindexa.models.usuario.profesional;
import jakarta.persistence.GeneratedValue;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Profesional;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "certificaciones")
public class Certificaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_certificacion")
    private int id_certificacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario_profesional")
    private Profesional profesional;
    
    private String tipo_certificacion;
    private String nombre_certificacion;
    private String institucion_emisora;
    private LocalDate fecha_obtencion;
    private LocalDate fecha_expiracion;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

}
