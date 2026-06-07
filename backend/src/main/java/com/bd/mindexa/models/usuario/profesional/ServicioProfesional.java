package com.bd.mindexa.models.usuario.profesional;
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
@Table(name = "servicio_profesional")
public class ServicioProfesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio_profesional")
    private int id_servicio_profesional;

    @ManyToOne
    @JoinColumn(name = "id_profesional")
    private Profesional profesional;

    private String nombreServicio;
    private String tipo_servicio;
    private int precio_servicio;
    private String descripcion_servicio;
    private int duracion_servicio;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;
    
    
}
