package com.bd.mindexa.models.plan;
import java.time.LocalDateTime;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
@Entity
@Table(name = "plan")

public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_plan;
    private String nombre_plan;
    private String descripcion_plan;
    private String tipo_plan;
    private double precio_por_usuario;
    private double duracion_meses;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

   

}
