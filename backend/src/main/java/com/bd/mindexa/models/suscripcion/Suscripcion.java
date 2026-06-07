package com.bd.mindexa.models.suscripcion;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.empresa.Empresa;
import com.bd.mindexa.models.plan.Plan;

import jakarta.persistence.GeneratedValue;
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
@Table(name = "suscripcion")
public class Suscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suscripcion")
    private int id_suscripcion;

    @ManyToOne
    @JoinColumn(name = "id_plan")
    private Plan plan;
    

    @ManyToOne
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;

    private LocalDate fecha_inicio;
    private LocalDate fecha_fin;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

}
